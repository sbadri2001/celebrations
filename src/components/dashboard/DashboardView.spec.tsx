import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardView from './DashboardView';

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
}));

describe('DashboardView Component', () => {
  const mockProps = {
    headerTitle: 'Welcome to Fest',
    headerSubtitle: 'Exciting preparations are live',
    totalRegistrationCounter: 42,
    juniorCount: 15,
    adultCount: 20,
    seniorCount: 7,
    ongoingEvent: {
      id: 'e1',
      title: 'Ongoing Matches',
      subtitle: 'Pitch 1 & 2',
      status: 'ongoing' as const,
      timeInfo: 'Ongoing',
      category: 'all' as const,
      type: 'cricket' as const,
    },
    nextUpEvent: {
      id: 'e2',
      title: 'Upcoming Arts Workshop',
      subtitle: 'Main Hall',
      status: 'next-up' as const,
      timeInfo: 'Starts 3:00 PM',
      category: 'junior' as const,
      type: 'art' as const,
    },
    updates: [
      { id: 'u1', type: 'yoga' as const, title: 'Scores updated', subtitle: 'Ground A', timeAgo: '2m' },
    ],
    onTriggerRegistration: jest.fn(),
    onTriggerCreateEvent: jest.fn(),
    onShuffleUpdates: jest.fn(),
    colorAccentClass: { bgClass: 'bg-orange-600', hoverBg: 'hover:bg-orange-700', textClass: 'text-orange-600' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders stats, headers, and events correctly', () => {
    render(<DashboardView {...mockProps} />);

    expect(screen.getByText('Welcome to Fest')).toBeInTheDocument();
    expect(screen.getByText('Exciting preparations are live')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument(); // total registration count
    expect(screen.getByText('15')).toBeInTheDocument(); // juniors
    expect(screen.getByText('20')).toBeInTheDocument(); // adults
    expect(screen.getByText('7')).toBeInTheDocument(); // seniors
    expect(screen.getByText('Ongoing Matches')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Arts Workshop')).toBeInTheDocument();
  });

  it('triggers onTriggerRegistration callback on edit click', () => {
    render(<DashboardView {...mockProps} />);

    const regButton = screen.getByRole('button', { name: /registration/i });
    fireEvent.click(regButton);

    expect(mockProps.onTriggerRegistration).toHaveBeenCalled();
  });

  it('triggers onTriggerCreateEvent callback', () => {
    render(<DashboardView {...mockProps} />);

    const eventButton = screen.getByRole('button', { name: /new event/i });
    fireEvent.click(eventButton);

    expect(mockProps.onTriggerCreateEvent).toHaveBeenCalled();
  });
});
