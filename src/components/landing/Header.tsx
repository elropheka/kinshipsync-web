import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import tealTextLogo from '@/assets/branding/teal-text-logo.png';
import { landingNavItems } from '@/constants/content/landingPage';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => {
      document.body.style.overflow = open ? 'unset' : 'hidden';
      return !open;
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/40">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-[72px] md:h-20">
          <Link to="/" className="flex-shrink-0">
            <img
              src={tealTextLogo}
              alt="Kinship Sync"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {landingNavItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#516036] transition-colors"
            >
              Get Started
            </Link>

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-foreground hover:bg-muted/30 transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-background z-40 px-4 py-6">
          <nav className="flex flex-col gap-1">
            {landingNavItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={closeMobileMenu}
                className="px-4 py-3 rounded-xl text-foreground font-medium hover:bg-muted/30 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/auth"
              onClick={closeMobileMenu}
              className="mt-4 text-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
