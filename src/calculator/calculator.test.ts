import { describe, expect, it } from 'vitest';
// Tests import only the public barrel so a broken public export cannot
// silently pass: removing or renaming any export used here fails the run.
import {
  applyAction,
  createInitialState,
  ERROR_MESSAGES,
  formatDisplay,
  formatExpression,
  operatorSymbol,
} from './index';
import type { CalculatorAction, CalculatorState, Digit } from './index';

/** Applies a sequence of actions, one after the other. */
function press(
  state: CalculatorState,
  ...actions: CalculatorAction[]
): CalculatorState {
  return actions.reduce(applyAction, state);
}

/** Types a literal operand such as `"12.5"` digit by digit. */
function typeNumber(state: CalculatorState, chars: string): CalculatorState {
  return [...chars].reduce<CalculatorState>((acc, ch) => {
    if (ch === '.') {
      return applyAction(acc, { type: 'decimal' });
    }
    return applyAction(acc, { type: 'digit', digit: ch as Digit });
  }, state);
}

const digit = (d: string) => ({ type: 'digit', digit: d as Digit }) as const;

describe('initial state', () => {
  it('shows a lone zero with no expression and no error', () => {
    const state = createInitialState();
    expect(formatDisplay(state)).toBe('0');
    expect(formatExpression(state)).toBe('');
    expect(state.error).toBeNull();
  });
});

describe('digit entry', () => {
  it('builds an integer from typed digits', () => {
    const state = press(createInitialState(), digit('1'), digit('2'), digit('3'));
    expect(formatDisplay(state)).toBe('123');
  });

  it('replaces a leading zero instead of stacking zeros', () => {
    const state = press(createInitialState(), digit('0'), digit('5'));
    expect(formatDisplay(state)).toBe('5');
  });

  it('keeps a lone zero when zero is pressed repeatedly', () => {
    const state = press(createInitialState(), digit('0'), digit('0'), digit('0'));
    expect(formatDisplay(state)).toBe('0');
  });

  it('starts a negative first operand from a toggled zero', () => {
    const state = press(
      createInitialState(),
      { type: 'sign-toggle' },
      digit('5'),
      { type: 'operator', operator: '+' },
      digit('3'),
      { type: 'equals' },
    );
    expect(formatDisplay(state)).toBe('-2');
  });
});

describe('decimal entry', () => {
  it('appends one decimal point to the current operand', () => {
    const state = typeNumber(createInitialState(), '3.5');
    expect(formatDisplay(state)).toBe('3.5');
  });

  it('ignores a second decimal point in the same operand', () => {
    const state = press(
      createInitialState(),
      digit('3'),
      { type: 'decimal' },
      { type: 'decimal' },
    );
    expect(formatDisplay(state)).toBe('3.');
  });

  it('starts a fresh 0. when pressed right after a result', () => {
    const state = press(createInitialState(), digit('2'), { type: 'operator', operator: '+' }, digit('3'), { type: 'equals' });
    const next = applyAction(state, { type: 'decimal' });
    expect(formatDisplay(next)).toBe('0.');
    expect(formatExpression(next)).toBe('');
  });

  it('gives each operand its own decimal point', () => {
    const first = typeNumber(createInitialState(), '1.5');
    const withOperator = applyAction(first, { type: 'operator', operator: '+' });
    const second = typeNumber(withOperator, '2.');
    const result = applyAction(second, { type: 'equals' });
    expect(formatDisplay(result)).toBe('3.5');
  });
});

describe('sign toggle', () => {
  it('negates and restores the current input', () => {
    const state = press(createInitialState(), digit('5'), { type: 'sign-toggle' });
    expect(formatDisplay(state)).toBe('-5');
    expect(formatDisplay(applyAction(state, { type: 'sign-toggle' }))).toBe('5');
  });

  it('negates the second operand while an operator is pending', () => {
    const state = press(
      createInitialState(),
      digit('8'),
      { type: 'operator', operator: '*' },
      { type: 'sign-toggle' },
    );
    expect(formatDisplay(state)).toBe('-0');
    const completed = press(state, digit('2'), { type: 'equals' });
    expect(formatDisplay(completed)).toBe('-16');
    expect(formatExpression(completed)).toBe('8 × -2 =');
  });

  it('negates a result without keeping the stale expression', () => {
    const state = press(
      createInitialState(),
      digit('2'),
      { type: 'operator', operator: '-' },
      digit('7'),
      { type: 'equals' },
    );
    expect(formatDisplay(state)).toBe('-5');
    const toggled = applyAction(state, { type: 'sign-toggle' });
    expect(formatDisplay(toggled)).toBe('5');
    expect(formatExpression(toggled)).toBe('');
  });
});

