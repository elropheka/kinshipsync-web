import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Store, ArrowRight, Menu, X, Mail } from 'lucide-react';
import beigeLogo from '@/assets/branding/beige-logo.png';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  sectionId: string;
}

const Header: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
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

  const navItems: NavItem[] = [
    { sectionId: 'hero', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { sectionId: 'features', label: 'Features', icon: <Grid className="w-5 h-5" /> },
    { sectionId: 'vendors', label: 'Vendors', icon: <Store className="w-5 h-5" /> },
    { sectionId: 'support', label: 'Contact Us', icon: <Mail className="w-5 h-5" /> },
  ];

  const getNavTarget = (item: NavItem) => {
    if (item.sectionId === 'hero' && !isLandingPage) {
      return { to: '/' as const, href: undefined };
    }

    if (isLandingPage) {
      return { to: undefined, href: `#${item.sectionId}` };
    }

    return { to: { pathname: '/', hash: `#${item.sectionId}` }, href: undefined };
  };

  const getNavKey = (item: NavItem) => item.sectionId;

  const isNavActive = (item: NavItem) => isLandingPage && activeSection === item.sectionId;

  const navLinkClassName = (item: NavItem, hovered: boolean) => `
    relative group overflow-hidden
    text-sm font-medium px-4 py-2 rounded-lg
    transition-all duration-300
    flex items-center space-x-2
    text-primary-foreground hover:text-accent
    ${isNavActive(item) ? 'text-primary-foreground bg-primary-foreground/15' : ''}
    ${hovered ? 'scale-105' : ''}
  `;

  const renderDesktopNavItem = (item: NavItem) => {
    const target = getNavTarget(item);
    const hovered = hoveredItem === item.sectionId;
    const content = (
      <>
        <div className={`
          absolute inset-0 bg-gradient-to-r from-primary to-primary/80
          opacity-0 transition-opacity duration-300
          ${hovered ? 'opacity-10' : ''}
        `}></div>
        <div className={`
          opacity-75
          transform transition-all duration-300
          ${hovered ? 'scale-110 rotate-12' : ''}
        `}>
          {item.icon}
        </div>
        <span className="relative z-10">{item.label}</span>
        <span className={`
          absolute bottom-0 left-0 w-full h-0.5
          bg-gradient-to-r from-primary to-primary/80
          transform origin-left transition-transform duration-300
          ${isNavActive(item) ? 'scale-x-100' : 'scale-x-0'}
          ${hovered ? 'scale-x-100' : ''}
        `}></span>
      </>
    );

    if (target.to) {
      return (
        <Link
          to={target.to}
          className={navLinkClassName(item, hovered)}
          onMouseEnter={() => setHoveredItem(item.sectionId)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {content}
        </Link>
      );
    }

    return (
      <a
        href={target.href}
        className={navLinkClassName(item, hovered)}
        onMouseEnter={() => setHoveredItem(item.sectionId)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {content}
      </a>
    );
  };

  const renderMobileNavItem = (item: NavItem) => {
    const target = getNavTarget(item);
    const className = `
      flex items-center gap-4 px-5 py-4 rounded-xl
      transition-all duration-200 font-medium
      ${isNavActive(item)
        ? 'bg-white/15 text-white'
        : 'text-white/90 hover:bg-white/10 hover:text-white'}
    `;

    if (target.to) {
      return (
        <Link to={target.to} className={className} onClick={closeMobileMenu}>
          <span className="text-accent">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      );
    }

    return (
      <a href={target.href} className={className} onClick={closeMobileMenu}>
        <span className="text-accent">{item.icon}</span>
        <span>{item.label}</span>
      </a>
    );
  };

  return (
    <>
    <header className={`
      fixed top-0 left-0 right-0 z-50
      transition-all duration-500
      bg-primary/40 backdrop-blur-md
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
              bg-primary-foreground/10
            `}>
              <img 
                src={beigeLogo}
                alt="KinshipSync Logo" 
                className="h-9 w-9 object-contain"
              />
            </div>
            <h1 className={`
              sitename text-2xl font-bold tracking-tight
              transition-colors duration-300
              text-primary-foreground
            `}>
              Kinship<span className="text-accent">Sync</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:block">
            <ul className="flex items-center space-x-8">
              {navItems.map((item) => (
                <li key={getNavKey(item)}>
                  {renderDesktopNavItem(item)}
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
              
              <span className="relative z-10">Download Now</span>
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
                hover:bg-white/10 text-primary-foreground
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
            <li key={getNavKey(item)}>
              {renderMobileNavItem(item)}
            </li>
          ))}
        </ul>

        <div className="mt-8 px-1">
          <Link
            to="/auth"
            className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors"
            onClick={closeMobileMenu}
          >
            Download Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </nav>
    </div>
    </>
  );
};

export default Header;
