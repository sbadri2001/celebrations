import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Bell, 
  Settings, 
  UserPlus, 
  Plus, 
  TrendingUp, 
  ArrowUpRight, 
  Trophy, 
  Target, 
  Palette, 
  Utensils, 
  X, 
  Search, 
  Trash2, 
  Menu, 
  RefreshCw, 
  Check, 
  Sparkles, 
  Info, 
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  ArrowLeft,
  AlertCircle,
  LogOut,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EventItem, Participant, ActivityUpdate, AlertNotification } from './types';
import LoginScreen from './components/LoginScreen';

export default function App() {
  // Authentication & Simulation States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'phone' | 'otp' | 'reset-password' | 'check-email'>('login');
  const [authEmail, setAuthEmail] = useState('you@example.com');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('(555) 000-0000');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [showLoginErrorDialog, setShowLoginErrorDialog] = useState(false);
  const [enableInlineErrors, setEnableInlineErrors] = useState(true);

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'participants' | 'alerts' | 'settings'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  
  // Customization States (Settings)
  const [communityName, setCommunityName] = useState('Celebrations');
  const [headerTitle, setHeaderTitle] = useState('Good morning, Team!');
  const [headerSubtitle, setHeaderSubtitle] = useState('The Summer Festival prep is in full swing.');
  const [accentColor, setAccentColor] = useState<'orange' | 'emerald' | 'blue' | 'indigo'>('orange');

  // Modals
  const [modalOpen, setModalOpen] = useState<'register' | 'new-event' | null>(null);

  // Success Toast Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Mock Datastores
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: 'e1',
      title: 'Cricket',
      subtitle: 'U-14 Finals',
      status: 'ongoing',
      timeInfo: 'Ongoing',
      category: 'junior',
      type: 'cricket'
    },
    {
      id: 'e2',
      title: 'Dance',
      subtitle: 'Starts 5:00 PM',
      status: 'next-up',
      timeInfo: 'Starts 5:00 PM',
      category: 'all',
      type: 'dance'
    },
    {
      id: 'e3',
      title: 'Football Derby',
      subtitle: 'Adult Category',
      status: 'upcoming',
      timeInfo: 'Tomorrow',
      category: 'adult',
      type: 'football'
    },
    {
      id: 'e4',
      title: 'Yoga Workshop',
      subtitle: 'Super Seniors',
      status: 'upcoming',
      timeInfo: 'Sat 9:00 AM',
      category: 'senior',
      type: 'yoga'
    },
    {
      id: 'e5',
      title: 'Art Exhibition & Competition',
      subtitle: 'Junior & Senior Kids',
      status: 'upcoming',
      timeInfo: 'Sat 2:00 PM',
      category: 'junior',
      type: 'art'
    },
    {
      id: 'e6',
      title: 'Street Food Fair',
      subtitle: 'Summer Fest',
      status: 'upcoming',
      timeInfo: 'Sun 12:00 PM',
      category: 'all',
      type: 'food'
    }
  ]);

  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'p1', name: 'Liam Davis', ageGroup: 'junior', email: 'liam@school.com', registeredEvent: 'Cricket', dateAdded: 'Yesterday' },
    { id: 'p2', name: 'Sarah Jenkins', ageGroup: 'adult', email: 'sarah.j@gmail.com', registeredEvent: 'Dance', dateAdded: '2 days ago' },
    { id: 'p3', name: 'Robert Fletcher', ageGroup: 'senior', email: 'bob.f@outlook.com', registeredEvent: 'Yoga Workshop', dateAdded: '3 days ago' },
    { id: 'p4', name: 'Emily Thompson', ageGroup: 'adult', email: 'emily.t@gmail.com', registeredEvent: 'Street Food Fair', dateAdded: 'Today' },
    { id: 'p5', name: 'Arjun Patel', ageGroup: 'junior', email: 'arjun@patel-family.com', registeredEvent: 'Cricket', dateAdded: 'Today' },
    { id: 'p6', name: 'Sophia Rodriguez', ageGroup: 'adult', email: 'sophia.rod@gmail.com', registeredEvent: 'Art Exhibition & Competition', dateAdded: 'Yesterday' },
    { id: 'p7', name: 'Henry Wilson', ageGroup: 'senior', email: 'h.wilson@comcast.net', registeredEvent: 'Yoga Workshop', dateAdded: '3 days ago' },
    { id: 'p8', name: 'Clara Vance', ageGroup: 'junior', email: 'clara.v@yahoo.com', registeredEvent: 'Art Exhibition & Competition', dateAdded: 'Today' },
    { id: 'p9', name: 'James Kelly', ageGroup: 'adult', email: 'jk@kellybuilds.com', registeredEvent: 'Football Derby', dateAdded: '4 days ago' },
    { id: 'p10', name: 'Eleanor Vance', ageGroup: 'senior', email: 'eleanor.v@yahoo.com', registeredEvent: 'Yoga Workshop', dateAdded: 'Today' }
  ]);

  const [updates, setUpdates] = useState<ActivityUpdate[]>([
    {
      id: 'u1',
      type: 'football',
      title: "Football: Team 'Lions' Registered",
      subtitle: 'Adult Category • 5m ago',
      timeAgo: '5m'
    },
    {
      id: 'u2',
      type: 'yoga',
      title: 'Super Seniors Yoga Workshop',
      subtitle: 'Community Hall • 22m ago',
      timeAgo: '22m'
    },
    {
      id: 'u3',
      type: 'art',
      title: 'Art Submissions Opening',
      subtitle: 'Junior & Senior Kids • 1h ago',
      timeAgo: '1h'
    },
    {
      id: 'u4',
      type: 'food',
      title: 'Food Stalls Application Open',
      subtitle: 'Summer Fest • 3h ago',
      timeAgo: '3h'
    }
  ]);

  const [alerts, setAlerts] = useState<AlertNotification[]>([
    {
      id: 'a1',
      title: 'Weather Warning: Rain expected Saturday morning',
      message: 'Events scheduled in the main outdoor field might be moved to the multi-purpose sports hall. Stay tuned for real-time updates.',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 'a2',
      title: 'Parking arrangements changed for VIP guests',
      message: 'Please direct all vendor delivery trucks to Entrance C instead of Main Avenue to prevent congestion during the setup.',
      time: '4 hours ago',
      unread: true
    },
    {
      id: 'a3',
      title: 'Volunteer briefing scheduled tonight at 7:00 PM',
      message: 'All session coordinators and technical volunteers must join the brief orientation in the main cafeteria area.',
      time: '1 day ago',
      unread: true
    },
    {
      id: 'a4',
      title: 'Stage sound system check complete',
      message: 'Acoustics team confirmed that microphones on Stage 1 and Stage 2 are operating cleanly within decibel safety regulations.',
      time: '2 days ago',
      unread: false
    }
  ]);

  // Expandable Updates List State
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  // Additional updates for history toggle
  const historicalUpdates: ActivityUpdate[] = [
    { id: 'u5', type: 'football', title: "Football: Referee 'Mark Green' Confirmed", subtitle: 'Sports Grounds • 4h ago', timeAgo: '4h' },
    { id: 'u6', type: 'art', title: 'Art: Paint Supply Donation Received', subtitle: 'Hobby Room • 1d ago', timeAgo: '1d' },
    { id: 'u7', type: 'food', title: 'Food: 12 Food Licenses approved by City', subtitle: 'Festival Office • 1d ago', timeAgo: '1d' },
    { id: 'u8', type: 'yoga', title: 'Yoga: Yoga Mats Sanitized and Stacked', subtitle: 'Community Hall • 2d ago', timeAgo: '2d' }
  ];

  // Calculated Live Counters
  const totalRegistrationCounter = useMemo(() => {
    // Offset standard initial calculation to match screenshot's exact counter if database is at initial size.
    // Initial size is 10, target is 1284. So we offset by +1274 to scale dynamically!
    // This maintains visual accuracy to the pixel!
    return 1274 + participants.length;
  }, [participants]);

  const juniorCount = useMemo(() => {
    return 417 + participants.filter(p => p.ageGroup === 'junior').length;
  }, [participants]);

  const adultCount = useMemo(() => {
    return 636 + participants.filter(p => p.ageGroup === 'adult').length;
  }, [participants]);

  const seniorCount = useMemo(() => {
    return 221 + participants.filter(p => p.ageGroup === 'senior').length;
  }, [participants]);

  const unreadAlertsCount = useMemo(() => {
    return alerts.filter(a => a.unread).length;
  }, [alerts]);

  // Form states
  const [regName, setRegName] = useState('');
  const [regAgeGroup, setRegAgeGroup] = useState<'junior' | 'adult' | 'senior'>('adult');
  const [regEmail, setRegEmail] = useState('');
  const [regEvent, setRegEvent] = useState('Cricket');

  const [evtTitle, setEvtTitle] = useState('');
  const [evtSubtitle, setEvtSubtitle] = useState('');
  const [evtStatus, setEvtStatus] = useState<'ongoing' | 'next-up' | 'upcoming'>('upcoming');
  const [evtCategory, setEvtCategory] = useState<'junior' | 'adult' | 'senior' | 'all'>('all');
  const [evtType, setEvtType] = useState<'cricket' | 'dance' | 'football' | 'yoga' | 'art' | 'food' | 'general'>('general');

  // Search states for participants page
  const [participantSearch, setParticipantSearch] = useState('');
  const [participantFilter, setParticipantFilter] = useState<'all' | 'junior' | 'adult' | 'senior'>('all');

  // Search states for events page
  const [eventSearch, setEventSearch] = useState('');
  const [eventFilter, setEventFilter] = useState<'all' | 'ongoing' | 'next-up' | 'upcoming'>('all');

  // Interactive Assistant Chat simulation
  const [assistantMessages, setAssistantMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    { sender: 'assistant', text: `Hello! I'm your ${communityName} Festival Planner Assistant. How can I assist with your coordination tasks today?` }
  ]);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantTyping, setAssistantTyping] = useState(false);

  // Toast Function
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Submit Handlers
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      alert("Please provide name and email.");
      return;
    }

    const newParticipant: Participant = {
      id: 'p-' + Date.now(),
      name: regName,
      ageGroup: regAgeGroup,
      email: regEmail,
      registeredEvent: regEvent,
      dateAdded: 'Just now'
    };

    setParticipants([newParticipant, ...participants]);

    // Create a new update banner
    let updateType: 'football' | 'yoga' | 'art' | 'food' | 'announcement' = 'announcement';
    const foundEvent = events.find(ev => ev.title === regEvent);
    if (foundEvent) {
      if (foundEvent.type === 'football') updateType = 'football';
      else if (foundEvent.type === 'yoga') updateType = 'yoga';
      else if (foundEvent.type === 'art') updateType = 'art';
      else if (foundEvent.type === 'food') updateType = 'food';
    }

    const newUpdate: ActivityUpdate = {
      id: 'u-' + Date.now(),
      type: updateType,
      title: `${regName} registered for ${regEvent}`,
      subtitle: `${regAgeGroup.charAt(0).toUpperCase() + regAgeGroup.slice(1)} Category • Just now`,
      timeAgo: '1s'
    };

    setUpdates([newUpdate, ...updates]);

    // Trigger Toast
    triggerToast(`Successfully registered ${regName} for the ${regEvent}! Counters updated!`);
    
    // Reset Form & Close
    setRegName('');
    setRegEmail('');
    setModalOpen(null);
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim() || !evtSubtitle.trim()) {
      alert("Please provide event title and details.");
      return;
    }

    const newEvent: EventItem = {
      id: 'e-' + Date.now(),
      title: evtTitle,
      subtitle: evtSubtitle,
      status: evtStatus,
      timeInfo: evtStatus === 'ongoing' ? 'Ongoing' : evtStatus === 'next-up' ? 'Starts soon' : evtSubtitle,
      category: evtCategory,
      type: evtType
    };

    setEvents([newEvent, ...events]);

    const newUpdate: ActivityUpdate = {
      id: 'u-' + Date.now(),
      type: evtType === 'football' ? 'football' : evtType === 'yoga' ? 'yoga' : evtType === 'art' ? 'art' : evtType === 'food' ? 'food' : 'announcement',
      title: `New Event Scheduled: "${evtTitle}"`,
      subtitle: `${evtCategory.charAt(0).toUpperCase() + evtCategory.slice(1)} Category • Just now`,
      timeAgo: '1s'
    };

    setUpdates([newUpdate, ...updates]);
    triggerToast(`Added new community event "${evtTitle}" successfully!`);

    _resetEventForm();
    setModalOpen(null);
  };

  const _resetEventForm = () => {
    setEvtTitle('');
    setEvtSubtitle('');
    setEvtStatus('upcoming');
    setEvtCategory('all');
    setEvtType('general');
  };

  const handleDeleteParticipant = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove registration for ${name}?`)) {
      setParticipants(participants.filter(p => p.id !== id));
      triggerToast(`Removed registration for ${name}`);
    }
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, unread: false } : a));
  };

  const handleMarkAllAlertsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, unread: false })));
    triggerToast('All alerts marked as read.');
  };

  // Simulated AI Interaction Handler
  const handleSendAssistant = (textToSend?: string) => {
    const prompt = textToSend || assistantInput;
    if (!prompt.trim()) return;

    const userMessage = { sender: 'user' as const, text: prompt };
    setAssistantMessages(prev => [...prev, userMessage]);
    setAssistantInput('');
    setAssistantTyping(true);

    // Dynamic contextual templates
    setTimeout(() => {
      let responseText = "";
      const lowerPrompt = prompt.toLowerCase();

      if (lowerPrompt.includes('senior') || lowerPrompt.includes('yoga')) {
        responseText = `💡 **Senior Activities Recommendation**:\n\n1. **Golden Age Chess Championship**: Perfect for indoors. We have ${seniorCount} seniors who would be highly receptive!\n2. **Nostalgia Film Matinee**: Run classical community cinema movies with complimentary warm herbal tea.\n3. **Lawn Bowls Social**: A fantastic low-impact outdoor option for Saturday afternoon.`;
      } else if (lowerPrompt.includes('art') || lowerPrompt.includes('theme') || lowerPrompt.includes('paint')) {
        responseText = `🎨 **Creative Art Contest Themes**:\n\n1. *"Portraits of Our Pioneers"*: A heart-warming theme prompting younger students to interview and paint senior community members.\n2. *"Our Shared Horizon"*: Focus on neighborhood conservation, ecosystems, and beautiful natural scenery.\n3. *Mosaic Collage*: A teamwork event wherein children assemble a large mural from recycled cardboards and bottles.`;
      } else if (lowerPrompt.includes('food') || lowerPrompt.includes('stall') || lowerPrompt.includes('menu')) {
        responseText = `🍿 **Food Coordinator Checklist**:\n\n- [ ] **License Check**: Confirm all 12 registered food trucks have printed health hazard clearances.\n- [ ] **Waste Segregation**: Deploy clearly labeled compostable, recyclables, and landfill bins at every stall node.\n- [ ] **Power Loads**: Verify that electrical heavy duty generators in Quadrant B are securely fenced away from children or toddlers.`;
      } else if (lowerPrompt.includes('update') || lowerPrompt.includes('summary') || lowerPrompt.includes('cricket')) {
        responseText = `🏸 **Festival Status Snapshot**:\n\n- **Active Counter**: We currently have a total of **${totalRegistrationCounter} participants** on record!\n- **Highlight Ongoing**: The **Cricket ${events.find(e => e.id === 'e1')?.subtitle || ''}** is capturing massive spectator engagement.\n- **Next Up**: The **Dance session** begins at 5:00 PM. Highly recommend sending a broadcast notification to all junior categories.`;
      } else {
        responseText = `✨ **Coordinator Assistant Suggestion**:\n\n"To boost community registration numbers (currently: **${totalRegistrationCounter}**), I recommend placing directional sandwich boards by the community gardens. We could also announce a 'Family-Double Event Pack' reward. Would you like me to draft an invite email template for you?"`;
      }

      setAssistantMessages(prev => [...prev, { sender: 'assistant', text: responseText }]);
      setAssistantTyping(false);
    }, 1200);
  };

  // Color Scheme Settings
  const colorAccentClass = {
    orange: {
      text: 'text-celebrate-accent',
      borderClass: 'border-celebrate-accent',
      bgClass: 'bg-celebrate-accent',
      hoverBg: 'hover:bg-celebrate-accent/90',
      pillText: 'text-orange-800 bg-orange-100',
      gradientClass: 'from-orange-600 to-amber-700'
    },
    emerald: {
      text: 'text-emerald-700',
      borderClass: 'border-emerald-700',
      bgClass: 'bg-emerald-700',
      hoverBg: 'hover:bg-emerald-800',
      pillText: 'text-emerald-800 bg-emerald-100',
      gradientClass: 'from-emerald-600 to-teal-800'
    },
    blue: {
      text: 'text-blue-700',
      borderClass: 'border-blue-700',
      bgClass: 'bg-blue-700',
      hoverBg: 'hover:bg-blue-800',
      pillText: 'text-blue-800 bg-blue-100',
      gradientClass: 'from-blue-600 to-indigo-800'
    },
    indigo: {
      text: 'text-indigo-700',
      borderClass: 'border-indigo-700',
      bgClass: 'bg-indigo-700',
      hoverBg: 'hover:bg-indigo-800',
      pillText: 'text-indigo-800 bg-indigo-100',
      gradientClass: 'from-indigo-600 to-purple-800'
    }
  }[accentColor];

  // Ongoing Event Details
  const ongoingEvent = events.find(e => e.status === 'ongoing');
  const nextUpEvent = events.find(e => e.status === 'next-up');

  // Filtered lists for auxiliary tabs
  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(participantSearch.toLowerCase()) || 
                            p.email.toLowerCase().includes(participantSearch.toLowerCase()) ||
                            p.registeredEvent.toLowerCase().includes(participantSearch.toLowerCase());
      const matchesFilter = participantFilter === 'all' || p.ageGroup === participantFilter;
      return matchesSearch && matchesFilter;
    });
  }, [participants, participantSearch, participantFilter]);

  const filteredEventsList = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(eventSearch.toLowerCase()) || 
                            e.subtitle.toLowerCase().includes(eventSearch.toLowerCase());
      const matchesFilter = eventFilter === 'all' || e.status === eventFilter;
      return matchesSearch && matchesFilter;
    });
  }, [events, eventSearch, eventFilter]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full relative">
        {/* Toast Alert Notifications */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 font-sans"
            >
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-sm font-medium tracking-wide">{toastMessage}</span>
              <button 
                onClick={() => setToastMessage(null)} 
                className="text-slate-400 hover:text-white transition-colors ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <LoginScreen 
          onLoginSuccess={(userName) => {
            setIsLoggedIn(true);
          }}
          communityName={communityName}
          triggerToast={triggerToast}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row relative overflow-x-hidden antialiased">
      
      {/* Toast Alert Notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 font-sans"
          >
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-sm font-medium tracking-wide">{toastMessage}</span>
            <button 
              onClick={() => setToastMessage(null)} 
              className="text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE HEADER BAR */}
      <header className="md:hidden bg-white border-b border-slate-200/80 px-4 py-4 flex items-center justify-between sticky top-0 z-40 w-full transition-shadow duration-250">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-celebrate-red rounded-xl flex items-center justify-center text-white shadow-md">
            <Users className="w-5 h-5" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-celebrate-red">{communityName}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mobile Alerts Badge Shortcut */}
          <button 
            onClick={() => { setActiveTab('alerts'); setMobileMenuOpen(false); }}
            className="relative p-2 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MOBILE NAVIGATION SIDEBAR DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          >
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-72 h-full shadow-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-celebrate-red rounded-xl flex items-center justify-center text-white shadow-md">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-sans font-bold text-xl tracking-tight text-celebrate-red">{communityName}</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-8 space-y-1.5 font-sans">
                  <button
                    onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'dashboard' 
                        ? 'bg-celebrate-peach text-celebrate-red' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5 text-celebrate-accent" />
                    Dashboard
                  </button>

                  <button
                    onClick={() => { setActiveTab('events'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'events' 
                        ? 'bg-celebrate-peach text-celebrate-red' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    Events
                  </button>

                  <button
                    onClick={() => { setActiveTab('participants'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'participants' 
                        ? 'bg-celebrate-peach text-celebrate-red' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    Participants
                  </button>

                  <button
                    onClick={() => { setActiveTab('alerts'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'alerts' 
                        ? 'bg-celebrate-peach text-celebrate-red' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Bell className="w-5 h-5" />
                      Alerts
                    </div>
                    {unreadAlertsCount > 0 && (
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadAlertsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === 'settings' 
                        ? 'bg-celebrate-peach text-celebrate-red' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </button>
                </nav>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-slate-700 font-bold border-2 border-white shadow-xs">
                      AU
                    </div>
                    <div>
                      <h4 className="text-xs font-sans font-bold text-slate-800">Admin User</h4>
                      <p className="text-[11px] font-medium text-slate-500">View Profile</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsLoggedIn(false);
                      setMobileMenuOpen(false);
                      triggerToast("Logged out. Mode switched to login simulation variations.");
                    }}
                    title="Sign Out (Simulation Mode)"
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer mr-1"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-white border-r border-slate-200/70 p-6 shrink-0 relative sticky top-0 h-screen">
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 bg-celebrate-red rounded-xl flex items-center justify-center text-white shadow-md">
              <Users className="w-5.5 h-0.5 shrink-0" />
            </div>
            <span className="font-sans font-extrabold text-[#9E2F00] text-xl tracking-tight">{communityName}</span>
          </div>

          {/* Navigation items */}
          <nav className="mt-8 space-y-1.5 font-sans">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold tracking-wide transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-celebrate-peach text-[#9E2F00]' 
                  : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-950'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold tracking-wide transition-all ${
                activeTab === 'events' 
                  ? 'bg-celebrate-peach text-[#9E2F00]' 
                  : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-950'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Events
            </button>

            <button
              onClick={() => setActiveTab('participants')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold tracking-wide transition-all ${
                activeTab === 'participants' 
                  ? 'bg-celebrate-peach text-[#9E2F00]' 
                  : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-950'
              }`}
            >
              <Users className="w-5 h-5" />
              Participants
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-semibold tracking-wide transition-all ${
                activeTab === 'alerts' 
                  ? 'bg-celebrate-peach text-[#9E2F00]' 
                  : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                Alerts
              </div>
              {unreadAlertsCount > 0 && (
                <span className="bg-[#b83a05] text-white text-[11px] font-bold px-2 py-0.5 rounded-full tracking-tighter shrink-0 animate-bounce">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold tracking-wide transition-all ${
                activeTab === 'settings' 
                  ? 'bg-celebrate-peach text-[#9E2F00]' 
                  : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-950'
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </nav>
        </div>

        {/* User Card */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between p-2 bg-slate-50/90 rounded-2xl hover:bg-slate-100/90 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-celebrate-accent font-bold border-2 border-white shadow-xs">
                M
              </div>
              <div className="overflow-hidden">
                <h4 className="text-[13px] font-sans font-bold text-slate-800 tracking-tight whitespace-nowrap truncate">Admin User</h4>
                <p className="text-[11px] font-medium text-slate-400">View Profile</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsLoggedIn(false);
                triggerToast("Logged out. Mode switched to login simulation variations.");
              }}
              title="Sign Out (Simulation Mode)"
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer mr-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN BODY WRAPPER */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col font-sans transition-all">
        
        {/* TAB WORKSPACE ROUTER */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Dashboard Content Header Row */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <span className="text-[12px] font-extrabold tracking-widest text-celebrate-accent uppercase">
                    Community Hub
                  </span>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-1 md:text-4xl">
                    {headerTitle}
                  </h1>
                  <p className="text-slate-500 text-sm md:text-base mt-2 max-w-xl font-normal leading-relaxed">
                    {headerSubtitle}
                  </p>
                </div>
                
                {/* Header Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button 
                    onClick={() => setModalOpen('register')}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 font-bold text-sm tracking-wide text-slate-700 shadow-xs cursor-pointer transition-all"
                  >
                    <UserPlus className="w-4.5 h-4.5 text-slate-500" />
                    Registration
                  </button>
                  <button 
                    onClick={() => setModalOpen('new-event')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl ${colorAccentClass.bgClass} ${colorAccentClass.hoverBg} text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg cursor-pointer transition-all`}
                  >
                    <Plus className="w-4.5 h-4.5" />
                    New Event
                  </button>
                </div>
              </div>

              {/* Stats & Event Cards Section (Grid) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Total Participants Left Block Card */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/70 p-6 flex flex-col justify-between shadow-xs relative">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[11px] font-black tracking-widest text-slate-400 uppercase">
                          Total Participants
                        </p>
                        <div className="flex items-baseline gap-3 mt-1.5">
                          <h2 className="text-5xl font-black tracking-tight text-celebrate-accent">
                            {totalRegistrationCounter.toLocaleString()}
                          </h2>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100">
                            ↑ 8%
                          </span>
                        </div>
                      </div>
                      
                      {/* Orange user cluster badge container matches screenshot */}
                      <div className="w-11 h-11 rounded-2xl bg-[#fdf5f2] flex items-center justify-center text-celebrate-accent shrink-0 shadow-xs">
                        <Users className="w-5.5 h-5.5" />
                      </div>
                    </div>
                  </div>

                  {/* Age Category Pills */}
                  <div className="flex flex-wrap gap-2.5 mt-8 border-t border-slate-100/85 pt-5">
                    <div className="bg-slate-50 border border-slate-100 hover:border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center justify-center transition-all">
                      <span className="text-xs font-semibold text-slate-600">
                        Juniors: <span className="font-extrabold text-slate-800 ml-1">{juniorCount}</span>
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 hover:border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center justify-center transition-all">
                      <span className="text-xs font-semibold text-slate-600">
                        Adults: <span className="font-extrabold text-slate-800 ml-1">{adultCount}</span>
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 hover:border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center justify-center transition-all">
                      <span className="text-xs font-semibold text-slate-600">
                        Seniors: <span className="font-extrabold text-slate-800 ml-1">{seniorCount}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right block: Live Event Mini Status-Boxes */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {/* Ongoing Event Card */}
                  <div className="flex-1 bg-blue-50/55 border border-blue-100/90 hover:border-blue-200 rounded-3xl p-5 flex flex-col justify-between transition-all relative">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-700">
                        <Target className="w-4.5 h-4.5" />
                      </div>
                      <span className="bg-[#0560b8] text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md tracking-wider">
                        Ongoing
                      </span>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-[22px] font-extrabold text-[#02315d] leading-none shrink-0 m-0">
                        {ongoingEvent?.title || "Cricket"}
                      </h3>
                      <p className="text-[13px] font-bold text-slate-500 mt-1">
                        {ongoingEvent?.subtitle || "U-14 Finals"}
                      </p>
                    </div>
                  </div>

                  {/* Next Up Event Card */}
                  <div className="flex-1 bg-amber-50/50 border border-amber-100/90 hover:border-amber-200 rounded-3xl p-5 flex flex-col justify-between transition-all relative">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-amber-100/80 flex items-center justify-center text-amber-700">
                        <Palette className="w-4.5 h-4.5" />
                      </div>
                      <span className="bg-slate-900 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md tracking-wider">
                        Next Up
                      </span>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-[22px] font-extrabold text-[#533902] leading-none">
                        {nextUpEvent?.title || "Dance"}
                      </h3>
                      <p className="text-[13px] font-bold text-slate-500 mt-1">
                        {nextUpEvent?.subtitle || "Starts 5:00 PM"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pulse Chart and Updates Section */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Participation Pulse Chart Grid Block */}
                <div className="xl:col-span-7 bg-[#b83a05] text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[380px] h-full">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-black uppercase tracking-widest text-orange-200/90">
                        Community Participation Pulse
                      </p>
                      <ArrowUpRight className="w-5.5 h-5.5 text-orange-200" />
                    </div>

                    {/* Chart visual mimicking the exact design */}
                    <div className="mt-14 flex items-end justify-between gap-2 md:gap-3.5 h-44 px-2">
                      {[
                        { day: 'Mon', h: 'h-14', cap: '240', op: 'bg-white/40' },
                        { day: 'Tue', h: 'h-24', cap: '420', op: 'bg-white/60' },
                        { day: 'Wed', h: 'h-18', cap: '310', op: 'bg-white/40' },
                        { day: 'Thu', h: 'h-32', cap: '610', op: 'bg-white/70' },
                        { day: 'Fri', h: 'h-40', cap: '980', op: 'bg-white' }, // Tallest core
                        { day: 'Sat', h: 'h-28', cap: '540', op: 'bg-white/50' },
                        { day: 'Sun', h: 'h-36', cap: '830', op: 'bg-white/85' },
                        { day: 'Mon', h: 'h-24', cap: '410', op: 'bg-white/45' },
                        { day: 'Tue', h: 'h-34', cap: '760', op: 'bg-white/80' },
                        { day: 'Wed', h: 'h-20', cap: '330', op: 'bg-white/40' }
                      ].map((bar, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-xl border border-slate-700">
                            {bar.cap} participants
                          </div>
                          
                          {/* Curved Bar */}
                          <div className={`w-full ${bar.h} ${bar.op} rounded-t-xl rounded-b-md group-hover:scale-y-105 origin-bottom transition-all shadow-xs`} />
                          
                          <span className="text-[9px] font-bold text-orange-200/80 mt-2 tracking-tighter">
                            {bar.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-center italic text-orange-100/85 text-xs tracking-wide font-medium mt-6">
                    "Bringing the neighborhood together through play and art."
                  </p>
                </div>

                {/* Right Latest Updates Card */}
                <div className="xl:col-span-5 bg-white rounded-3xl border border-slate-200/70 p-6 flex flex-col shadow-xs">
                  
                  {/* Latest Updates Header Row */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-celebrate-accent animate-spin-slow shrink-0" />
                      <h3 className="text-sm font-black tracking-wider text-slate-800 uppercase">
                        Latest Updates
                      </h3>
                    </div>
                    <button 
                      onClick={() => {
                        triggerToast("Updates database re-indexed successfully!");
                        // Simulated rotation animation or quick order shuffle
                        const shuffled = [...updates].reverse();
                        setUpdates(shuffled);
                      }} 
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors whitespace-nowrap"
                    >
                      View History
                    </button>
                  </div>

                  {/* Updates list item nodes */}
                  <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {updates.map((upd) => (
                      <div key={upd.id} className="flex items-start gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-colors">
                        
                        {/* Dynamic circle icon with a unique color background of the update */}
                        {upd.type === 'football' && (
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 shadow-xs">
                            <Trophy className="w-4.5 h-4.5" />
                          </div>
                        )}
                        {upd.type === 'yoga' && (
                          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 shrink-0 shadow-xs">
                            <Sparkles className="w-4.5 h-4.5" />
                          </div>
                        )}
                        {upd.type === 'art' && (
                          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 shrink-0 shadow-xs">
                            <Palette className="w-4.5 h-4.5" />
                          </div>
                        )}
                        {upd.type === 'food' && (
                          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
                            <Utensils className="w-4.5 h-4.5" />
                          </div>
                        )}
                        {upd.type === 'announcement' && (
                          <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 shrink-0 shadow-xs">
                            <Info className="w-4.5 h-4.5" />
                          </div>
                        )}

                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight">
                            {upd.title}
                          </p>
                          <p className="text-[10px] font-medium text-slate-400 mt-1">
                            {upd.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Expandable historical items */}
                    {showAllUpdates && historicalUpdates.map((upd) => (
                      <motion.div 
                        key={upd.id} 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex items-start gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 shadow-xs">
                          {upd.type === 'football' ? <Trophy className="w-4.5 h-4.5" /> : 
                           upd.type === 'yoga' ? <Sparkles className="w-4.5 h-4.5" /> : 
                           upd.type === 'art' ? <Palette className="w-4.5 h-4.5" /> : 
                           <Utensils className="w-4.5 h-4.5" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight">{upd.title}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-1">{upd.subtitle}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Show More Updates button */}
                  <button 
                    onClick={() => setShowAllUpdates(!showAllUpdates)}
                    className="mt-5 w-full py-3 border border-dashed border-slate-300 hover:border-slate-500 rounded-xl text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition-all text-center tracking-wide"
                  >
                    {showAllUpdates ? "Hide Older Updates" : "Show More Updates"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: EVENTS WORKSPACE */}
          {activeTab === 'events' && (
            <motion.div
              key="events-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Community Events Directory</h1>
                  <p className="text-sm text-slate-500 mt-1">Add, update, and manage the schedule of the summer festival.</p>
                </div>
                <button 
                  onClick={() => setModalOpen('new-event')}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl ${colorAccentClass.bgClass} hover:opacity-90 text-white font-bold text-sm shadow-xs`}
                >
                  <Plus className="w-4.5 h-4.5" />
                  Create Event
                </button>
              </div>

              {/* Event Search and Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-white p-4.5 rounded-2xl border border-slate-200/70 shadow-xs">
                <div className="md:col-span-8 relative">
                  <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search event title, group or audience info..."
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 hover:bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-celebrate-accent transition-all"
                  />
                </div>
                <div className="md:col-span-4">
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50/60 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-hidden transition-all"
                  >
                    <option value="all">📊 All Statuses</option>
                    <option value="ongoing">🟢 Ongoing Only</option>
                    <option value="next-up">⚡ Next Up Only</option>
                    <option value="upcoming">🗓️ Upcoming Only</option>
                  </select>
                </div>
              </div>

              {/* Events Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEventsList.map((evt) => (
                  <div key={evt.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                        {/* Event Category Badge */}
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${
                          evt.category === 'junior' ? 'bg-orange-50 text-orange-700 border border-orange-200/50' :
                          evt.category === 'senior' ? 'bg-purple-50 text-purple-700 border border-purple-200/50' :
                          evt.category === 'adult' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
                          'bg-slate-50 text-slate-700 border border-slate-200/60'
                        }`}>
                          👦 {evt.category} Target
                        </span>

                        {/* Status Label */}
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          evt.status === 'ongoing' ? 'bg-emerald-100 text-emerald-800' :
                          evt.status === 'next-up' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {evt.status.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 mt-4 leading-snug">{evt.title}</h3>
                      <p className="text-slate-500 font-medium text-xs mt-1.5">{evt.subtitle}</p>
                    </div>

                    <div className="border-t border-slate-150/40 mt-6 pt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">🕒 {evt.timeInfo}</span>
                      <button
                        onClick={() => {
                          setRegEvent(evt.title);
                          setModalOpen('register');
                        }}
                        className="text-xs font-black text-celebrate-accent hover:underline flex items-center gap-1"
                      >
                        Register
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredEventsList.length === 0 && (
                  <div className="col-span-full bg-slate-50/60 border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500 font-medium">
                    <Info className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="mt-3">No community sessions found matching your queries.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: PARTICIPANTS DIRECTORY */}
          {activeTab === 'participants' && (
            <motion.div
              key="participants-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Registrations List</h1>
                  <p className="text-sm text-slate-500 mt-1">Monitor, query, and remove register status of team participants.</p>
                </div>
                <button 
                  onClick={() => setModalOpen('register')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border shadow-xs transition-colors"
                >
                  <UserPlus className="w-4.5 h-4.5" />
                  Register Participant
                </button>
              </div>

              {/* Query & Filter box */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-white p-4.5 rounded-2xl border border-slate-200/70 shadow-xs">
                <div className="md:col-span-8 relative">
                  <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, email, or registered session title..."
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 hover:bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-celebrate-accent transition-all"
                  />
                </div>
                <div className="md:col-span-4">
                  <select
                    value={participantFilter}
                    onChange={(e) => setParticipantFilter(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50/60 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-hidden transition-all"
                  >
                    <option value="all">👥 All Groups</option>
                    <option value="junior">🧒 Juniors (1-17 yrs)</option>
                    <option value="adult">👨 Adults (18-64 yrs)</option>
                    <option value="senior">👵 Seniors (65+ yrs)</option>
                  </select>
                </div>
              </div>

              {/* Participants Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/45 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                        <th className="px-6 py-4.5">Full Name</th>
                        <th className="px-6 py-4.5">Age Group</th>
                        <th className="px-6 py-4.5">Email Address</th>
                        <th className="px-6 py-4.5">Registered Session</th>
                        <th className="px-6 py-4.5">Registered At</th>
                        <th className="px-6 py-4.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {filteredParticipants.map((part) => (
                        <tr key={part.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border">
                                {part.name.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-900">{part.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4.5">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider uppercase ${
                              part.ageGroup === 'junior' ? 'bg-orange-100 text-orange-850' :
                              part.ageGroup === 'senior' ? 'bg-purple-100 text-purple-850' :
                              'bg-sky-100 text-sky-850'
                            }`}>
                              {part.ageGroup}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 font-mono text-xs text-slate-500">{part.email}</td>
                          <td className="px-6 py-4.5 font-semibold text-slate-800">{part.registeredEvent}</td>
                          <td className="px-6 py-4.5 text-slate-400 font-medium">{part.dateAdded}</td>
                          <td className="px-6 py-4.5 text-right">
                            <button
                              onClick={() => handleDeleteParticipant(part.id, part.name)}
                              className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredParticipants.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                            No registered participants found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: ALERTS / ANNOUNCEMENTS */}
          {activeTab === 'alerts' && (
            <motion.div
              key="alerts-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    Broadcasting Station
                    {unreadAlertsCount > 0 && (
                      <span className="bg-red-600 text-white text-xs px-2.5 py-1 rounded-full">{unreadAlertsCount} Urgent</span>
                    )}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">Review urgent community alerts, traffic, and logistics broadcastings.</p>
                </div>
                {unreadAlertsCount > 0 && (
                  <button 
                    onClick={handleMarkAllAlertsRead}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-bold text-sm tracking-wide text-slate-700 shadow-xs"
                  >
                    <Check className="w-4.5 h-4.5" />
                    Mark All as Read
                  </button>
                )}
              </div>

              {/* Alert List Accordion */}
              <div className="space-y-4">
                {alerts.map((alrt) => (
                  <div 
                    key={alrt.id} 
                    className={`p-5 rounded-2xl border transition-all ${
                      alrt.unread 
                        ? 'border-red-200 bg-red-50/20 shadow-xs' 
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 ${alrt.unread ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className={`text-base tracking-wide ${alrt.unread ? 'font-black text-red-950' : 'font-bold text-slate-800'}`}>
                            {alrt.title}
                          </h3>
                          <span className="text-[10px] text-slate-400 font-extrabold font-mono uppercase mt-1 inline-block">{alrt.time}</span>
                          <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">{alrt.message}</p>
                        </div>
                      </div>
                      
                      {alrt.unread && (
                        <button
                          onClick={() => handleDismissAlert(alrt.id)}
                          className="text-xs font-bold text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portal Configuration</h1>
                <p className="text-sm text-slate-500 mt-1">Personalize the dashboard name, welcoming banner text, and branding palette colors.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Visual Settings Form */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
                  
                  {/* Community Name setting */}
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">Community Name</label>
                    <input
                      type="text"
                      value={communityName}
                      onChange={(e) => setCommunityName(e.target.value)}
                      className="mt-2 w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-celebrate-accent text-sm font-semibold text-slate-800"
                    />
                  </div>

                  {/* Header morning phrase */}
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">Welcome Banner Primary text</label>
                    <input
                      type="text"
                      value={headerTitle}
                      onChange={(e) => setHeaderTitle(e.target.value)}
                      className="mt-2 w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-celebrate-accent text-sm font-semibold text-slate-800"
                    />
                  </div>

                  {/* Welcome banner subtitle */}
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">Welcome Banner Subtitle</label>
                    <textarea
                      rows={2}
                      value={headerSubtitle}
                      onChange={(e) => setHeaderSubtitle(e.target.value)}
                      className="mt-2 w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-celebrate-accent text-sm font-semibold text-slate-800"
                    />
                  </div>

                  {/* Accent palette styling selection */}
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">Action Buttons Palette Color</label>
                    <div className="mt-3 grid grid-cols-4 gap-3">
                      {[
                        { code: 'orange', name: 'Warm Sunset', col: 'bg-orange-600' },
                        { code: 'emerald', name: 'Spring Sage', col: 'bg-emerald-600' },
                        { code: 'blue', name: 'Skylight Blue', col: 'bg-blue-600' },
                        { code: 'indigo', name: 'Royal Blossom', col: 'bg-indigo-600' }
                      ].map((pal) => (
                        <button
                          key={pal.code}
                          onClick={() => setAccentColor(pal.code as any)}
                          className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                            accentColor === pal.code ? 'border-slate-800 bg-slate-5/80' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${pal.col} shadow-inner`} />
                          <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap">{pal.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-5 flex justify-between items-center">
                    <button
                      onClick={() => {
                        setCommunityName('Celebrations');
                        setHeaderTitle('Good morning, Team!');
                        setHeaderSubtitle('The Summer Festival prep is in full swing.');
                        setAccentColor('orange');
                        triggerToast('Settings reverted to default values.');
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 underline"
                    >
                      Reset Defaults
                    </button>
                    
                    <button
                      onClick={() => triggerToast('Portal configuration saved!')}
                      className={`px-5 py-2.5 rounded-xl ${colorAccentClass.bgClass} text-white text-xs font-extrabold hover:opacity-90`}
                    >
                      Apply Changes
                    </button>
                  </div>
                </div>

                {/* Right block: Developer / Workspace info */}
                <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-sm tracking-wide">Workspace Environment</h3>
                  </div>
                  
                  <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed font-sans mt-2">
                    <p>
                      This application is built inside a high-fidelity **Google AI Studio sandbox** using:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono">
                      <li>React 19 + TypeScript 5</li>
                      <li>Tailwind CSS v4 Engine</li>
                      <li>Motion Animation Engine</li>
                    </ul>
                    <p>
                      All database states (Events, Registrants, Notifications) remain dynamic and state-synchronized. 
                      Changes instantly influence counters and live update columns.
                    </p>
                    
                    <button 
                      onClick={() => {
                        // Reset entire mock store to default original state
                        setParticipants([
                          { id: 'p1', name: 'Liam Davis', ageGroup: 'junior', email: 'liam@school.com', registeredEvent: 'Cricket', dateAdded: 'Yesterday' },
                          { id: 'p2', name: 'Sarah Jenkins', ageGroup: 'adult', email: 'sarah.j@gmail.com', registeredEvent: 'Dance', dateAdded: '2 days ago' },
                          { id: 'p3', name: 'Robert Fletcher', ageGroup: 'senior', email: 'bob.f@outlook.com', registeredEvent: 'Yoga Workshop', dateAdded: '3 days ago' },
                          { id: 'p4', name: 'Emily Thompson', ageGroup: 'adult', email: 'emily.t@gmail.com', registeredEvent: 'Street Food Fair', dateAdded: 'Today' },
                          { id: 'p5', name: 'Arjun Patel', ageGroup: 'junior', email: 'arjun@patel-family.com', registeredEvent: 'Cricket', dateAdded: 'Today' }
                        ]);
                        triggerToast("State store reset to fresh mock values!");
                      }}
                      className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold py-2.5 px-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-all text-center tracking-wide"
                    >
                      Reset Clean State Stores
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FLOATING ACTION BUTTON (AI FESTIVAL ASSISTANT) */}
      <div className="fixed bottom-6 right-6 z-40 transition-transform hover:scale-105 active:scale-95">
        <button
          onClick={() => {
            setAssistantOpen(!assistantOpen);
            // Quick trigger toast to hint functionality if closed
            if (!assistantOpen) {
              triggerToast("In-App Event Planner Assistant active.");
            }
          }}
          className={`w-14 h-14 rounded-full bg-slate-900 border border-slate-705 text-white flex items-center justify-center shadow-2xl relative ${
            assistantOpen ? 'rotate-90' : ''
          } transition-transform duration-300`}
          title="Festival Smart Planner Assistant"
        >
          {assistantOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Sparkles className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          )}
        </button>
      </div>

      {/* FLOATING ASSISTANT SIDEPANEL DRAWER */}
      <AnimatePresence>
        {assistantOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-32px)] h-[500px] bg-white rounded-3xl border border-slate-200/90 shadow-2xl z-40 flex flex-col overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-celebrate-red/10 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white tracking-widest uppercase">Smart Planner</h4>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wide">Powered by Celebrations AI</p>
                </div>
              </div>
              <button 
                onClick={() => setAssistantOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Chat message logs */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {assistantMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#b83a05] text-white rounded-br-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-xs'
                  }`}>
                    {/* Render rich text highlights on response */}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {assistantTyping && (
                <div className="flex justify-start">
                  <div className="p-3 bg-white text-slate-500 border border-slate-100 rounded-2xl rounded-bl-none font-medium text-xs flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Smart Suggestions quick pills */}
            <div className="p-2 border-t border-slate-150/50 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none bg-white">
              <button 
                onClick={() => handleSendAssistant("💡 Give activity idea for seniors")} 
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[10px] font-extrabold text-slate-700 rounded-full transition-colors cursor-pointer shrink-0"
              >
                👴 Senior Events
              </button>
              <button 
                onClick={() => handleSendAssistant("🎨 Suggest themes for art contest")} 
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[10px] font-extrabold text-slate-700 rounded-full transition-colors cursor-pointer shrink-0"
              >
                🎨 Art Themes
              </button>
              <button 
                onClick={() => handleSendAssistant("🍿 Food coordinator safety checklist")} 
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[10px] font-extrabold text-slate-700 rounded-full transition-colors cursor-pointer shrink-0"
              >
                🍿 Food stalls check
              </button>
            </div>

            {/* Message input */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendAssistant(); }} 
              className="p-3 border-t border-slate-100 bg-white flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask about event ideas, tasks or lists..."
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-150 rounded-xl text-xs focus:outline-hidden focus:border-celebrate-accent"
              />
              <button 
                type="submit"
                className={`px-3.5 py-2 rounded-xl ${colorAccentClass.bgClass} text-white font-extrabold text-xs tracking-wider cursor-pointer`}
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAY MODAL: PARTICIPANT REGISTRATION FORM */}
      <AnimatePresence>
        {modalOpen === 'register' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 relative border border-slate-100 shadow-2xl font-sans"
            >
              {/* Close Button */}
              <button 
                onClick={() => setModalOpen(null)}
                className="absolute right-5 top-5 p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-celebrate-accent flex items-center justify-center">
                  <UserPlus className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-slate-800">Event Registration</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Register a community member in active schedule</p>
                </div>
              </div>

              {/* Form elements */}
              <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Samantha Parker"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="mt-2 w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-xl focus:outline-hidden focus:border-celebrate-accent text-sm font-semibold text-slate-800"
                  />
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="E.g., samantha.park@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="mt-2 w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-xl focus:outline-hidden focus:border-celebrate-accent text-sm font-semibold text-slate-800"
                  />
                </div>

                {/* Age category group selector */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400">Age Category Group</label>
                  <div className="grid grid-cols-3 gap-2.5 mt-2">
                    {[
                      { code: 'junior', label: '🧒 Junior', sub: '1-17 yrs' },
                      { code: 'adult', label: '👨 Adult', sub: '18-64 yrs' },
                      { code: 'senior', label: '👵 Senior', sub: '65+ yrs' }
                    ].map((grp) => (
                      <button
                        type="button"
                        key={grp.code}
                        onClick={() => setRegAgeGroup(grp.code as any)}
                        className={`p-2.5 rounded-xl border-2 flex flex-col items-center transition-all cursor-pointer ${
                          regAgeGroup === grp.code 
                            ? 'border-celebrate-accent bg-orange-50/15' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-extrabold text-slate-800">{grp.label}</span>
                        <span className="text-[9px] text-slate-400 font-bold mt-0.5">{grp.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select visual active events */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400">Festival Session Target</label>
                  <select
                    value={regEvent}
                    onChange={(e) => setRegEvent(e.target.value)}
                    className="mt-2 w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-xl focus:outline-hidden focus:border-celebrate-accent text-sm font-semibold text-slate-800"
                  >
                    {events.map((evt) => (
                      <option key={evt.id} value={evt.title}>
                        {evt.status === 'ongoing' ? '🟢 ' : evt.status === 'next-up' ? '⚡ ' : '🗓️ '} 
                        {evt.title} ({evt.subtitle})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Form submit actions */}
                <div className="pt-6 border-t border-slate-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(null)}
                    className="flex-1 py-3 text-center rounded-xl font-bold bg-slate-50 hover:bg-slate-100 border text-slate-600 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 text-center rounded-xl font-extrabold ${colorAccentClass.bgClass} text-white hover:opacity-95 text-sm`}
                  >
                    Complete Registration
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAY MODAL: CREATE NEW COMMUNITY EVENT */}
      <AnimatePresence>
        {modalOpen === 'new-event' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 relative border border-slate-100 shadow-2xl font-sans"
            >
              {/* Close Button */}
              <button 
                onClick={() => setModalOpen(null)}
                className="absolute right-5 top-5 p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-celebrate-accent flex items-center justify-center">
                  <Plus className="w-5.5 h-5.5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-slate-800">Add Community Event</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Schedule a new tournament, workshop or stall session</p>
                </div>
              </div>

              {/* Form elements */}
              <form onSubmit={handleCreateEventSubmit} className="mt-5 space-y-4">
                
                {/* Event Name */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400">Event Display Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Baking Competition"
                    value={evtTitle}
                    onChange={(e) => setEvtTitle(e.target.value)}
                    className="mt-2 w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-xl focus:outline-hidden focus:border-celebrate-accent text-sm font-semibold text-slate-800"
                  />
                </div>

                {/* Subtitle Details */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400">Session Description / Subtitle</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Amateur Baking Contest • Kitchen Hall 3"
                    value={evtSubtitle}
                    onChange={(e) => setEvtSubtitle(e.target.value)}
                    className="mt-2 w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-xl focus:outline-hidden focus:border-celebrate-accent text-sm font-semibold text-slate-800"
                  />
                </div>

                {/* Event Types */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400">Event Category Type</label>
                    <select
                      value={evtType}
                      onChange={(e) => setEvtType(e.target.value as any)}
                      className="mt-2 w-full p-3 bg-slate-50/60 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-celebrate-accent font-semibold text-slate-700"
                    >
                      <option value="general">💼 General / Special</option>
                      <option value="cricket">🏸 Cricket / Sports</option>
                      <option value="dance">💃 Dance / Music</option>
                      <option value="football">⚽ Football / Outdoors</option>
                      <option value="yoga">🧘 Yoga / Fitness</option>
                      <option value="art">🎨 Art / Crafts</option>
                      <option value="food">🍿 Food / Stalls</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400">Target Audience Audience</label>
                    <select
                      value={evtCategory}
                      onChange={(e) => setEvtCategory(e.target.value as any)}
                      className="mt-2 w-full p-3 bg-slate-50/60 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-celebrate-accent font-semibold text-slate-700"
                    >
                      <option value="all">🌐 All Communities</option>
                      <option value="junior">🧒 Juniors (Youth)</option>
                      <option value="adult">👨 Adults</option>
                      <option value="senior">👵 Seniors</option>
                    </select>
                  </div>
                </div>

                {/* Event Status Selector */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400">Initial Scheduling Status</label>
                  <div className="grid grid-cols-3 gap-2.5 mt-2">
                    {[
                      { code: 'ongoing', label: '🟢 Ongoing', sub: 'Active right now' },
                      { code: 'next-up', label: '⚡ Next Up', sub: 'Starts very soon' },
                      { code: 'upcoming', label: '🗓️ Upcoming', sub: 'Scheduled later' }
                    ].map((st) => (
                      <button
                        type="button"
                        key={st.code}
                        onClick={() => setEvtStatus(st.code as any)}
                        className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          evtStatus === st.code 
                            ? 'border-celebrate-accent bg-orange-50/15' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-extrabold text-slate-800">{st.label}</span>
                        <span className="text-[8px] text-slate-400 font-bold mt-0.5 leading-tight">{st.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form submit actions */}
                <div className="pt-6 border-t border-slate-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => { _resetEventForm(); setModalOpen(null); }}
                    className="flex-1 py-3 text-center rounded-xl font-bold bg-slate-50 hover:bg-slate-100 border text-slate-600 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-3 text-center rounded-xl font-extrabold ${colorAccentClass.bgClass} text-white hover:opacity-95 text-sm`}
                  >
                    Schedule Session
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