describe('basic arithmetic', () => {
  it('adds two operands and records the completed expression', () => {
    const state = press(
      createInitialState(),
      digit('1'),
      digit('2'),
      { type: 'operator', operator: '+' },
      digit('5'),
      { type: 'equals' },
    );
    expect(formatDisplay(state)).toBe('17');
    expect(formatExpression(state)).toBe('12 + 5 =');
  });

  it('subtracts into a negative result', () => {
    const state = press(
      createInitialState(),
      digit('3'),
      { type: 'operator', operator: '-' },
      digit('1'),
      digit('0'),
      { type: 'equals' },
    );
    expect(formatDisplay(state)).toBe('-7');
  });

  it('multiplies and shows the operator symbol in the expression', () => {
    const state = press(
      createInitialState(),
      digit('6'),
      { type: 'operator', operator: '*' },
      digit('7'),
      { type: 'equals' },
    );
    expect(formatDisplay(state)).toBe('42');
    expect(formatExpression(state)).toBe('6 × 7 =');
  });

  it('divides decimal operands', () => {
    const state = typeNumber(createInitialState(), '7.5');
    const withOperator = applyAction(state, { type: 'operator', operator: '/' });
    const result = press(typeNumber(withOperator, '2.5'), { type: 'equals' });
    expect(formatDisplay(result)).toBe('3');
    expect(formatExpression(result)).toBe('7.5 ÷ 2.5 =');
  });

  it('hides binary floating-point noise in the display', () => {
    const state = press(
      createInitialState(),
      { type: 'decimal' },
      digit('1'),
      { type: 'operator', operator: '+' },
      { type: 'decimal' },
      digit('2'),
      { type: 'equals' },
    );
    expect(formatDisplay(state)).toBe('0.3');
  });
});

describe('chained operations', () => {
  it('executes the pending operation when the next operator is pressed', () => {
    const state = press(
      createInitialState(),
      digit('2'),
      { type: 'operator', operator: '+' },
      digit('3'),
      { type: 'operator', operator: '+' },
    );
    expect(formatDisplay(state)).toBe('5');
    expect(formatExpression(state)).toBe('5 +');
    const completed = press(state, digit('4'), { type: 'equals' });
    expect(formatDisplay(completed)).toBe('9');
  });

  it('evaluates strictly left to right', () => {
    const state = press(
      createInitialState(),
      digit('2'),
      { type: 'operator', operator: '+' },
      digit('3'),
      { type: 'operator', operator: '*' },
      digit('4'),
      { type: 'equals' },
    );
    expect(formatDisplay(state)).toBe('20');
  });

  it('continues chaining from an exponent-form result', () => {
    const googol = `1${'0'.repeat(100)}`;
    let state = typeNumber(createInitialState(), googol);
    state = applyAction(state, { type: 'operator', operator: '*' });
    state = typeNumber(state, googol);
    state = applyAction(state, { type: 'equals' });
    expect(formatDisplay(state)).toBe('1e+200');
    state = applyAction(state, { type: 'operator', operator: '*' });
    state = typeNumber(state, '2');
    state = applyAction(state, { type: 'equals' });
    expect(formatDisplay(state)).toBe('2e+200');
  });
});

describe('operator selection', () => {
  it('replaces the pending operator before the right operand is entered', () => {
    const state = press(
      createInitialState(),
      digit('5'),
      { type: 'operator', operator: '+' },
      { type: 'operator', operator: '*' },
      { type: 'operator', operator: '/' },
      { type: 'operator', operator: '-' },
      digit('3'),
      { type: 'equals' },
    );
    expect(formatDisplay(state)).toBe('2');
  });
});

