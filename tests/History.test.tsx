import { render, screen } from '@testing-library/react';
import { History } from '../renderer/src/components/History/History';

describe('History', () => {
  it('renders session list (mocked)', () => {
    // Mock window.electronAPI.listSessions
    // @ts-ignore
    window.electronAPI = { listSessions: async () => ['session1', 'session2'] };
    render(<History />);
    expect(screen.getByText('Session History')).toBeInTheDocument();
  });
}); 