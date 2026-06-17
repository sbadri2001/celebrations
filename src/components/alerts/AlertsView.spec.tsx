import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AlertsView from './AlertsView';

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
}));

describe('AlertsView Component', () => {
  const mockProps = {
    alerts: [
      { id: 'al1', title: 'Traffic Advisory', message: 'Main street is closed.', time: '10m ago', unread: true },
      { id: 'al2', title: 'Power Restored', message: 'The main grid is back up.', time: '2h ago', unread: false },
    ],
    unreadAlertsCount: 1,
    onMarkAllAlertsRead: jest.fn(),
    onDismissAlert: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and alerts list correctly', () => {
    render(<AlertsView {...mockProps} />);

    expect(screen.getByText('Broadcasting Station')).toBeInTheDocument();
    expect(screen.getByText('Traffic Advisory')).toBeInTheDocument();
    expect(screen.getByText('Main street is closed.')).toBeInTheDocument();
    expect(screen.getByText('Power Restored')).toBeInTheDocument();
    expect(screen.getByText('The main grid is back up.')).toBeInTheDocument();
    expect(screen.getByText('1 Urgent')).toBeInTheDocument();
  });

  it('calls onMarkAllAlertsRead when "Mark All as Read" button is clicked', () => {
    render(<AlertsView {...mockProps} />);

    const markReadBtn = screen.getByRole('button', { name: /Mark All as Read/i });
    fireEvent.click(markReadBtn);

    expect(mockProps.onMarkAllAlertsRead).toHaveBeenCalledTimes(1);
  });

  it('calls onDismissAlert when "Acknowledge" button is clicked', () => {
    render(<AlertsView {...mockProps} />);

    const acknowledgeBtn = screen.getByRole('button', { name: /Acknowledge/i });
    fireEvent.click(acknowledgeBtn);

    expect(mockProps.onDismissAlert).toHaveBeenCalledWith('al1', 'Traffic Advisory');
  });
});