describe('entering data after a result', () => {
  it('starts a fresh calculation when a digit follows a result', () => {
    const state = press(
      createInitialState(),
      digit('2'),
      { type: 'operator', operator: '+' },
      digit('3'),
      { type: 'equals' },
    );
    const fresh = press(state, digit('7'));
    expect(formatDisplay(fresh)).toBe('7');
    expect(formatExpression(fresh)).toBe('');
    const completed = press(fresh, { type: 'operator', operator: '+' }, digit('1'), { type: 'equals' });
    expect(formatDisplay(completed)).toBe('8');
  });

  it('continues from the result when an operator follows it', () => {
    const state = press(
      createInitialState(),
      digit('2'),
      { type: 'operator', operator: '+' },
      digit('3'),
      { type: 'equals' },
    );
    const continued = applyAction(state, { type: 'operator', operator: '*' });
    expect(formatExpression(continued)).toBe('5 ×');
    const completed = press(continued, digit('4'), { type: 'equals' });
    expect(formatDisplay(completed)).toBe('20');
  });
});

describe('equals', () => {
  it('is a safe no-op without a pending operator', () => {
    const state = press(createInitialState(), digit('5'), { type: 'equals' });
    expect(formatDisplay(state)).toBe('5');
    expect(formatExpression(state)).toBe('');
  });

  it('is a safe no-op while the right operand is missing', () => {
    const state = press(
      createInitialState(),
      digit('5'),
      { type: 'operator', operator: '+' },
      { type: 'equals' },
    );
    expect(formatDisplay(state)).toBe('5');
    expect(formatExpression(state)).toBe('5 +');
  });

  it('repeated presses stay on the same result', () => {
    const state = press(
      createInitialState(),
      digit('2'),
      { type: 'operator', operator: '+' },
      digit('3'),
      { type: 'equals' },
    );
    const repeated = press(state, { type: 'equals' }, { type: 'equals' });
    expect(formatDisplay(repeated)).toBe('5');
    expect(formatExpression(repeated)).toBe('2 + 3 =');
  });
});

describe('delete', () => {
  it('removes typed digits one by one down to a safe zero', () => {
    const state = press(createInitialState(), digit('1'), digit('2'), digit('3'));
    const afterFirst = applyAction(state, { type: 'delete' });
    expect(formatDisplay(afterFirst)).toBe('12');
    const afterSecond = applyAction(afterFirst, { type: 'delete' });
    expect(formatDisplay(afterSecond)).toBe('1');
    const afterThird = applyAction(afterSecond, { type: 'delete' });
    expect(formatDisplay(afterThird)).toBe('0');
    const afterFourth = applyAction(afterThird, { type: 'delete' });
    expect(formatDisplay(afterFourth)).toBe('0');
  });

  it('removes a trailing decimal point', () => {
    const state = typeNumber(createInitialState(), '1.5');
    const afterFirst = applyAction(state, { type: 'delete' });
    expect(formatDisplay(afterFirst)).toBe('1.');
    const afterSecond = applyAction(afterFirst, { type: 'delete' });
    expect(formatDisplay(afterSecond)).toBe('1');
  });

  it('clears a negative input to a safe zero', () => {
    const state = press(createInitialState(), digit('5'), { type: 'sign-toggle' });
    expect(formatDisplay(applyAction(state, { type: 'delete' }))).toBe('0');
  });

  it('keeps the stored left operand while editing the right one', () => {
    const state = press(
      createInitialState(),
      digit('4'),
      digit('5'),
      { type: 'operator', operator: '+' },
      digit('3'),
      { type: 'delete' },
    );
    expect(formatDisplay(state)).toBe('0');
    expect(formatExpression(state)).toBe('45 + 0');
    const completed = press(state, digit('7'), { type: 'equals' });
    expect(formatDisplay(completed)).toBe('52');
  });

  it('starts a fresh editable zero after a result', () => {
    const state = press(
      createInitialState(),
      digit('2'),
      { type: 'operator', operator: '+' },
      digit('3'),
      { type: 'equals' },
    );
    const afterDelete = applyAction(state, { type: 'delete' });
    expect(formatDisplay(afterDelete)).toBe('0');
    expect(formatExpression(afterDelete)).toBe('');
    const typed = press(afterDelete, digit('9'));
    expect(formatDisplay(typed)).toBe('9');
  });

  it('is ignored while an error is active', () => {
    const state = press(
      createInitialState(),
      digit('5'),
      { type: 'operator', operator: '/' },
      digit('0'),
      { type: 'equals' },
    );
    const afterDelete = applyAction(state, { type: 'delete' });
    expect(afterDelete).toEqual({ ...state });
    expect(formatDisplay(afterDelete)).toBe(ERROR_MESSAGES['division-by-zero']);
  });
});

