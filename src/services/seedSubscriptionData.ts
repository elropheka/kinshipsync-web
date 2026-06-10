import { collection, doc, setDoc, addDoc, getDocs, getDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

const defaultPlans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic event planning tools.',
    price: 0,
    yearlyPrice: null,
    currency: 'USD',
    interval: 'month',
    trialDays: 0,
    features: [],
    isActive: true,
    sortOrder: 0,
    metadata: { color: '#757575', accentColor: '#f5f5f5' },
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for occasional event planners.',
    price: 999,
    yearlyPrice: 9999,
    currency: 'USD',
    interval: 'month',
    trialDays: 14,
    features: ['Unlimited Events', 'Custom Event Pages', 'Guest Management', 'Email & Push Notifications', 'Basic Analytics', 'Vendor Directory Access'],
    isActive: true,
    sortOrder: 1,
    metadata: { color: '#4CAF50', accentColor: '#E8F5E9' },
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For power planners who need it all.',
    price: 1999,
    yearlyPrice: 19999,
    currency: 'USD',
    interval: 'month',
    trialDays: 14,
    features: ['Unlimited Events', 'Event Website', 'Custom Event Pages', 'Guest Management', 'Email & Push Notifications', 'Basic Analytics', 'Vendor Directory Access', 'Priority Support', 'Advanced Analytics', 'Custom Themes', 'Team Collaboration', 'Export & Reporting'],
    isActive: true,
    sortOrder: 2,
    metadata: { color: '#9C27B0', accentColor: '#F3E5F5' },
  },
];

const defaultFeatures = [
  { key: 'unlimited_events', name: 'Unlimited Events', description: 'Create and manage unlimited events', planIds: ['basic', 'premium'], isActive: true },
  { key: 'event_website', name: 'Event Website', description: 'Create a dedicated website for your event', planIds: ['basic', 'premium'], isActive: true },
  { key: 'custom_event_pages', name: 'Custom Event Pages', description: 'Customize your event pages with themes and branding', planIds: ['basic', 'premium'], isActive: true },
  { key: 'guest_management', name: 'Guest Management', description: 'Manage guests, RSVPs, and seating', planIds: ['basic', 'premium'], isActive: true },
  { key: 'notifications', name: 'Email & Push Notifications', description: 'Send email and push notifications to guests', planIds: ['basic', 'premium'], isActive: true },
  { key: 'basic_analytics', name: 'Basic Analytics', description: 'View event attendance and engagement metrics', planIds: ['basic', 'premium'], isActive: true },
  { key: 'vendor_access', name: 'Vendor Directory Access', description: 'Browse and connect with vendors', planIds: ['basic', 'premium'], isActive: true },
  { key: 'priority_support', name: 'Priority Support', description: 'Get priority customer support', planIds: ['premium'], isActive: true },
  { key: 'advanced_analytics', name: 'Advanced Analytics', description: 'Detailed analytics with export capabilities', planIds: ['premium'], isActive: true },
  { key: 'custom_themes', name: 'Custom Themes', description: 'Create and apply custom themes to events', planIds: ['premium'], isActive: true },
  { key: 'team_collaboration', name: 'Team Collaboration', description: 'Invite team members to manage events together', planIds: ['premium'], isActive: true },
  { key: 'export_reports', name: 'Export & Reporting', description: 'Export event data and generate reports', planIds: ['premium'], isActive: true },
];

export async function seedSubscriptionData() {
  const now = serverTimestamp();

  // Clear and recreate plans
  const planSnap = await getDocs(collection(firestore, 'subscriptionPlans'));
  for (const d of planSnap.docs) {
    await setDoc(d.ref, { ...d.data(), isActive: false, updatedAt: now });
  }

  for (const plan of defaultPlans) {
    await setDoc(doc(firestore, 'subscriptionPlans', plan.id), {
      ...plan,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Clear and recreate features
  const featureSnap = await getDocs(collection(firestore, 'appFeatures'));
  for (const d of featureSnap.docs) {
    await setDoc(d.ref, { ...d.data(), isActive: false, updatedAt: now });
  }

  for (const feature of defaultFeatures) {
    await addDoc(collection(firestore, 'appFeatures'), {
      ...feature,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Ensure subscriptionConfig/global exists
  const configRef = doc(firestore, 'subscriptionConfig', 'global');
  const configSnap = await getDoc(configRef);
  if (!configSnap.exists()) {
    await setDoc(configRef, {
      activeProvider: 'stripe',
      stripePublicKey: '',
      paystackPublicKey: '',
      createdAt: now,
      updatedAt: now,
    });
  }
}
