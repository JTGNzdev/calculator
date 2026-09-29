# Calculator MVP

## Objective

Build a modern, responsive calculator web application that reinforces frontend fundamentals with a simple, maintainable React and TypeScript architecture.

## Problem and rationale

This is the first project in a progressive software-development learning path. The implementation must keep calculator rules separate from React presentation so JavaScript logic, TypeScript guarantees, and React responsibilities remain visible and teachable.

## Scope

- Arithmetic: addition, subtraction, multiplication, and division.
- Decimal input, sign toggle, clear, and delete-last-input behavior.
- Operation and result display.
- Division-by-zero and invalid-input handling.
- Button and basic keyboard interaction.
- Responsive, modern interface.
- Focused logic and component tests.
- Project README and local Git readiness.

## Non-goals

- Backend, database, authentication, scientific operations, or external services.
- Premature abstractions, state libraries, or unnecessary dependencies.
- Remote repository creation, push, or pull request creation.

## Constraints and decisions

- Stack: React, TypeScript, Vite, CSS, Vitest, React Testing Library, Git.
- Keep dependencies minimal and use Vite's standard React TypeScript setup.
- Use a small pure calculator state module for domain behavior and React for rendering and event wiring.
- Technical artifacts and UI copy use English, following the project artifact-language convention.
- TDD mode: not configured; use ordinary behavior-first implementation checks without claiming RED/GREEN evidence.
- Commit, repository creation, and initial push are authorized for the first versioning boundary; later remote operations still require explicit user authorization.
- GitHub target: private repository `JTGNzdev/calculator` with local `origin` configured over HTTPS.
- Delivery strategy: `ask-on-risk`; forecast approximately 650–850 authored changed lines across implementation, tests, CSS, and documentation. The initial repository bootstrap is an explicitly authorized single starting boundary; no pull request is requested.

## Tasks

- [x] **CALC-01 — Bootstrap the application and test environment**
  - Route: delegated writer (multi-file write and preparation trigger).
  - Create a minimal Vite React TypeScript project and configure Vitest with jsdom and React Testing Library.
  - Establish scripts for development, build, test, and coverage-free focused verification.
  - Initialize a local Git repository and preserve `.atl/` as ignored local state.
  - Checks: dependency installation succeeds; baseline test runner starts; TypeScript/Vite build succeeds.
  - Suggested commit: `chore: bootstrap React calculator project`.

- [x] **CALC-02 — Implement typed calculator behavior**
  - Route: delegated writer (logic plus focused tests touch multiple files).
  - Implement pure, typed state transitions for digits, decimal input, operators, equals, sign toggle, clear, delete, and errors.
  - Cover arithmetic, chaining, decimal handling, repeated invalid input, division by zero, and recovery from errors.
  - Checks: focused calculator logic tests pass; TypeScript build succeeds.
  - Suggested commit: `feat: implement calculator state and arithmetic`.

- [x] **CALC-03 — Build the responsive React interface**
  - Route: delegated writer (component, styles, and component tests are a multi-file unit).
  - Render operation/result displays and calculator controls.
  - Wire button events and basic keyboard input with accessible labels and sensible focus behavior.
  - Add responsive modern CSS without a component library.
  - Check relevant interaction, keyboard, display, and error behavior with React Testing Library.
  - Checks: component tests pass; production build succeeds; no evident layout overflow at narrow widths.
  - Suggested commit: `feat: add responsive calculator interface`.

- [ ] **CALC-04 — Document and verify the project**
  - Route: delegated writer for README; verification route determined by native assessment after the writer returns.
  - Write README sections for description, stack, installation, scripts, usage, features, project structure, learning boundaries, and future publication.
  - Run the full test suite and production build.
  - Review repository status and document proposed commit boundaries without committing.
  - Checks: full tests pass; production build passes; README commands match package scripts.
  - Suggested commit: `docs: document calculator setup and usage`.

## Acceptance criteria

- Every requested calculator action works through visible buttons.
- Basic keyboard controls work for digits, decimals, operators, Enter/equal, Backspace, Escape, and sign toggle.
- The display clearly distinguishes the current expression from the current value or error.
- Division by zero and invalid numeric input never crash the application and provide a recoverable error state.
- Pure calculator behavior is tested independently from React.
- Meaningful UI behavior is tested without implementation-detail assertions.
- `npm test -- --run` and `npm run build` pass before completion is reported.
- The layout remains usable on mobile and desktop widths.
- README accurately documents setup and use.
- No remote Git operation occurs.

## Progress and evidence

- Current state: CALC-01 and CALC-02 are committed and pushed on `main`; CALC-03 is implemented and verified on local branch `feat/calculator-interface`, awaiting its delivery decision.
- CALC-01 outcome: minimal Vite 6 + React 19 + TypeScript scaffold, Vitest 3 with jsdom and React Testing Library, strict project references, baseline accessible render test, and ignored dependency/build/runtime artifacts.
- CALC-01 verification: `npm install`, focused tests, production build, independent verification, and parent spot check all passed.
- CALC-02 outcome: pure typed state transitions and display formatters support arithmetic, decimals, sign toggle, clear, delete, immediate chaining, operator replacement, equals, division-by-zero recovery, post-result behavior, and non-finite protection.
- CALC-02 writer verification: `npm test -- --run src/calculator` passed (42 tests initially, 48 after correction); `npm run build` passed.
- CALC-02 independent verification initially found that oversized direct input could become `Infinity` and that tests bypassed the public barrel. A bounded correction added finite-input guards and barrel-level imports/tests.
- CALC-02 final independent verification passed (48 tests and production build); no blockers remained.
- Parent spot check: full `npm test -- --run` passed (2 files, 49 tests).
- Known non-blocking issue: `npm install` reported two moderate transitive development-dependency advisories in the jsdom chain; no forced audit mutation was attempted.
- Commit evidence: `ff90107` (`feat: bootstrap typed calculator core`) contains the verified CALC-01 and CALC-02 boundary and was pushed to `origin/main`.
- Repository evidence: private `https://github.com/JTGNzdev/calculator`, default branch `main`, HTTPS `origin`, clean synchronized push.
- CALC-03 implementation outcome: responsive React calculator UI, accessible expression/result/error display, button controls, keyboard mapping, modifier guards, listener cleanup, mobile-first CSS, and 15 component behavior tests.
- CALC-03 writer verification passed (63 total tests and production build). Independent verification initially found missing expression live semantics and incomplete keyboard/lifecycle regression coverage; a bounded correction added polite expression announcements and four targeted tests.
- CALC-03 final independent verification passed with no blockers; parent spot check `npm test -- --run` passed (2 files, 63 tests), and structural readback confirmed React delegates arithmetic/formatting to the public domain API.
- CALC-03 delivery decision: the user authorized its cohesive work-unit commit and push of `feat/calculator-interface`; no pull request was requested. Current authored diff is approximately 800 lines including tests/CSS, above the advisory 400-line heuristic but cohesive as one interface behavior unit.

## Next step

Create and push the CALC-03 work-unit commit, record its identity, then begin CALC-04 documentation and final verification.
