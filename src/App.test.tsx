import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Landing from './pages/Landing';
import '@testing-library/jest-dom';


it('renders landing title', () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /Complete Kimberlite/i })).toBeInTheDocument();
});
