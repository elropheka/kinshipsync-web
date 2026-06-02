import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronUp } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import TestimonialHeroSection from '../components/landing/TestimonialHeroSection';
import FeaturesCardsSection from '../components/landing/FeaturesCardsSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import FinalCTASection from '../components/landing/FinalCTASection';
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
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#F5EFE8]">
      <Header />

      <main id="main">
        <HeroSection />
        <StatsSection />
        <TestimonialHeroSection />
        <FeaturesCardsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>

      <Footer />

      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-[#516036] transition-all duration-300 ${
          showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        aria-label="Scroll to top"
      >
        <FiChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default LandingPage;
