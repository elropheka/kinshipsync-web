import heroBackground from '@/assets/img/about-5.webp';
import testimonialHeroImage from '@/assets/img/about-2.webp';

export const landingNavItems = [
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', href: '#features', label: 'Features' },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', href: '#how-it-works', label: 'How It Works' },
  { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', href: '#testimonials', label: 'Testimonials' },
  { id: 'd4e5f6a7-b8c9-0123-def0-234567890123', href: '#faq', label: 'FAQ' },
] as const;

export const landingHero = {
  badge: 'How many gatherings have you canceled this year?',
  headlineLine1: 'Your family is drifting apart.',
  headlineLine2: 'And you know it.',
  body: "Another month goes by. Another 'let's get together soon' that never happens. The kids are growing up. Your parents are aging.",
  emphasis: "And you're running out of time.",
  cta: 'Stop Losing Time Together',
  socialProofCount: '12,847 families reunited this month',
  socialProofSubtext: "Don't let yours be left behind",
  backgroundImage: heroBackground,
} as const;

export const landingStats = {
  headline: 'The real cost of "we\'ll figure it out later"',
  subheadline: "Every missed gathering is a memory you'll never get back",
  items: [
    {
      id: 'e5f6a7b8-c9d0-1234-ef01-345678901234',
      value: '73%',
      description: 'of families say planning stress causes them to gather less often',
      icon: 'clock' as const,
      color: 'rust' as const,
    },
    {
      id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
      value: '6.2',
      description: 'months average time between family gatherings (used to be 2.1)',
      icon: 'heart' as const,
      color: 'orange' as const,
    },
    {
      id: 'a7b8c9d0-e1f2-3456-0123-567890123456',
      value: '42%',
      description: 'of planned family events never actually happen',
      icon: 'calendar' as const,
      color: 'green' as const,
    },
  ],
} as const;

export const landingValueProp = {
  headline: 'What if you could turn this around?',
  subheadline: 'Imagine this instead:',
  paragraphs: [
    {
      highlight: 'Sunday, 4pm.',
      text: "The whole family actually shows up. Your mom's beaming. The kids are playing with their cousins. Everyone knew the plan, everyone said yes, and everyone's here.",
    },
    {
      highlight: 'No stress.',
      text: "No last-minute 'where are we meeting?' texts. No guilt about who you forgot to invite. Just your people, together.",
    },
  ],
  quote: "This is what we've been missing.",
} as const;

export const landingTestimonialHero = {
  quote: "We've had more family gatherings in the last 3 months than we did in the entire previous year.",
  attribution: '— Maya, Atlanta (Mother of 3, using Kinship Sync for 4 months)',
  image: testimonialHeroImage,
} as const;

export const landingFeatures = {
  headline: 'What you get',
  subheadline: 'No fluff. Just the essentials to keep everyone on the same page.',
  items: [
    {
      id: 'b8c9d0e1-f2a3-4567-1234-678901234567',
      title: 'Smart Scheduling',
      description:
        'Find times that work for everyone with intelligent availability tracking and automatic timezone handling.',
      icon: 'calendar' as const,
      color: 'green' as const,
    },
    {
      id: 'c9d0e1f2-a3b4-5678-2345-789012345678',
      title: 'Easy RSVP',
      description:
        'Simple yes/no/maybe responses with dietary preferences, plus-ones, and special requests all in one place.',
      icon: 'users' as const,
      color: 'orange' as const,
    },
    {
      id: 'd0e1f2a3-b4c5-6789-3456-890123456789',
      title: 'Family Chat',
      description:
        'Keep conversations organized by event. No more searching through endless group texts for that one detail.',
      icon: 'message' as const,
      color: 'orange' as const,
    },
    {
      id: 'e1f2a3b4-c5d6-7890-4567-901234567890',
      title: 'Gentle Reminders',
      description:
        "Thoughtful notifications that keep everyone in the loop without overwhelming anyone's inbox.",
      icon: 'bell' as const,
      color: 'green' as const,
    },
  ],
} as const;

export const landingHowItWorks = {
  headline: 'How it works',
  subheadline: 'Create an event. Invite the family. Everyone stays in the loop. Done.',
  steps: [
    {
      id: 'f2a3b4c5-d6e7-8901-5678-012345678901',
      number: '01',
      title: 'Create an Event',
      description: 'Pick a date, add details, and invite your family members with a simple link. Takes less than 2 minutes.',
      icon: 'edit' as const,
    },
    {
      id: 'a3b4c5d6-e7f8-9012-6789-123456789012',
      number: '02',
      title: 'Collect RSVPs',
      description: "Everyone responds at their own pace. Track who's coming in real-time with automatic reminders.",
      icon: 'check' as const,
    },
    {
      id: 'b4c5d6e7-f8a9-0123-7890-234567890123',
      number: '03',
      title: 'Stay Connected',
      description: 'Share updates, photos, and excitement in your private event chat. No messages get lost.',
      icon: 'chat' as const,
    },
    {
      id: 'c5d6e7f8-a9b0-1234-8901-345678901234',
      number: '04',
      title: 'Make Memories',
      description: "Show up relaxed and ready to enjoy. We've handled all the logistics so you don't have to.",
      icon: 'heart' as const,
    },
  ],
  phonePreview: {
    eventTitle: 'Sunday Dinner',
    location: "Grandma's House",
    date: 'March 30, 2026 • 5:00 PM',
    initials: 'GM',
    confirmedCount: '8 family members confirmed',
    moreCount: '+3 more',
    latestMessage: 'Latest: "Can\'t wait! Should I bring dessert?"',
  },
} as const;

export const landingTestimonials = {
  headline: 'What families are saying',
  items: [
    {
      id: 'd6e7f8a9-b0c1-2345-9012-456789012345',
      quote:
        "I used to spend hours texting back and forth just to plan our monthly dinners. Now everyone knows the plan and actually shows up. It's changed how close we feel as a family.",
      name: 'Maria',
      role: 'Mother of 3',
    },
    {
      id: 'e7f8a9b0-c1d2-3456-0123-567890123456',
      quote:
        "Kinship Sync took the chaos out of our reunion planning. RSVPs, reminders, and updates—all in one place. Our family actually showed up on time for once.",
      name: 'James',
      role: 'Father of 2',
    },
    {
      id: 'f8a9b0c1-d2e3-4567-1234-678901234567',
      quote:
        "My siblings live across three time zones. Smart scheduling found a Sunday that worked for everyone. We hadn't all been together in two years.",
      name: 'Priya',
      role: 'Sister of 4',
    },
  ],
} as const;

export const landingFaqs = {
  headline: 'Common questions',
  items: [
    {
      id: 'a9b0c1d2-e3f4-5678-2345-789012345678',
      question: 'How does Kinship Sync work?',
      answer:
        'Create an event, share a link with your family, and everyone can RSVP, chat, and get reminders—all from their phone or browser. No complicated setup required.',
    },
    {
      id: 'b0c1d2e3-f4a5-6789-3456-890123456789',
      question: 'Is it really free?',
      answer:
        'Yes. Kinship Sync is free forever for families. No credit card required, no hidden fees, and no premium tiers locking away the features you need.',
    },
    {
      id: 'c1d2e3f4-a5b6-7890-4567-901234567890',
      question: 'Do all family members need to download the app?',
      answer:
        'No. Family members can RSVP and stay updated through a simple web link. The mobile app is optional for those who want the full experience.',
    },
    {
      id: 'd2e3f4a5-b6c7-8901-5678-012345678901',
      question: 'Can I use this for large family reunions?',
      answer:
        'Absolutely. Kinship Sync scales from intimate dinners to reunions with hundreds of guests. Track RSVPs, dietary needs, and plus-ones with ease.',
    },
    {
      id: 'e3f4a5b6-c7d8-9012-6789-123456789012',
      question: 'What about privacy and data security?',
      answer:
        'Your family data is encrypted and never sold to third parties. You control who sees what, and event chats are private to invited members only.',
    },
    {
      id: 'f4a5b6c7-d8e9-0123-7890-234567890123',
      question: 'Can I integrate with my calendar?',
      answer:
        'Yes. Add events to Google Calendar, Apple Calendar, or Outlook with one tap. Reminders sync automatically so nobody misses the date.',
    },
  ],
  supportCta: {
    text: "Still have questions? We're here to help.",
    button: 'Contact Support',
    email: 'support@kinshipsync.com',
  },
} as const;

export const landingFinalCta = {
  badge: "Time you can't get back is slipping away",
  headline: 'How many more months will you wait?',
  body: "Your kids won't be this age forever. Your parents won't be around forever.",
  emphasis: 'Start gathering while you still can.',
  cta: 'Plan Your First Gathering Now',
  microcopy: 'Free forever. No credit card. Set up in under 2 minutes.',
  socialProofHighlight: '2,847 families',
  socialProofRest: 'created their first gathering this week',
  socialProofSubtext: "Don't let another week go by",
} as const;

export const landingFooter = {
  tagline: 'Bringing families closer together, one gathering at a time.',
  madeWith: 'Made with',
  madeFor: 'for families everywhere',
  productLinks: [
    { id: 'a5b6c7d8-e9f0-1234-8901-345678901234', label: 'Features', href: '#features' },
    { id: 'b6c7d8e9-f0a1-2345-9012-456789012345', label: 'How It Works', href: '#how-it-works' },
    { id: 'c7d8e9f0-a1b2-3456-0123-567890123456', label: 'Pricing', href: '#faq' },
    { id: 'd8e9f0a1-b2c3-4567-1234-678901234567', label: 'Download App', href: '#how-it-works' },
  ],
  companyLinks: [
    { id: 'e9f0a1b2-c3d4-5678-2345-789012345678', label: 'About Us', href: '#' },
    { id: 'f0a1b2c3-d4e5-6789-3456-890123456789', label: 'Blog', href: '#' },
    { id: 'a1b2c3d4-e5f6-7890-4567-901234567890', label: 'Careers', href: '#' },
    { id: 'b2c3d4e5-f6a7-8901-5678-012345678901', label: 'Contact', href: 'mailto:support@kinshipsync.com' },
  ],
  legalLinks: [
    { id: 'c3d4e5f6-a7b8-9012-6789-123456789012', label: 'Privacy Policy', href: '#' },
    { id: 'd4e5f6a7-b8c9-0123-7890-234567890123', label: 'Terms of Service', href: '#' },
    { id: 'e5f6a7b8-c9d0-1234-8901-456789012345', label: 'Cookie Policy', href: '#' },
  ],
  copyright: '© 2026 Kinship Sync. All rights reserved.',
} as const;
