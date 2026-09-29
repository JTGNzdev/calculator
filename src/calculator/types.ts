/**
 * TypeScript types for the calculator domain.
 *
 * This file contains type-level guarantees only. All behavior lives in
 * `calculator.ts`, keeping the boundary between what TypeScript promises
 * and what the plain JavaScript-style logic does visible and teachable.
 */

/** Binary arithmetic operators the calculator supports. */
export type Operator = '+' | '-' | '*' | '/';

/** A single digit accepted by digit entry. */
export type Digit =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';

/**
 * Recoverable error kinds.
 *
 * - `division-by-zero`: the pending operation divided by zero.
 * - `non-finite-result`: the result overflowed to `Infinity` (or `NaN`),
 *   so no numeric value can be shown.
 *
 * Errors never leak `NaN` or `Infinity` into `currentInput`: the state
 * freezes until `clear` is applied.
 */
export type CalculatorError = 'division-by-zero' | 'non-finite-result';

/**
 * The complete calculator state, expressed explicitly so the future UI can
 * render it without knowing any arithmetic rules.
 *
 * Invariants:
 * - `currentInput` is always a string that `Number()` parses to a finite
 *   value (`"0"`, `"12"`, `"-3.5"`, `"3."`, `"1e+200"`, ...).
 * - `accumulator` is non-null exactly while `operator` is pending.
 * - While `error` is non-null, only `clear` changes the state.
 */
export interface CalculatorState {
  /**
   * The operand being edited or the formatted value being displayed.
   * Editable input stays a string; numbers only appear at the arithmetic
   * boundary (`calculator.ts`).
   */
  currentInput: string;
  /** Stored left operand of the pending operation. */
  accumulator: number | null;
  /** Pending binary operator between `accumulator` and `currentInput`. */
  operator: Operator | null;
  /**
   * When true, the next digit/decimal starts a fresh operand instead of
   * appending (true after `=` and while waiting for the right operand).
   */
  overwrite: boolean;
  /**
   * Expression text of the last completed `=` (for example `"12 + 5"`).
   * Rendered with a trailing `=` by `formatExpression`.
   */
  lastExpression: string | null;
  /** Active error; while non-null the state is frozen until `clear`. */
  error: CalculatorError | null;
}

/** One user interaction, applied to a state through `applyAction`. */
export type CalculatorAction =
  | { type: 'clear' }
  | { type: 'digit'; digit: Digit }
  | { type: 'decimal' }
  | { type: 'operator'; operator: Operator }
  | { type: 'equals' }
  | { type: 'sign-toggle' }
  | { type: 'delete' };
