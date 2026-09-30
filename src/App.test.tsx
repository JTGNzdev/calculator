/**
 * Behavior tests for the calculator interface.
 *
 * Every assertion goes through what the user perceives: buttons with
 * accessible names, the window keyboard listener, the result live
 * region (role "status"), the error alert, and the rendered expression
 * text. No calculator domain internals are imported or re-tested here.
 */

import { fireEvent, render, screen, createEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { App } from './App';

/** Press a calculator key through the window keyboard listener. */
function pressKey(key: string, modifiers: Partial<KeyboardEventInit> = {}) {
  fireEvent.keyDown(window, { key, ...modifiers });
}

/** Click a keypad button by its accessible name. */
function press(name: string | RegExp) {
  fireEvent.click(screen.getByRole('button', { name }));
}

describe('App', () => {
  it('renders the calculator with every required control', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Calculator' }),
    ).toBeDefined();

    const controls = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'decimal point',
      'add',
      'subtract',
      'multiply',
      'divide',
      'equals',
      'toggle sign',
      'clear',
      'delete',
    ];
    for (const name of controls) {
      expect(screen.getByRole('button', { name })).toBeDefined();
    }

    expect(screen.getByRole('status').textContent).toBe('0');
  });

  it('shows the pending expression above the current value while typing', () => {
    render(<App />);

    press('1');
    press('2');
    expect(screen.getByRole('status').textContent).toBe('12');

    press('add');
    expect(screen.getByText('12 +')).toBeDefined();
    expect(screen.getByRole('status').textContent).toBe('12');

    press('5');
    expect(screen.getByText('12 + 5')).toBeDefined();
    expect(screen.getByRole('status').textContent).toBe('5');
  });

  it('announces operator replacement through the live expression even when the value does not change', () => {
    render(<App />);

    const expression = screen.getByLabelText('Expression');
    expect(expression.getAttribute('aria-live')).toBe('polite');

    press('1');
    press('add');
    expect(expression.textContent).toBe('1 +');

    // Replacing the operator changes only the expression line; the
    // polite live region is what makes that change announced.
    press('subtract');
    expect(expression.textContent).toBe('1 -');
    expect(screen.getByRole('status').textContent).toBe('1');
  });

  it('computes a full calculation and records the finished expression', () => {
    render(<App />);

    press('1');
    press('2');
    press('add');
    press('5');
    press('equals');

    expect(screen.getByRole('status').textContent).toBe('17');
    expect(screen.getByText('12 + 5 =')).toBeDefined();
  });

  it('supports the whole flow through the keyboard', () => {
    render(<App />);

    pressKey('3');
    pressKey('*');
    pressKey('4');
    pressKey('Enter');

    expect(screen.getByRole('status').textContent).toBe('12');
  });

  it('treats the = key like Enter for equals', () => {
    render(<App />);

    pressKey('7');
    pressKey('+');
    pressKey('3');
    pressKey('=');

    expect(screen.getByRole('status').textContent).toBe('10');
  });

  it('subtracts and divides through the keyboard', () => {
    render(<App />);

    pressKey('9');
    pressKey('-');
    pressKey('4');
    pressKey('Enter');

    expect(screen.getByRole('status').textContent).toBe('5');
    expect(screen.getByText('9 - 4 =')).toBeDefined();

    // The finished result chains straight into a division.
    pressKey('/');
    pressKey('2');
    pressKey('=');

    expect(screen.getByRole('status').textContent).toBe('2.5');
    expect(screen.getByText('5 ÷ 2 =')).toBeDefined();
  });

  it('prevents the browser default for Enter so a focused button cannot double-fire', () => {
    render(<App />);

    press('3');
    press('add');
    press('4');

    // Enter on the focused equals button bubbles to the global
    // listener, which applies equals and prevents the default that
    // would also activate the focused button (double-fire guard).
    const equalsButton = screen.getByRole('button', { name: 'equals' });
    equalsButton.focus();
    const enterEvent = createEvent.keyDown(equalsButton, { key: 'Enter' });
    fireEvent(equalsButton, enterEvent);

    expect(enterEvent.defaultPrevented).toBe(true);
    expect(screen.getByRole('status').textContent).toBe('7');

    // Keys without a competing browser default stay untouched.
    const plainEvent = createEvent.keyDown(window, { key: 'z' });
    fireEvent(window, plainEvent);
    expect(plainEvent.defaultPrevented).toBe(false);
  });

  it('shows a division-by-zero error and recovers through clear', () => {
    render(<App />);

    press('5');
    press('divide');
    press('0');
    press('equals');

    const error = screen.getByRole('alert');
    expect(error.textContent).toBe('Cannot divide by zero');

    // The error state freezes input until cleared.
    pressKey('9');
    expect(screen.getByRole('alert').textContent).toBe('Cannot divide by zero');

    press('clear');
    expect(screen.getByRole('status').textContent).toBe('0');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('clears with the clear button and the Escape key', () => {
    render(<App />);

    press('1');
    press('2');
    press('3');
    expect(screen.getByRole('status').textContent).toBe('123');

    press('clear');
    expect(screen.getByRole('status').textContent).toBe('0');

    pressKey('4');
    pressKey('Escape');
    expect(screen.getByRole('status').textContent).toBe('0');
  });

  it('deletes the last input with the delete button and Backspace', () => {
    render(<App />);

    press('1');
    press('2');
    press('3');

    press('delete');
    expect(screen.getByRole('status').textContent).toBe('12');

    pressKey('Backspace');
    expect(screen.getByRole('status').textContent).toBe('1');
  });

  it('accepts a single decimal point per operand through buttons and keyboard', () => {
    render(<App />);

    press('3');
    press('decimal point');
    press('5');
    expect(screen.getByRole('status').textContent).toBe('3.5');

    // A second decimal point in the same operand is ignored.
    press('decimal point');
    expect(screen.getByRole('status').textContent).toBe('3.5');

    // Same rule for the right operand entered by keyboard.
    press('add');
    pressKey('8');
    pressKey('.');
    pressKey('.');
    pressKey('1');
    expect(screen.getByRole('status').textContent).toBe('8.1');
  });

  it('toggles the sign with the ± button and the N key', () => {
    render(<App />);

    press('5');
    press('toggle sign');
    expect(screen.getByRole('status').textContent).toBe('-5');

    pressKey('n');
    expect(screen.getByRole('status').textContent).toBe('5');

    pressKey('N');
    expect(screen.getByRole('status').textContent).toBe('-5');
  });

  it('ignores calculator shortcuts while a modifier key is held', () => {
    render(<App />);

    pressKey('5', { metaKey: true });
    pressKey('3', { ctrlKey: true });
    pressKey('9', { altKey: true });

    expect(screen.getByRole('status').textContent).toBe('0');
  });

  it('removes the exact global keydown listener it added when unmounted', () => {
    const added: Array<{ type: string; listener: unknown }> = [];
    const removed: Array<{ type: string; listener: unknown }> = [];

    const addSpy = vi
      .spyOn(window, 'addEventListener')
      .mockImplementation(
        ((type: string, listener: EventListenerOrEventListenerObject) => {
          added.push({ type, listener });
        }) as unknown as typeof window.addEventListener,
      );
    const removeSpy = vi
      .spyOn(window, 'removeEventListener')
      .mockImplementation(
        ((type: string, listener: EventListenerOrEventListenerObject) => {
          removed.push({ type, listener });
        }) as unknown as typeof window.removeEventListener,
      );

    try {
      const { unmount } = render(<App />);

      const addedKeydown = added.filter((entry) => entry.type === 'keydown');
      expect(addedKeydown).toHaveLength(1);

      unmount();

      const removedKeydown = removed.filter(
        (entry) => entry.type === 'keydown',
      );
      expect(removedKeydown).toHaveLength(1);
      expect(removedKeydown[0].listener).toBe(addedKeydown[0].listener);
    } finally {
      addSpy.mockRestore();
      removeSpy.mockRestore();
    }
  });
});
