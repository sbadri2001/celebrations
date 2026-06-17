import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TeamsView from './TeamsView';

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the common Modal component so we can test TeamsView inside standard Jest environment
jest.mock('../common/Modal', () => ({
  __esModule: true,
  default: function MockModal({ isOpen, children, title }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-modal">
        <h2>{title}</h2>
        {children}
      </div>
    );
  }
}));

describe('TeamsView Component', () => {
  const mockProps = {
    teams: [
      {
        id: 't1',
        name: 'Thunder Cats',
        block: 'AN',
        logoUrl: 'https://cats.com/logo.png',
        captainName: 'James Carter',
        captainPictureUrl: 'https://cats.com/james.png',
        viceCaptainName: 'Lily Moore',
        viceCaptainPictureUrl: 'https://cats.com/lily.png',
        participantCount: 12,
        dateCreated: 'Jun 10, 2026',
        contactEmail: 'contact@thundercats.org',
      },
      {
        id: 't2',
        name: 'Solar Flares',
        block: 'KH',
        logoUrl: 'https://flares.com/logo.png',
        captainName: 'Zara Ali',
        captainPictureUrl: 'https://flares.com/zara.png',
        viceCaptainName: 'Leo Fritz',
        viceCaptainPictureUrl: 'https://flares.com/leo.png',
        participantCount: 8,
        dateCreated: 'Jun 11, 2525',
        contactEmail: 'solar@flares.org',
      }
    ],
    onAddTeam: jest.fn(),
    onUpdateTeam: jest.fn(),
    onDeleteTeam: jest.fn(),
    triggerToast: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders team directory list entries correctly', () => {
    render(<TeamsView {...mockProps} />);

    expect(screen.getByText('Community Teams Register')).toBeInTheDocument();
    
    // Team Names
    expect(screen.getByText('Thunder Cats')).toBeInTheDocument();
    expect(screen.getByText('Solar Flares')).toBeInTheDocument();

    // Block values
    expect(screen.getByText('AN')).toBeInTheDocument();
    expect(screen.getByText('KH')).toBeInTheDocument();

    // Captain Names
    expect(screen.getByText('James Carter')).toBeInTheDocument();
    expect(screen.getByText('Zara Ali')).toBeInTheDocument();

    // Participant counter badges
    expect(screen.getByText('12 members')).toBeInTheDocument();
    expect(screen.getByText('8 members')).toBeInTheDocument();
  });

  it('filters based on searched keyword queries', () => {
    render(<TeamsView {...mockProps} />);

    const searchInput = screen.getByPlaceholderText(/search by team name/i);
    fireEvent.change(searchInput, { target: { value: 'Solar' } });

    expect(screen.getByText('Solar Flares')).toBeInTheDocument();
    expect(screen.queryByText('Thunder Cats')).not.toBeInTheDocument();
  });

  it('triggers onDeleteTeam when disband button is clicked', () => {
    render(<TeamsView {...mockProps} />);

    const disbandBtn = screen.getAllByTitle('Disband Team Record')[0];
    fireEvent.click(disbandBtn);

    expect(mockProps.onDeleteTeam).toHaveBeenCalledWith('t1', 'Thunder Cats');
  });
});
