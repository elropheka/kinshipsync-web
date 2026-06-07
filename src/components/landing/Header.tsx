// Header.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Grid, HelpCircle, Headphones, ArrowRight, Menu, X } from 'lucide-react';
import tealLogoOnly from '@/assets/branding/teal-logo-only.png';
import beigeLogo from '@/assets/branding/beige-logo.png';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Update active section based on scroll position
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionElement = section as HTMLElement;
        const sectionTop = sectionElement.offsetTop - 100;
        const sectionHeight = sectionElement.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          setActiveSection(sectionElement.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => !open);
  };

  const navItems = [
    { href: '#hero', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { href: '#features', label: 'Features', icon: <Grid className="w-5 h-5" /> },
    { href: '#faq', label: 'FAQ', icon: <HelpCircle className="w-5 h-5" /> },
    { href: '#support', label: 'Support', icon: <Headphones className="w-5 h-5" /> },
  ];

  return (
    <>
    <header className={`
      fixed top-0 left-0 right-0
      transition-all duration-500
      ${isMobileMenuOpen ? 'z-[110]' : 'z-50'}
      ${isMobileMenuOpen
        ? 'bg-primary/50 backdrop-blur-md border-b border-white/10 shadow-sm'
        : isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-gradient-to-b from-primary/40 to-transparent'}
    `}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="logo flex items-center space-x-3 group"
          >
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              transform transition-all duration-500
              group-hover:rotate-6 group-hover:scale-105
              ${isMobileMenuOpen ? '!bg-white/10' : isScrolled ? 'bg-primary/10 shadow-sm' : 'bg-primary-foreground/10'}
            `}>
              <img 
                src={isMobileMenuOpen || !isScrolled ? beigeLogo : tealLogoOnly}
                alt="KinshipSync Logo" 
                className="h-9 w-9 object-contain"
              />
            </div>
            <h1 className={`
              sitename text-2xl font-bold tracking-tight
              transition-colors duration-300
              ${isMobileMenuOpen || !isScrolled ? 'text-primary-foreground' : 'text-foreground'}
            `}>
              Kinship<span className={isMobileMenuOpen || !isScrolled ? 'text-accent' : 'text-primary'}>Sync</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:block">
            <ul className="flex items-center space-x-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a 
                    href={item.href}
                    className={`
                      relative group overflow-hidden
                      text-sm font-medium px-4 py-2 rounded-lg
                      transition-all duration-300
                      flex items-center space-x-2
                      ${isScrolled 
                        ? 'text-foreground hover:text-primary' 
                        : 'text-primary-foreground hover:text-accent'}
                      ${activeSection === item.href.slice(1) 
                        ? isScrolled ? 'text-primary bg-primary/10' : 'text-primary-foreground bg-primary-foreground/15' 
                        : ''}
                      ${hoveredItem === item.href ? 'scale-105' : ''}
                    `}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Background Animation */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-r from-primary to-primary/80
                      opacity-0 transition-opacity duration-300
                      ${hoveredItem === item.href ? 'opacity-10' : ''}
                    `}></div>

                    {/* Icon and Label */}
                    <div className={`
                      opacity-75
                      transform transition-all duration-300
                      ${hoveredItem === item.href ? 'scale-110 rotate-12' : ''}
                    `}>
                      {item.icon}
                    </div>
                    <span className="relative z-10">{item.label}</span>

                    {/* Underline Animation */}
                    <span className={`
                      absolute bottom-0 left-0 w-full h-0.5
                      bg-gradient-to-r from-primary to-primary/80
                      transform origin-left transition-transform duration-300
                      ${activeSection === item.href.slice(1) ? 'scale-x-100' : 'scale-x-0'}
                      ${hoveredItem === item.href ? 'scale-x-100' : ''}
                    `}></span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/auth" 
              className={`
                hidden sm:inline-flex items-center gap-2
                px-6 py-3 rounded-xl font-semibold text-sm
                transform transition-all duration-500
                hover:-translate-y-1 hover:shadow-lg
                group relative overflow-hidden
                bg-secondary text-secondary-foreground hover:bg-secondary/90
              `}
            >
              <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className={`
                xl:hidden w-12 h-12 rounded-xl
                flex items-center justify-center
                transform transition-all duration-300
                hover:scale-105
                ${isMobileMenuOpen || !isScrolled
                  ? 'hover:bg-white/10 text-primary-foreground'
                  : 'hover:bg-muted text-foreground'}
              `}
            >
              {isMobileMenuOpen ? (
                <X className={`
                  w-6 h-6 transition-all duration-500
                  rotate-90 scale-110
                `} />
              ) : (
                <Menu className={`
                  w-6 h-6 transition-all duration-500
                  rotate-0
                `} />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Navigation — rendered outside header bar so close button stays accessible */}
    <div
      className={`
        xl:hidden fixed inset-0 z-[100] bg-primary/70 backdrop-blur-xl
        transition-all duration-300
        ${isMobileMenuOpen
          ? 'opacity-100 visible pointer-events-auto'
          : 'opacity-0 invisible pointer-events-none'}
      `}
      aria-hidden={!isMobileMenuOpen}
    >
      <nav className="flex flex-col h-full pt-24 pb-8 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`
                  flex items-center gap-4 px-5 py-4 rounded-xl
                  transition-all duration-200 font-medium
                  ${activeSection === item.href.slice(1)
                    ? 'bg-white/15 text-white'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'}
                `}
                onClick={closeMobileMenu}
              >
                <span className="text-accent">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8 px-1">
          <Link
            to="/auth"
            className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors"
            onClick={closeMobileMenu}
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </nav>
    </div>
    </>
  );
};

export default Header;
