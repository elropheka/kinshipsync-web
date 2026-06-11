import { CalendarPlus, LayoutTemplate, Users, Wallet, ListChecks, Store } from 'lucide-react';

export const landingHero = {
  headline: 'Your Ultimate Event Planning Collaborator',
  description:
    'Bring your family together with a custom event website, collaborative planning tools, RSVP management, and a clear event schedule – all in one place.',
  subDescription:
    'Whether you\'re organizing a family reunion, planning a vacation, or coordinating any type of event, Kinship Sync makes the process simple and stress-free. Invite your family and friends to join the planning, track who\'s attending, and keep everyone on the same page.',
  tagline:
    'This is your one-stop-shop to digitalize the event planning process and make it easier for everyone to participate. No more confusion, no more missed details – just seamless event coordination from start to finish! Let us help you create a memorable event with ease.',
};

export const landingAbout = {
  title: 'Kinship Sync is an all-in-one event planning platform designed to help families, communities, and event organizers create memorable experiences together.',
  description:
    'Our platform allows you to build custom event websites, manage guest lists, organize schedules, coordinate tasks, and keep everyone informed in one centralized space.',
  closing: 'Whether you\'re planning a family reunion, wedding, birthday celebration, vacation, conference, or community event, Kinship Sync brings everyone together.',
};

export const whyChooseFeatures = [
  {
    title: 'Custom Event Websites',
    description: 'Create a personalized event website in minutes. Customize the design, theme, colors, and layout to match your event.',
  },
  {
    title: 'Collaborative Planning',
    description: 'Invite family members, friends, and organizers to participate in the planning process. Everyone can contribute ideas, assist with tasks, and stay updated.',
  },
  {
    title: 'RSVP Management',
    description: 'Track attendance, collect dietary preferences, manage guest information, and send updates from a single dashboard.',
  },
  {
    title: 'Event Scheduling',
    description: 'Keep everyone informed with a clear event itinerary, schedule, and timeline.',
  },
  {
    title: 'Simplified Communication',
    description: 'Send announcements, messages, and reminders directly through the platform.',
  },
] as const;

export const landingFeatures = {
  sectionSubtitle:
    'Collaborate with family and friends to streamline your reunion—all in one place.',
  items: [
    {
      icon: CalendarPlus,
      title: 'Event Creation',
      description: 'Set up your reunion with guided tools that keep every detail organized.',
    },
    {
      icon: LayoutTemplate,
      title: 'Customized Invites & Website',
      description: 'Design personalized invitations and a beautiful event website.',
    },
    {
      icon: Users,
      title: 'Guest List Management',
      description: 'Track RSVPs and manage attendees in one shared place.',
    },
    {
      icon: Wallet,
      title: 'Budget Management',
      description: 'Plan and monitor reunion expenses so everyone stays aligned.',
    },
    {
      icon: ListChecks,
      title: 'Task & Timeline Management',
      description: 'Assign tasks, set deadlines, and follow a clear timeline.',
    },
    {
      icon: Store,
      title: 'Vendor & Supplier Management',
      description: 'Find and coordinate vendors for catering, venues, and more.',
    },
  ] as const,
};

