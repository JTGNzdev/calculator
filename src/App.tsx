/**
 * Calculator application shell.
 *
 * React owns rendering and event wiring only. Every arithmetic and
 * formatting rule comes from the pure calculator domain through its
 * public barrel; nothing here duplicates that behavior.
 */

import { useEffect, useState } from 'react';
import {
  applyAction,
  createInitialState,
  formatDisplay,
  formatExpression,
} from './calculator';
import type {
  CalculatorAction,
  CalculatorState,
  Digit,
} from './calculator';

/** Visual variant of a keypad key. */
type KeyVariant = 'digit' | 'utility' | 'operator' | 'equals';

/** One keypad button: visible label, accessible name, and domain action. */
interface KeyConfig {
  id: string;
  label: string;
  name: string;
  action: CalculatorAction;
  variant: KeyVariant;
  wide?: boolean;
}

/**
 * Keypad layout in grid order (4 columns):
 * C, ±, DEL, ÷ / 7 8 9 × / 4 5 6 − / 1 2 3 + / 0 (wide), ., =
 */
const KEYS: KeyConfig[] = [
  {
    id: 'clear',
    label: 'C',
    name: 'clear',
    action: { type: 'clear' },
    variant: 'utility',
  },
  {
    id: 'sign-toggle',
    label: '±',
    name: 'toggle sign',
    action: { type: 'sign-toggle' },
    variant: 'utility',
  },
  {
    id: 'delete',
    label: 'DEL',
    name: 'delete',
    action: { type: 'delete' },
    variant: 'utility',
  },
  {
    id: 'divide',
    label: '÷',
    name: 'divide',
    action: { type: 'operator', operator: '/' },
    variant: 'operator',
  },
  {
    id: 'digit-7',
    label: '7',
    name: '7',
    action: { type: 'digit', digit: '7' },
    variant: 'digit',
  },
  {
    id: 'digit-8',
    label: '8',
    name: '8',
    action: { type: 'digit', digit: '8' },
    variant: 'digit',
  },
  {
    id: 'digit-9',
    label: '9',
    name: '9',
    action: { type: 'digit', digit: '9' },
    variant: 'digit',
  },
  {
    id: 'multiply',
    label: '×',
    name: 'multiply',
    action: { type: 'operator', operator: '*' },
    variant: 'operator',
  },
  {
    id: 'digit-4',
    label: '4',
    name: '4',
    action: { type: 'digit', digit: '4' },
    variant: 'digit',
  },
  {
    id: 'digit-5',
    label: '5',
    name: '5',
    action: { type: 'digit', digit: '5' },
    variant: 'digit',
  },
  {
    id: 'digit-6',
    label: '6',
    name: '6',
    action: { type: 'digit', digit: '6' },
    variant: 'digit',
  },
  {
    id: 'subtract',
    label: '−',
    name: 'subtract',
    action: { type: 'operator', operator: '-' },
    variant: 'operator',
  },
  {
    id: 'digit-1',
    label: '1',
    name: '1',
    action: { type: 'digit', digit: '1' },
    variant: 'digit',
  },
  {
    id: 'digit-2',
    label: '2',
    name: '2',
    action: { type: 'digit', digit: '2' },
    variant: 'digit',
  },
  {
    id: 'digit-3',
    label: '3',
    name: '3',
    action: { type: 'digit', digit: '3' },
    variant: 'digit',
  },
  {
    id: 'add',
    label: '+',
    name: 'add',
    action: { type: 'operator', operator: '+' },
    variant: 'operator',
  },
  {
    id: 'digit-0',
    label: '0',
    name: '0',
    action: { type: 'digit', digit: '0' },
    variant: 'digit',
    wide: true,
  },
  {
    id: 'decimal',
    label: '.',
    name: 'decimal point',
    action: { type: 'decimal' },
    variant: 'digit',
  },
  {
    id: 'equals',
    label: '=',
    name: 'equals',
    action: { type: 'equals' },
    variant: 'equals',
  },
];

/** Maps a keyboard key to a calculator action, or null if unhandled. */
function actionFromKey(key: string): CalculatorAction | null {
  if (/^[0-9]$/.test(key)) {
    return { type: 'digit', digit: key as Digit };
  }
  switch (key) {
    case '.':
      return { type: 'decimal' };
    case '+':
      return { type: 'operator', operator: '+' };
    case '-':
      return { type: 'operator', operator: '-' };
    case '*':
      return { type: 'operator', operator: '*' };
    case '/':
      return { type: 'operator', operator: '/' };
    case 'Enter':
    case '=':
      return { type: 'equals' };
    case 'Backspace':
      return { type: 'delete' };
    case 'Escape':
      return { type: 'clear' };
    case 'n':
    case 'N':
      return { type: 'sign-toggle' };
    default:
      return null;
  }
}

/**
 * Handled keys whose browser default is worth suppressing: Enter would
 * also activate the focused button (doubling the action), Backspace can
 * navigate history, Escape exits fullscreen, and "/" opens the Firefox
 * quick-find bar. Other handled keys have no competing default behavior.
 */
const KEYS_WITH_BROWSER_BEHAVIOR = new Set([
  'Enter',
  'Backspace',
  'Escape',
  '/',
]);

export function App() {
  const [state, setState] = useState<CalculatorState>(createInitialState);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Never fire calculator shortcuts while a modifier is held
      // (⌘/Ctrl shortcuts, Alt access keys, Win/Cmd combos).
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }
      const action = actionFromKey(event.key);
      if (action === null) {
        return;
      }
      if (KEYS_WITH_BROWSER_BEHAVIOR.has(event.key)) {
        event.preventDefault();
      }
      setState((current) => applyAction(current, action));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const expression = formatExpression(state);
  const display = formatDisplay(state);
  const hasError = state.error !== null;

  return (
    <main className="calculator" aria-labelledby="calculator-title">
      <h1 id="calculator-title" className="calculator-title">
        Calculator
      </h1>

      <section className="display" aria-label="Calculator display">
        {/* Polite live region: announces expression-only changes (for
            example operator replacement) that do not move the result. */}
        <p
          className="display-expression"
          aria-label="Expression"
          aria-live="polite"
        >
          {expression}
        </p>
        <p
          className={
            hasError ? 'display-value display-error' : 'display-value'
          }
          role={hasError ? 'alert' : 'status'}
        >
          {display}
        </p>
      </section>

      <section className="keypad" aria-label="Calculator keypad">
        {KEYS.map((key) => (
          <button
            key={key.id}
            type="button"
            className={`key key--${key.variant}${
              key.wide === true ? ' key--wide' : ''
            }`}
            aria-label={key.name !== key.label ? key.name : undefined}
            onClick={() =>
              setState((current) => applyAction(current, key.action))
            }
          >
            {key.label}
          </button>
        ))}
      </section>

      <footer className="keyboard-hints">
        <h2>Keyboard</h2>
        <ul>
          <li>
            <kbd>0–9</kbd> digits
          </li>
          <li>
            <kbd>.</kbd> decimal point
          </li>
          <li>
            <kbd>+</kbd> <kbd>−</kbd> <kbd>*</kbd> <kbd>/</kbd> operators
          </li>
          <li>
            <kbd>Enter</kbd> or <kbd>=</kbd> equals
          </li>
          <li>
            <kbd>Backspace</kbd> delete last input
          </li>
          <li>
            <kbd>Escape</kbd> clear
          </li>
          <li>
            <kbd>N</kbd> toggle sign
          </li>
        </ul>
      </footer>
    </main>
  );
}
