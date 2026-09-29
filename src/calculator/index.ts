/**
 * Public API of the calculator domain.
 *
 * The future UI imports everything it needs from here and never touches
 * the internal files directly.
 */

export {
  applyAction,
  createInitialState,
  ERROR_MESSAGES,
  formatDisplay,
  formatExpression,
  operatorSymbol,
} from './calculator';

export type {
  CalculatorAction,
  CalculatorError,
  CalculatorState,
  Digit,
  Operator,
} from './types';
