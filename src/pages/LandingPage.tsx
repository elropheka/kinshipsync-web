import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import WhyChooseSection from '../components/landing/FeaturesTwoSection';
import PerfectForSection from '../components/landing/PerfectForSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import PricingSection from '../components/landing/PricingSection';
import VendorSection from '../components/landing/VendorSection';
import FutureVisionSection from '../components/landing/FutureVisionSection';
import ContactSection from '../components/landing/ContactSection';
import Footer from '../components/landing/Footer';

const LandingPage: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (currentUser.role === 'vendor') {
        navigate('/dashboard/vendor');
      } else {
        navigate('/dashboard/user');
      }
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    document.body.classList.remove('loading');

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
      <Header />

      <main id="main" className="relative overflow-hidden">
        <HeroSection />
        <AboutSection />
        <WhyChooseSection />
        <HowItWorksSection />
        <PerfectForSection />
        <PricingSection />
        <VendorSection />
        <FutureVisionSection />
        <ContactSection />
      </main>

      <Footer />

      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center transform hover:-translate-y-1 transition-all duration-300 ${
          showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <div
        id="preloader"
        className="fixed inset-0 bg-background z-50 flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>

      <style>{`
        html { scroll-behavior: smooth; }
        body:not(.loading) #preloader { display: none; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: hsl(var(--muted)); }
        ::-webkit-scrollbar-thumb { background: hsl(var(--primary)); border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: hsl(var(--primary) / 0.8); }
      `}</style>
    </div>
  );
};

export default LandingPage;
