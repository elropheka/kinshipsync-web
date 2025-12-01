// LandingPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import FeaturesCardsSection from '../components/landing/FeaturesCardsSection';
import FeaturesTwoSection from '../components/landing/FeaturesTwoSection';
import CallToActionSection from '../components/landing/CallToActionSection';
// import ClientsSection from '../components/landing/ClientsSection';
// import TestimonialsSection from '../components/landing/TestimonialsSection';
import StatsSection from '../components/landing/StatsSection';
// import PricingSection from '../components/landing/PricingSection';
import FAQSection from '../components/landing/FAQSection';
import CallToActionTwoSection from '../components/landing/CallToActionTwoSection';
import ContactSection from '../components/landing/ContactSection';
// import PlatformSection from '../components/landing/PlatformSection';
import AppInstallSection from '../components/landing/AppInstallSection';
import Footer from '../components/landing/Footer';
import { ChevronUp } from 'lucide-react';

import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (currentUser) {
      if(currentUser.role === 'admin') {
        navigate('/dashboard/admin');
      } else if(currentUser.role === 'vendor') {
        navigate('/dashboard/vendor');
      } else {
        navigate('/dashboard/user');
      }
    }
  }, [currentUser, navigate]);

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  // Handle scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main id="main" className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-backgroundSecondary to-background pointer-events-none"></div>

        {/* Content */}
        <div className="relative">
          <HeroSection />
          <AboutSection />
          <FeaturesCardsSection />
          <FeaturesTwoSection />
          <CallToActionSection />
          {/* <ClientsSection /> */}
          {/* <TestimonialsSection /> */}
          <StatsSection />
          {/* <PricingSection /> */}
          <FAQSection />
          <CallToActionTwoSection />
          <ContactSection />
          {/* <PlatformSection /> */}
          <AppInstallSection />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll-to-top button */}
      <button
        onClick={scrollToTop}
        className={`
          fixed bottom-8 right-8 z-50
          w-12 h-12 rounded-full
          bg-primary text-primaryContrastText
          shadow-lg hover:shadow-xl
          flex items-center justify-center
          transform hover:-translate-y-1
          transition-all duration-300
          ${showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      {/* Loading indicator (optional) */}
      <div id="preloader" className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>

      {/* Add smooth scrolling to all internal links */}
      <style>
        {`
          html {
            scroll-behavior: smooth;
          }

          /* Hide preloader once page is loaded */
          body:not(.loading) #preloader {
            display: none;
          }

          /* Smooth section transitions */
          section {
            transition: opacity 0.3s ease-in-out;
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 10px;
          }

          ::-webkit-scrollbar-track {
            background: hsl(var(--muted));
          }

          ::-webkit-scrollbar-thumb {
            background: hsl(var(--primary));
            border-radius: 5px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: hsl(var(--primary) / 0.8);
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
