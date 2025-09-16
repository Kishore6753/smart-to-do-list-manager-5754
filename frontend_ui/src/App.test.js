import { render, screen } from '@testing-library/react';
import App from './App';

// Basic smoke test: renders brand title in navbar
test('renders app brand', () => {
  render(<App />);
  const brand = screen.getByText(/Smart To-Do/i);
  expect(brand).toBeInTheDocument();
});
