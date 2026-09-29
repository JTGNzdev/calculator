import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the baseline calculator heading in the test environment', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Calculator' }),
    ).toBeDefined();
  });
});