describe('clear', () => {
  it('resets a mid-calculation state completely', () => {
    const state = press(
      createInitialState(),
      digit('1'),
      digit('2'),
      { type: 'decimal' },
      digit('5'),
      { type: 'operator', operator: '+' },
      digit('3'),
    );
    expect(applyAction(state, { type: 'clear' })).toEqual(createInitialState());
  });
});

describe('division by zero', () => {
  it('enters the typed error state on equals', () => {
    const state = press(
      createInitialState(),
      digit('5'),
      { type: 'operator', operator: '/' },
      digit('0'),
      { type: 'equals' },
    );
    expect(state.error).toBe('division-by-zero');
    expect(formatDisplay(state)).toBe('Cannot divide by zero');
    expect(formatExpression(state)).toBe('5 ÷ 0 =');
  });

  it('freezes the state until clear is pressed', () => {
    const state = press(
      createInitialState(),
      digit('5'),
      { type: 'operator', operator: '/' },
      digit('0'),
      { type: 'equals' },
    );
    const frozen = { ...state };
    const actions: CalculatorAction[] = [
      digit('7'),
      { type: 'decimal' },
      { type: 'operator', operator: '+' },
      { type: 'equals' },
      { type: 'sign-toggle' },
      { type: 'delete' },
    ];
    for (const action of actions) {
      expect(applyAction(state, action)).toEqual(frozen);
    }
  });

  it('recovers after clear and calculates normally', () => {
    const state = press(
      createInitialState(),
      digit('5'),
      { type: 'operator', operator: '/' },
      digit('0'),
      { type: 'equals' },
    );
    const recovered = applyAction(state, { type: 'clear' });
    expect(recovered).toEqual(createInitialState());
    const result = press(
      recovered,
      digit('7'),
      { type: 'operator', operator: '+' },
      digit('1'),
      { type: 'equals' },
    );
    expect(formatDisplay(result)).toBe('8');
  });

  it('enters the error state through chained execution', () => {
    const state = press(
      createInitialState(),
      digit('5'),
      { type: 'operator', operator: '/' },
      digit('0'),
      { type: 'operator', operator: '+' },
    );
    expect(state.error).toBe('division-by-zero');
    expect(formatExpression(state)).toBe('5 ÷ 0');
  });

  it('allows zero as the left operand', () => {
    const state = press(
      createInitialState(),
      digit('0'),
      { type: 'operator', operator: '/' },
      digit('5'),
      { type: 'equals' },
    );
    expect(state.error).toBeNull();
    expect(formatDisplay(state)).toBe('0');
  });
});

