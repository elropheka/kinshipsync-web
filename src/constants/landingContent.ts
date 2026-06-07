import {
  CalendarPlus,
  LayoutTemplate,
  Users,
  Wallet,
  ListChecks,
  Store,
} from 'lucide-react';

export const landingHero = {
  badge: 'Bring Everyone Together',
  headlineLine1: 'Your Ultimate Event',
  headlineLine2: 'Planner and',
  headlineHighlight: 'Beyond!',
  description:
    'Easily organize your reunion with family and friends in one central spot.',
};

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

export const landingAbout = {
  badge: 'OUR MISSION',
  title: 'Reunions That Bring Everyone Together',
  description:
    'Easily organize your reunion with family and friends in one central spot.',
};
