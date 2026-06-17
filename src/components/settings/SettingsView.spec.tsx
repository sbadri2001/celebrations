import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsView from './SettingsView';

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
}));

describe('SettingsView Component', () => {
  const mockProps = {
    communityName: 'Our Block',
    setCommunityName: jest.fn(),
    headerTitle: 'Good morning',
    setHeaderTitle: jest.fn(),
    headerSubtitle: 'Prepare for festival',
    setHeaderSubtitle: jest.fn(),
    accentColor: 'orange' as const,
    setAccentColor: jest.fn(),
    onResetDefaults: jest.fn(),
    onResetParticipants: jest.fn(),
    triggerToast: jest.fn(),
    colorAccentClass: { bgClass: 'bg-orange-600', hoverBg: 'hover:bg-orange-700', textClass: 'text-orange-600' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form options correctly', () => {
    render(<SettingsView {...mockProps} />);

    expect(screen.getByText('Portal Configuration')).toBeInTheDocument();
    expect(screen.getByLabelText(/Community Name/i)).toHaveValue('Our Block');
    expect(screen.getByLabelText(/Welcome Banner Primary text/i)).toHaveValue('Good morning');
    expect(screen.getByLabelText(/Welcome Banner Subtitle/i)).toHaveValue('Prepare for festival');
  });

  it('triggers update callback triggers on input changes', () => {
    render(<SettingsView {...mockProps} />);

    const selectName = screen.getByLabelText(/Community Name/i);
    fireEvent.change(selectName, { target: { value: 'New Block Name' } });
    expect(mockProps.setCommunityName).toHaveBeenCalledWith('New Block Name');
  });

  it('triggers reset actions correctly', () => {
    render(<SettingsView {...mockProps} />);

    const resetDefaultsBtn = screen.getByRole('button', { name: /Reset Defaults/i });
    fireEvent.click(resetDefaultsBtn);
    expect(mockProps.onResetDefaults).toHaveBeenCalledTimes(1);

    const resetStateBtn = screen.getByRole('button', { name: /Reset Clean State Stores/i });
    fireEvent.click(resetStateBtn);
    expect(mockProps.onResetParticipants).toHaveBeenCalledTimes(1);
  });
});
