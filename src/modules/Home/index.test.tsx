import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './';

test('renders text: Home', () => {
  render(<Home />);
  const linkElement = screen.getByText(/Home/i);
  expect(linkElement).toBeInTheDocument();
});
