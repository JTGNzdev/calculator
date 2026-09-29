/**
 * Pure calculator behavior.
 *
 * This module holds all domain logic as plain functions over an explicit
 * state object. There is no React, no DOM, and no classes here: the future
 * UI only needs `applyAction`, `formatDisplay`, and `formatExpression`.
 *
 * Semantics:
 * - `currentInput` is the editable operand as a string. Numbers only appear
 *   at the arithmetic boundary: operands are parsed right before computing
 *   and formatted right after, so `NaN`/`Infinity` never leak into the
 *   editable state. Oversized direct input is ignored when a digit,
 *   decimal, or sign transition would overflow the operand to a
 *   non-finite value; ordinary large finite values are preserved.
 * - While `overwrite` is true the next digit/decimal starts a new operand
 *   instead of appending (after `=`, or while waiting for the right operand).
 * - Pressing an operator when a complete `left op right` expression is
 *   pending executes it immediately, strictly left to right.
 * - Pressing an operator before the right operand is entered replaces the
 *   pending operator.
 * - `=` only computes when both operands exist; otherwise it is a safe
 *   no-op.
 * - Division by zero and non-finite results enter a typed, recoverable
 *   error state. Only `clear` exits that state.
 */

import type {
  CalculatorAction,
  CalculatorError,
  CalculatorState,
  Digit,
  Operator,
} from './types';

/** Human-readable messages for the recoverable error states. */
export const ERROR_MESSAGES: Record<CalculatorError, string> = {
  'division-by-zero': 'Cannot divide by zero',
  'non-finite-result': 'Result is out of range',
};

const OPERATOR_SYMBOLS: Record<Operator, string> = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷',
};

/** Display symbol for an operator (`*` renders as `×`, `/` as `÷`). */
export function operatorSymbol(operator: Operator): string {
  return OPERATOR_SYMBOLS[operator];
}

/** Fresh state: a single `0` and nothing pending. */
export function createInitialState(): CalculatorState {
  return {
    currentInput: '0',
    accumulator: null,
    operator: null,
    overwrite: false,
    lastExpression: null,
    error: null,
  };
}

/**
 * Applies one user action and returns the next state.
 * Pure: the given state is never mutated.
 */
export function applyAction(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  // The error state freezes until `clear` is applied.
  if (state.error !== null && action.type !== 'clear') {
    return state;
  }
  switch (action.type) {
    case 'clear':
      return createInitialState();
    case 'digit':
      return enterDigit(state, action.digit);
    case 'decimal':
      return enterDecimal(state);
    case 'operator':
      return selectOperator(state, action.operator);
    case 'equals':
      return evaluate(state);
    case 'sign-toggle':
      return toggleSign(state);
    case 'delete':
      return deleteLastCharacter(state);
  }
}

/** Value the future UI shows as the current result or error message. */
export function formatDisplay(state: CalculatorState): string {
  return state.error !== null ? ERROR_MESSAGES[state.error] : state.currentInput;
}

/**
 * Value the future UI shows as the current expression:
 * `""` while entering the first operand, `"12 +"` while waiting for the
 * right operand, `"12 + 5"` while entering it, and `"12 + 5 ="` after `=`.
 */
export function formatExpression(state: CalculatorState): string {
  if (state.lastExpression !== null) {
    return `${state.lastExpression} =`;
  }
  if (state.operator !== null) {
    const left = formatNumber(state.accumulator as number);
    const symbol = operatorSymbol(state.operator);
    return state.overwrite
      ? `${left} ${symbol}`
      : `${left} ${symbol} ${state.currentInput}`;
  }
  return '';
}

function enterDigit(state: CalculatorState, digit: Digit): CalculatorState {
  if (state.overwrite) {
    // A computed value or an untyped operand is showing: start fresh.
    return {
      ...state,
      currentInput: digit,
      overwrite: false,
      lastExpression: null,
    };
  }
  const current = state.currentInput;
  let next: string;
  if (current === '0') {
    // Never build inputs like "05"; a lone zero stays a lone zero.
    next = digit === '0' ? '0' : digit;
  } else if (current === '-0') {
    next = digit === '0' ? '-0' : `-${digit}`;
  } else {
    next = current + digit;
  }
  // Direct-input invariant: `currentInput` always parses to a finite
  // number. A digit that would overflow the operand to `Infinity` is
  // ignored (the same no-op rule as a second decimal point), so
  // oversized direct input never places a non-finite value in the state
  // or expression display. Ordinary large finite values are preserved.
  if (!isFiniteOperand(next)) {
    return state;
  }
  return { ...state, currentInput: next, lastExpression: null };
}

