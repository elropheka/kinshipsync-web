import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

interface PublicPageLayoutProps {
  children: React.ReactNode;
}

const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({ children }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

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

      <main id="main" className="relative overflow-hidden pt-20">
        {children}
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
    </div>
  );
};

export default PublicPageLayout;
