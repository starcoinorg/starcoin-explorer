import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './adapter';

test('renders text: Home', () => {
  render(<Home />);
  const linkElement = screen.getByText(/List/i);
  expect(linkElement).toBeInTheDocument();
});
