import { render, screen } from '@testing-library/react';
import App from './App';

test('shows only the maintenance page', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /website under maintenance/i })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/we're making improvements to our website and will be back soon/i)
  ).toBeInTheDocument();
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
});
