export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  status: 'ongoing' | 'next-up' | 'upcoming';
  timeInfo: string;
  category: 'junior' | 'adult' | 'senior' | 'all';
  type: 'cricket' | 'dance' | 'football' | 'yoga' | 'art' | 'food' | 'general';
}

export interface Participant {
  id: string;
  name: string;
  ageGroup: 'junior' | 'adult' | 'senior';
  email: string;
  registeredEvent: string;
  dateAdded: string;
}

export interface ActivityUpdate {
  id: string;
  type: 'football' | 'yoga' | 'art' | 'food' | 'announcement';
  title: string;
  subtitle: string;
  timeAgo: string;
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface Team {
  id: string;
  name: string;
  block: string; // e.g., AH
  logoUrl: string;
  captainName: string;
  captainPictureUrl: string;
  viceCaptainName: string;
  viceCaptainPictureUrl: string;
  participantCount: number;
  dateCreated: string;
  contactEmail: string;
}
