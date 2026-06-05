// Header.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Grid, Tag, Layers, Info, Mail, ArrowRight, Menu, X } from 'lucide-react';
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const navItems = [
    { href: '#hero', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { href: '#features', label: 'Features', icon: <Grid className="w-5 h-5" /> },
    { href: '#pricing', label: 'Pricing', icon: <Tag className="w-5 h-5" /> },
    { href: '#platform', label: 'Platform', icon: <Layers className="w-5 h-5" /> },
    { href: '#about', label: 'About', icon: <Info className="w-5 h-5" /> },
    { href: '#contact', label: 'Contact', icon: <Mail className="w-5 h-5" /> }
  ];

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50
      transition-all duration-500
      ${isScrolled 
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
              ${isScrolled ? 'bg-primary/10 shadow-sm' : 'bg-primary-foreground/10'}
            `}>
              <img 
                src={isScrolled ? tealLogoOnly : beigeLogo}
                alt="KinshipSync Logo" 
                className="h-9 w-9 object-contain"
              />
            </div>
            <h1 className={`
              sitename text-2xl font-bold tracking-tight
              transition-colors duration-300
              ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}
            `}>
              Kinship<span className={isScrolled ? 'text-primary' : 'text-accent'}>Sync</span>
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
              onClick={toggleMobileMenu}
              className={`
                xl:hidden w-12 h-12 rounded-xl
                flex items-center justify-center
                transform transition-all duration-300
                hover:scale-105
                ${isScrolled 
                  ? 'hover:bg-muted text-foreground' 
                  : 'hover:bg-primary-foreground/10 text-primary-foreground'}
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

        {/* Mobile Navigation */}
        <div className={`
          xl:hidden fixed inset-0 bg-background/98 backdrop-blur-lg
          transition-all duration-500 z-50
          ${isMobileMenuOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-full'}
        `}>
          <nav className="h-screen py-20 px-4">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a 
                    href={item.href}
                    className={`
                      flex items-center space-x-4 px-6 py-4 rounded-xl
                      transition-all duration-300 group relative overflow-hidden
                      ${activeSection === item.href.slice(1)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-primary'}
                    `}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      document.body.style.overflow = 'unset';
                    }}
                  >
                    {/* Background Animation */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-r from-primary to-primary/80
                      opacity-0 transition-opacity duration-300
                      group-hover:opacity-10
                    `}></div>

                    <div className={`
                      relative z-10
                      transform transition-all duration-300
                      group-hover:scale-110 group-hover:rotate-12
                    `}>
                      {item.icon}
                    </div>
                    <span className="font-medium relative z-10">{item.label}</span>
                  </a>
                </li>
              ))}
              <li className="sm:hidden px-4 pt-8">
                <Link 
                  to="/auth"
                  className="group relative overflow-hidden block w-full text-center px-6 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    document.body.style.overflow = 'unset';
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <span className="relative z-10">Get Started</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
