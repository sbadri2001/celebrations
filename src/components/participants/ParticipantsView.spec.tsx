import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ParticipantsView from './ParticipantsView';

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
}));

describe('ParticipantsView Component', () => {
  const mockProps = {
    participants: [
      { id: 'p1', name: 'Alina Reed', ageGroup: 'junior' as const, email: 'alina@reed.com', registeredEvent: 'Basketball Finals', dateAdded: 'Jun 12, 2026' },
      { id: 'p2', name: 'Bobby Vance', ageGroup: 'adult' as const, email: 'bobby@vance.com', registeredEvent: 'Food Fiesta', dateAdded: 'Jun 14, 2026' },
    ],
    onTriggerRegister: jest.fn(),
    onDeleteParticipant: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders participant list, names, age badge and event title correctly', () => {
    render(<ParticipantsView {...mockProps} />);

    expect(screen.getByText('Active Registrations List')).toBeInTheDocument();
    expect(screen.getByText('Alina Reed')).toBeInTheDocument();
    expect(screen.getByText('Bobby Vance')).toBeInTheDocument();
    expect(screen.getByText('alina@reed.com')).toBeInTheDocument();
    expect(screen.getByText('Food Fiesta')).toBeInTheDocument();
  });

  it('filters list based on typed query', () => {
    render(<ParticipantsView {...mockProps} />);

    const searchInput = screen.getByPlaceholderText(/search name, email/i);
    fireEvent.change(searchInput, { target: { value: 'Reed' } });

    expect(screen.getByText('Alina Reed')).toBeInTheDocument();
    expect(screen.queryByText('Bobby Vance')).not.toBeInTheDocument();
  });

  it('calls onDeleteParticipant callback when trash is clicked', () => {
    render(<ParticipantsView {...mockProps} />);

    const deleteBtn = screen.getAllByTitle('Delete Record')[0];
    fireEvent.click(deleteBtn);

    expect(mockProps.onDeleteParticipant).toHaveBeenCalledWith('p1', 'Alina Reed');
  });
});
