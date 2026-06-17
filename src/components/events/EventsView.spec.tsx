import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EventsView from './EventsView';

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
}));

describe('EventsView Component', () => {
  const mockProps = {
    events: [
      { id: 'e1', title: 'Cricket Under 14', subtitle: 'Youth Finals', status: 'ongoing' as const, timeInfo: 'Ongoing', category: 'junior' as const, type: 'cricket' as const },
      { id: 'e2', title: 'Traditional Dance Performance', subtitle: 'Main stage exhibition', status: 'upcoming' as const, timeInfo: 'Tomorrow', category: 'adult' as const, type: 'dance' as const },
    ],
    onTriggerCreateEvent: jest.fn(),
    onTriggerRegisterParticipant: jest.fn(),
    onDeleteEvent: jest.fn(),
    colorAccentClass: { bgClass: 'bg-orange-600', textClass: 'text-orange-600' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title, create button, and mapped event cards', () => {
    render(<EventsView {...mockProps} />);

    expect(screen.getByText('Community Events Directory')).toBeInTheDocument();
    expect(screen.getByText('Cricket Under 14')).toBeInTheDocument();
    expect(screen.getByText('Traditional Dance Performance')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Event/i })).toBeInTheDocument();
  });

  it('filters cards when typing queries in search box', () => {
    render(<EventsView {...mockProps} />);

    const searchInput = screen.getByPlaceholderText(/search event title/i);
    fireEvent.change(searchInput, { target: { value: 'Cricket' } });

    expect(screen.getByText('Cricket Under 14')).toBeInTheDocument();
    expect(screen.queryByText('Traditional Dance Performance')).not.toBeInTheDocument();
  });

  it('filters based on status filter selection', () => {
    render(<EventsView {...mockProps} />);

    const select = screen.getByRole('combobox');
    
    // Test ongoing
    fireEvent.change(select, { target: { value: 'ongoing' } });
    expect(screen.getByText('Cricket Under 14')).toBeInTheDocument();
    expect(screen.queryByText('Traditional Dance Performance')).not.toBeInTheDocument();
  });

  it('calls events callbacks like delete event and register participant', () => {
    render(<EventsView {...mockProps} />);

    // Trigger delete event e1
    const deleteBtn = screen.getAllByTitle('Remove Event')[0];
    fireEvent.click(deleteBtn);
    expect(mockProps.onDeleteEvent).toHaveBeenCalledWith('e1', 'Cricket Under 14');

    // Trigger register button clicks
    const registerBtn = screen.getAllByRole('button', { name: /Register/i })[0];
    fireEvent.click(registerBtn);
    expect(mockProps.onTriggerRegisterParticipant).toHaveBeenCalledWith('Cricket Under 14');
  });
});
