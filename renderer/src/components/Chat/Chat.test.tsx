import { render, fireEvent, screen } from '@testing-library/react';
import { Chat } from './Chat';

describe('Chat', () => {
  it('renders chat UI', () => {
    const { getByText } = render(<Chat />);
    expect(getByText('Chat UI')).toBeInTheDocument();
  });

  it('renders and sends a message', async () => {
    render(<Chat />);
    const input = screen.getByPlaceholderText('Type your question...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    const button = screen.getByText('Send');
    fireEvent.click(button);
    expect(screen.getByText('You:')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
}); 