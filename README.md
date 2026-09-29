# Calculator

A modern, responsive calculator web application. It is the first project in a
progressive software-development learning path: the goal is not the calculator
itself, but practicing frontend fundamentals with a small, maintainable
architecture where each layer has a clear, teachable responsibility.

## Learning goals

- Keep arithmetic rules in plain, pure functions with no UI dependencies.
- Let TypeScript describe state and actions without implementing behavior.
- Keep React responsible for rendering and event wiring only.
- Write behavior-focused tests for logic and UI separately.

## Features

- Four arithmetic operations: addition, subtraction, multiplication, division.
- Decimal input, sign toggle (`±`), clear (`C`), and delete-last-input (`DEL`).
- Separate expression and result display, so you always see what you typed and
  what it evaluates to.
- Immediate chaining: pressing another operator evaluates the pending
  expression first, strictly left to right.
- Operator replacement: changing the operator before typing the second operand
  simply replaces it.
- Recoverable errors: division by zero and out-of-range results show a clear
  message; only the clear action (`C` or `Escape`) leaves the error state, so
  an error never corrupts state.
- Responsive, accessible interface that works on mobile and desktop widths,
  with both button and keyboard input.

### Non-goals

No backend, database, authentication, scientific operations, external
services, state libraries, or extra dependencies beyond the standard Vite
React TypeScript toolchain.

## Stack

- [React](https://react.dev) 19 — presentation and event wiring
- [TypeScript](https://www.typescriptlang.org) ~5.8 — type-level guarantees
- [Vite](https://vite.dev) 6 — development server and production bundler
- Plain CSS — styling without a component library
- [Vitest](https://vitest.dev) 3 with jsdom and
  [React Testing Library](https://testing-library.com) — behavior tests

## Prerequisites

- [Node.js](https://nodejs.org) (a recent LTS version)
- npm (bundled with Node.js)
- Git (only if you want to clone this repository yourself)

## Getting started

Clone (the repository is currently private) and install dependencies:

```bash
git clone https://github.com/JTGNzdev/calculator.git
cd calculator
npm install
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite development server with hot reload |
| `npm test` | Runs the test suite in watch mode (Vitest) |
| `npm test -- --run` | Runs the full test suite once and exits |
| `npm run build` | Type-checks with `tsc -b` and builds for production |
| `npm run preview` | Serves the production build locally |

## Usage

Click the keypad buttons, or use the keyboard:

| Key | Action |
| --- | --- |
| `0`–`9` | Enter a digit |
| `.` | Decimal point |
| `+` `-` `*` `/` | Operators |
| `Enter` or `=` | Evaluate |
| `Backspace` | Delete the last input character |
| `Escape` | Clear everything |
| `N` | Toggle the sign of the current operand |

Keyboard shortcuts are ignored while `Ctrl`, `Alt`, or `⌘`/`Meta` is held, so
browser and OS shortcuts keep working. The same is true for the buttons:
`C` clears, `±` toggles the sign, and `DEL` deletes the last character.

Example: press `1 2 . 5`, then `+`, then `3`, then `Enter`. The display shows
the expression `12.5 + 3 =` above the result `15.5`.

## Project structure

```text
calculator/
├── index.html                  # Vite HTML entry point
├── package.json               # Scripts and dependencies
├── vite.config.ts              # Vite + Vitest configuration (jsdom)
├── tsconfig*.json              # TypeScript project configuration
├── src/
│   ├── main.tsx                # React root mount
│   ├── App.tsx                 # Calculator UI: buttons, keyboard, display
│   ├── App.test.tsx            # Component behavior tests
│   ├── styles.css              # Responsive styling
│   └── calculator/             # Pure domain logic (no React, no DOM)
│       ├── types.ts            # Type-level guarantees only
│       ├── calculator.ts       # All arithmetic and formatting rules
│       ├── index.ts            # Public barrel for the domain
│       └── calculator.test.ts  # Logic behavior tests
└── odd/tasks/calculator-mvp.md # Feature planning and progress tracking
```

## The educational boundary

The project deliberately separates three kinds of responsibility:

1. **JavaScript-style pure logic** (`src/calculator/calculator.ts`): all
   calculator behavior lives in plain functions over an explicit state object
   — `applyAction` returns the next state, and the state is never mutated.
   There is no React, no DOM, and no classes here, so the rules can be read
   and tested in isolation.
2. **TypeScript guarantees** (`src/calculator/types.ts`): types only. Union
   types constrain operators and digits to legal values, the
   `CalculatorState` interface documents state invariants (the current input
   always parses to a finite number; the state freezes while an error is
   active), and `CalculatorAction` is a discriminated union of user
   interactions. Types promise what the values may be; the plain functions
   decide what happens.
3. **React presentation and event wiring** (`src/App.tsx`): rendering the
   display and keypad, mapping button clicks and keyboard keys to domain
   actions, and accessibility attributes. The component contains no arithmetic
   and no formatting rules — it delegates everything to the public domain API
   through `src/calculator/index.ts`.

## Testing

Tests focus on observable behavior, not implementation details:

- `src/calculator/calculator.test.ts` covers the pure domain in isolation:
  digit and decimal entry, sign toggle, delete, all four operations, chained
  evaluation, operator replacement, behavior after `=`, safe no-ops, division
  by zero, out-of-range results, and recovery through `clear`.
- `src/App.test.tsx` covers the rendered UI with React Testing Library:
  button interactions, keyboard input (including the `N` sign toggle and
  modifier-key guards), expression and result display, error rendering, and
  listener cleanup.

Run everything once with:

```bash
npm test -- --run
```

## Repository context

This is a private GitHub repository
([JTGNzdev/calculator](https://github.com/JTGNzdev/calculator)). There is no
deployment, no public release, and no published package — the project is a
local learning exercise under active development.

## Possible next steps

These are ideas only; none of them is implemented yet:

- Percent and memory keys.
- A calculation history panel.
- Publishing the repository or deploying the app (a decision for later).
