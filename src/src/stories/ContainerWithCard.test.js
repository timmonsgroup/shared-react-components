import { render, screen } from '@testing-library/react';
import ContainerWithCard from './ContainerWithCard';

const containerThing = () => (
  <ContainerWithCard className="App">
    <p>Hello</p>
  </ContainerWithCard>
);

test('renders ContainerWithCard className', () => {
  const { container } = render(containerThing());
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  expect(container.getElementsByClassName('App').length).toBe(1);
});

test('renders ContainerWithCard with hello paragraph', () => {
  render(containerThing());
  const user = screen.getByText(/Hello/i);
  expect(user).toBeInTheDocument();
});