function enterDecimal(state: CalculatorState): CalculatorState {
  if (state.overwrite) {
    // Start a fresh operand that begins with the decimal point.
    return {
      ...state,
      currentInput: '0.',
      overwrite: false,
      lastExpression: null,
    };
  }
  if (state.currentInput.includes('.')) {
    // At most one decimal point per operand.
    return state;
  }
  const next = `${state.currentInput}.`;
  // Direct-input invariant guard (same ignore rule as digits).
  if (!isFiniteOperand(next)) {
    return state;
  }
  return { ...state, currentInput: next, lastExpression: null };
}

function selectOperator(
  state: CalculatorState,
  nextOperator: Operator,
): CalculatorState {
  if (state.operator !== null && !state.overwrite) {
    // A complete expression is pending: execute it immediately, then keep
    // the new operator (immediate-execution chaining, left to right).
    const left = state.accumulator as number;
    const result = compute(left, state.operator, toNumber(state.currentInput));
    if (!result.ok) {
      return { ...state, error: result.error };
    }
    return {
      currentInput: formatNumber(result.value),
      accumulator: result.value,
      operator: nextOperator,
      overwrite: true,
      lastExpression: null,
      error: null,
    };
  }
  if (state.operator !== null && state.overwrite) {
    // The right operand has not been entered yet: replace the operator.
    return { ...state, operator: nextOperator, lastExpression: null };
  }
  // No pending operator: store the current value as the left operand.
  // After `=` this continues the calculation from the result.
  return {
    ...state,
    accumulator: toNumber(state.currentInput),
    operator: nextOperator,
    overwrite: true,
    lastExpression: null,
  };
}

function evaluate(state: CalculatorState): CalculatorState {
  // Incomplete (no pending operator, or right operand not entered): no-op.
  if (state.operator === null || state.overwrite) {
    return state;
  }
  // Invariant: `accumulator` is non-null whenever an operator is pending.
  const left = state.accumulator as number;
  const right = toNumber(state.currentInput);
  const attempted = `${formatNumber(left)} ${operatorSymbol(state.operator)} ${formatNumber(right)}`;
  const result = compute(left, state.operator, right);
  if (!result.ok) {
    return { ...state, lastExpression: attempted, error: result.error };
  }
  return {
    currentInput: formatNumber(result.value),
    accumulator: null,
    operator: null,
    overwrite: true,
    lastExpression: attempted,
    error: null,
  };
}

function toggleSign(state: CalculatorState): CalculatorState {
  if (state.overwrite && state.operator !== null) {
    // Waiting for the right operand: start editing a negative one.
    return {
      ...state,
      currentInput: '-0',
      overwrite: false,
      lastExpression: null,
    };
  }
  // Otherwise negate the shown input. After `=` the negated result no
  // longer matches the recorded expression, so the history is dropped.
  const next = negateInput(state.currentInput);
  // Direct-input invariant guard (same ignore rule as digits).
  if (!isFiniteOperand(next)) {
    return state;
  }
  return { ...state, currentInput: next, lastExpression: null };
}

function deleteLastCharacter(state: CalculatorState): CalculatorState {
  if (state.overwrite) {
    // The shown value was not typed (result or stored operand):
    // deleting it starts a fresh editable zero.
    return {
      ...state,
      currentInput: '0',
      overwrite: false,
      lastExpression: null,
    };
  }
  const next = state.currentInput.slice(0, -1);
  // Guard the string boundaries: "" and "-" do not parse as numbers.
  const safe = next === '' || next === '-' ? '0' : next;
  return { ...state, currentInput: safe, lastExpression: null };
}

/**
 * Direct-input guard for the `currentInput` invariant: the editable
 * operand must always parse to a finite number. Digit, decimal, and
 * sign transitions that would overflow it to a non-finite value are
 * ignored; ordinary large finite values (up to `Number.MAX_VALUE`)
 * are preserved.
 */
function isFiniteOperand(input: string): boolean {
  return Number.isFinite(Number(input));
}

/** Arithmetic boundary: parse an editable operand string into a number. */
function toNumber(input: string): number {
  return Number(input);
}

/**
 * Arithmetic boundary: format a computed number as the next operand.
 * Rounded to 12 significant digits so binary floating-point noise such as
 * `0.30000000000000004` never reaches the display.
 */
function formatNumber(value: number): string {
  return String(Number(value.toPrecision(12)));
}

function negateInput(input: string): string {
  return input.startsWith('-') ? input.slice(1) : `-${input}`;
}

type Computation =
  | { ok: true; value: number }
  | { ok: false; error: CalculatorError };

function compute(
  left: number,
  operator: Operator,
  right: number,
): Computation {
  if (operator === '/' && right === 0) {
    return { ok: false, error: 'division-by-zero' };
  }
  const value =
    operator === '+'
      ? left + right
      : operator === '-'
        ? left - right
        : operator === '*'
          ? left * right
          : left / right;
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'non-finite-result' };
  }
  return { ok: true, value };
}
