import { render, screen } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

test('renders learn react link', () => {
  render(<RegistrationForm />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