export const detailedFeatures = [
  {
    category: 'Event Creation & Customization',
    description: 'Create events with:',
    items: ['Event name', 'Description', 'Date and time', 'Location', 'Custom themes', 'Color schemes', 'Layout options', 'Personalized event websites'],
  },
  {
    category: 'Guest List Management',
    description: 'Manage your guest list effortlessly. Features include:',
    items: ['Add guests manually', 'Import contacts', 'Send invitations', 'Track RSVPs', 'Collect guest preferences', 'Store guest information', 'Allow personal notes and nicknames'],
  },
  {
    category: 'Budget Management',
    description: 'Stay on budget from start to finish. Features include:',
    items: ['Budget planning', 'Expense allocation', 'Spending tracking', 'Cost estimates', 'Vendor budgeting', 'Financial oversight'],
  },
  {
    category: 'Task & Timeline Management',
    description: 'Keep your event organized and on schedule. Features include:',
    items: ['To-do lists', 'Task assignments', 'Deadlines', 'Automated reminders', 'Event timelines', 'Progress tracking'],
  },
  {
    category: 'Vendor Management',
    description: 'Discover and manage vendors in one place. Features include:',
    items: ['Vendor discovery', 'Vendor comparisons', 'Booking management', 'Contact storage', 'Contract management', 'Payment tracking', 'Vendor reviews and ratings'],
  },
  {
    category: 'Invitations & RSVP Tracking',
    description: 'Design and send invitations through:',
    items: ['Email', 'SMS', 'Social media', 'Automated RSVP tracking', 'Guest reminders', 'Plus-one management', 'Gift suggestions', 'Food preference collection'],
  },
  {
    category: 'Seating & Food Coordination',
    description: 'Make event logistics easier. Features include:',
    items: ['Seating charts', 'Floor plans', 'Drag-and-drop guest placement', 'Potluck food coordination', 'Shared menu planning'],
  },
  {
    category: 'Communication Tools',
    description: 'Stay connected with everyone involved. Features include:',
    items: ['Direct messaging', 'Group chats', 'Team collaboration', 'Event notifications', 'Real-time updates'],
  },
  {
    category: 'Family Connections',
    description: 'Celebrate and preserve family history. Features include:',
    items: ['Family tree creation', 'Family member profiles', 'Photos and memories', 'Relationship mapping'],
  },
  {
    category: 'Media Sharing',
    description: 'Capture and share special moments. Features include:',
    items: ['Shared photo albums', 'Video sharing', 'Event galleries', 'Memory preservation'],
  },
  {
    category: 'Collaboration & Permissions',
    description: 'Work together while maintaining control. Features include:',
    items: ['Multiple organizers', 'Role-based access', 'Admin permissions', 'Guest permissions', 'Team collaboration'],
  },
  {
    category: 'Analytics & Feedback',
    description: 'Understand event participation and success. Features include:',
    items: ['RSVP tracking', 'Attendance analytics', 'Engagement insights', 'Guest feedback surveys', 'Ratings and reviews'],
  },
] as const;

export const additionalFeatures = [
  'Event schedules',
  'Registration systems',
  'Ticket sales',
  'Custom event websites',
  'Family photo albums',
  'Event merchandise ordering',
  'Custom t-shirt ordering',
] as const;

export const perfectFor = [
  {
    title: 'Family Reunions',
    description: 'Reconnect generations and organize unforgettable gatherings.',
  },
  {
    title: 'Weddings',
    description: 'Coordinate guests, schedules, vendors, and celebrations.',
  },
  {
    title: 'Vacations',
    description: 'Plan group trips with shared itineraries and communication tools.',
  },
  {
    title: 'Birthday Celebrations',
    description: 'Manage invitations, RSVPs, and event activities.',
  },
  {
    title: 'Community Events',
    description: 'Bring communities together with collaborative planning tools.',
  },
  {
    title: 'Conferences & Festivals',
    description: 'Handle registrations, schedules, and attendee engagement.',
  },
] as const;

export const howItWorks = [
  {
    step: 1,
    title: 'Create Your Event',
    description: 'Set up your event and customize your event website.',
  },
  {
    step: 2,
    title: 'Invite Participants',
    description: 'Share invitations with family, friends, guests, and organizers.',
  },
  {
    step: 3,
    title: 'Collaborate Together',
    description: 'Manage tasks, budgets, vendors, schedules, and guest information.',
  },
  {
    step: 4,
    title: 'Celebrate Stress-Free',
    description: 'Enjoy your event while Kinship Sync keeps everyone aligned.',
  },
] as const;

export const pricingPlans = [
  {
    name: 'Free Plan',
    description: 'Get started with essential planning tools.',
  },
  {
    name: 'Basic Plan',
    description: 'Perfect for small to medium-sized events.',
  },
  {
    name: 'Pro Plan',
    description: 'Advanced features for larger events and organizers.',
  },
  {
    name: 'Add Ons',
    description: 'Additional storage, premium themes, advanced analytics, and vendor promotion tools.',
  },
  {
    name: 'Free Trial',
    description: 'Try all features free before committing to a plan.',
  },
] as const;
