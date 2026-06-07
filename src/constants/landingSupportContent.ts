export interface LandingFaqItem {
  question: string;
  answer: string;
}

export interface LandingSupportContact {
  title: string;
  value: string;
  subtext: string;
  link: string | null;
}

export const landingFaq = {
  badge: 'FAQ',
  title: 'Frequently Asked Questions',
  description:
    'Answers about planning reunions, managing events, and using Kinship Sync on web and mobile.',
  supportPrompt: "Can't find what you need?",
  supportCta: 'Email our support team',
  items: [
    {
      question: 'What can I plan with Kinship Sync?',
      answer:
        'Kinship Sync is built for reunions and family gatherings. Create events with dates, locations, descriptions, and themes—then manage guests, budgets, tasks, timelines, vendors, and a public event website from one place.',
    },
    {
      question: 'How do I invite guests and track RSVPs?',
      answer:
        'From your event page, organizers can invite guests by email. Guest list management lets you track who has been invited, monitor attendance, and keep everyone informed as plans change.',
    },
    {
      question: 'Can I publish a custom event website?',
      answer:
        'Yes. Each event can have its own website with a custom URL slug, welcome message, header image, and themed content. Publish the site when you are ready so guests can view details online.',
    },
    {
      question: 'How does budget and task management work?',
      answer:
        'Set an overall event budget and break planning into tasks with timelines. Assign responsibilities to family or friends so everyone knows what needs to be done and when.',
    },
    {
      question: 'How do vendors work in the app?',
      answer:
        'Browse registered vendors and their services from the platform. Vendors maintain profiles, list items or services, and can be associated with events. Admins can register vendors and manage vendor categories.',
    },
    {
      question: 'Who can use Kinship Sync?',
      answer:
        'Event planners sign up as users to create and manage events. Vendors manage their business profile and offerings. Administrators oversee users, events, vendors, and event themes.',
    },
    {
      question: 'Can I control who sees my event?',
      answer:
        'Yes. Events support public, private, and unlisted visibility. Private events limit access to invited users, while unlisted events are only available to people with the link.',
    },
    {
      question: 'How do I access Kinship Sync?',
      answer:
        'Sign up or log in through the web app to start planning. You can also use the Kinship Sync mobile apps to manage events and stay updated with notifications on the go.',
    },
    {
      question: 'How do I get help or delete my account?',
      answer:
        'Email support@kinshipsync.com for help with your account or event. Signed-in users can delete their account from Profile & Settings in the dashboard.',
    },
  ] satisfies LandingFaqItem[],
};

export const landingSupport = {
  badge: 'Support',
  title: 'Get in Touch',
  description:
    'Questions about reunions, events, vendors, or your account? Our team is here to help.',
  email: 'support@kinshipsync.com',
  privacyEmail: 'kinshipsync@gmail.com',
  responseTime: 'We typically respond within 24–48 hours on business days.',
  contacts: [
    {
      title: 'General Support',
      value: 'support@kinshipsync.com',
      subtext: 'Help with events, accounts, and using the platform',
      link: 'mailto:support@kinshipsync.com',
    },
    {
      title: 'Privacy & Data',
      value: 'kinshipsync@gmail.com',
      subtext: 'Privacy requests and data-related questions',
      link: 'mailto:kinshipsync@gmail.com',
    },
  ] satisfies LandingSupportContact[],
};