describe('non-finite arithmetic', () => {
  it('enters the error state instead of leaking Infinity', () => {
    const googol = `1${'0'.repeat(100)}`;
    let state = createInitialState();
    state = typeNumber(state, googol);
    state = applyAction(state, { type: 'operator', operator: '*' });
    state = typeNumber(state, googol);
    state = applyAction(state, { type: 'equals' });
    expect(formatDisplay(state)).toBe('1e+200');
    state = applyAction(state, { type: 'operator', operator: '*' });
    state = typeNumber(state, googol);
    state = applyAction(state, { type: 'equals' });
    expect(formatDisplay(state)).toBe('1e+300');
    state = applyAction(state, { type: 'operator', operator: '*' });
    state = typeNumber(state, googol);
    state = applyAction(state, { type: 'equals' });
    expect(state.error).toBe('non-finite-result');
    expect(formatDisplay(state)).toBe('Result is out of range');
    expect(Number.isFinite(Number(state.currentInput))).toBe(true);
  });

  it('recovers from overflow after clear', () => {
    const googol = `1${'0'.repeat(100)}`;
    let state = typeNumber(createInitialState(), googol);
    state = applyAction(state, { type: 'operator', operator: '*' });
    state = typeNumber(state, googol);
    state = applyAction(state, { type: 'equals' });
    state = applyAction(state, { type: 'operator', operator: '*' });
    state = typeNumber(state, googol);
    state = applyAction(state, { type: 'equals' });
    state = applyAction(state, { type: 'operator', operator: '*' });
    state = typeNumber(state, googol);
    state = applyAction(state, { type: 'equals' });
    expect(state.error).toBe('non-finite-result');
    const recovered = applyAction(state, { type: 'clear' });
    expect(recovered).toEqual(createInitialState());
  });
});

describe('public barrel exports', () => {
  it('exposes the operator symbols the UI renders', () => {
    expect(operatorSymbol('+')).toBe('+');
    expect(operatorSymbol('-')).toBe('-');
    expect(operatorSymbol('*')).toBe('×');
    expect(operatorSymbol('/')).toBe('÷');
  });
});

describe('oversized direct input', () => {
  // "1" followed by 308 zeros is Number.MAX_VALUE scale: the largest
  // finite value direct digit entry can build; the 310th digit would
  // overflow to Infinity and must be ignored.
  const maxFiniteDigits = `1${'0'.repeat(308)}`;

  it('ignores digits that would overflow the operand to Infinity', () => {
    const state = typeNumber(createInitialState(), `1${'0'.repeat(400)}`);
    // The first digit past Number.MAX_VALUE and every later one are
    // ignored, so the operand stays the largest finite value typed.
    expect(state.currentInput).toBe(maxFiniteDigits);
    expect(Number.isFinite(Number(state.currentInput))).toBe(true);
  });

  it('preserves ordinary large finite values', () => {
    const state = typeNumber(createInitialState(), maxFiniteDigits);
    expect(Number(state.currentInput)).toBe(1e308);
    expect(formatDisplay(state)).toBe(maxFiniteDigits);
  });

  it('never places Infinity in the accumulator or expression display', () => {
    let state = typeNumber(createInitialState(), `1${'0'.repeat(400)}`);
    state = applyAction(state, { type: 'operator', operator: '+' });
    expect(state.accumulator).toBe(1e308);
    expect(formatExpression(state)).toBe('1e+308 +');
    state = press(state, digit('1'), { type: 'equals' });
    expect(formatDisplay(state)).toBe('1e+308');
    expect(state.error).toBeNull();
  });

  it('reaches the typed error through arithmetic instead of leaking', () => {
    let state = typeNumber(createInitialState(), maxFiniteDigits);
    state = applyAction(state, { type: 'operator', operator: '*' });
    state = typeNumber(state, maxFiniteDigits);
    state = applyAction(state, { type: 'equals' });
    expect(state.error).toBe('non-finite-result');
    expect(formatDisplay(state)).toBe(ERROR_MESSAGES['non-finite-result']);
  });

  it('keeps decimal and sign input finite on the largest typed operand', () => {
    let state = typeNumber(createInitialState(), maxFiniteDigits);
    state = applyAction(state, { type: 'sign-toggle' });
    expect(Number.isFinite(Number(state.currentInput))).toBe(true);
    state = applyAction(state, { type: 'decimal' });
    expect(Number.isFinite(Number(state.currentInput))).toBe(true);
  });
});

describe('display formatting', () => {
  it('shows no expression while the first operand is being typed', () => {
    const state = typeNumber(createInitialState(), '12.5');
    expect(formatExpression(state)).toBe('');
    expect(formatDisplay(state)).toBe('12.5');
  });

  it('shows the pending expression while the right operand is being typed', () => {
    const state = press(
      createInitialState(),
      digit('1'),
      digit('2'),
      { type: 'operator', operator: '+' },
      digit('5'),
    );
    expect(formatExpression(state)).toBe('12 + 5');
  });
});
