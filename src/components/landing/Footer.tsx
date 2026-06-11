import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ChevronRight, Heart, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import beigeLogo from '@/assets/branding/beige-logo.png';

const Footer: React.FC = () => {
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('footer');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#' },
    { icon: <Twitter className="w-5 h-5" />, href: '#' },
    { icon: <Instagram className="w-5 h-5" />, href: '#' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#' }
  ];

  return (
    <footer id="footer" className="footer relative bg-[#5D2413] pt-20 pb-12 overflow-hidden text-primary-foreground">
      <div className={`
        absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}></div>
      <div className={`
        absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full
        mix-blend-soft-light filter blur-3xl opacity-0
        transition-all duration-1000 delay-300
        ${isVisible ? 'opacity-10 animate-blob' : ''}
      `}></div>
      <div className={`
        absolute top-0 right-0 w-96 h-96 bg-primary rounded-full
        mix-blend-soft-light filter blur-3xl opacity-0
        transition-all duration-1000 delay-500
        ${isVisible ? 'opacity-10 animate-blob animation-delay-2000' : ''}
      `}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className={`
            footer-about transform transition-all duration-700
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `} data-aos="fade-up">
            <Link 
              to="/" 
              className="logo flex items-center space-x-2 group mb-6"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center transform group-hover:rotate-12 transition-transform border border-primary-foreground/15">
                <img 
                  src={beigeLogo}
                  alt="KinshipSync Logo" 
                  className="h-9 w-9 object-contain transform group-hover:scale-110 transition-transform"
                />
              </div>
              <h1 className="text-2xl font-bold text-primary-foreground">
                Kinship<span className="text-accent">Sync</span>
              </h1>
            </Link>
            <div className="space-y-6">
              <p className="text-primary-foreground/70 leading-relaxed">
                Your ultimate event planner for reunions—organize guests, budgets, tasks, and vendors in one place.
              </p>
              <div className="space-y-4">
                <a 
                  href="mailto:support@kinshipsync.com" 
                  className="flex items-center space-x-3 text-primary-foreground/70 hover:text-accent transition-colors group"
                  onMouseEnter={() => setHoveredLink('email')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <div className={`
                    w-10 h-10 rounded-lg bg-primary-foreground/10
                    flex items-center justify-center
                    transform transition-all duration-300
                    ${hoveredLink === 'email' ? 'rotate-12 scale-110 shadow-lg' : ''}
                  `}>
                    <Mail className={`
                      text-accent w-5 h-5
                      transform transition-transform duration-300
                      ${hoveredLink === 'email' ? 'scale-110' : ''}
                    `} />
                  </div>
                  <span>support@kinshipsync.com</span>
                </a>
              </div>
            </div>
          </div>

          <div className={`
            transform transition-all duration-700 delay-200
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `} data-aos="fade-up" data-aos-delay="100">
            <h4 className="text-lg font-semibold text-primary-foreground mb-8 relative group">
              <span className="relative z-10">Quick Links</span>
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-secondary rounded-full transform -translate-y-2 opacity-70 group-hover:w-24 transition-all"></div>
            </h4>
            <ul className="space-y-4">
              {[
                { href: '#hero', label: 'Home' },
                { href: '#features', label: 'Features' },
                { href: '#faq', label: 'FAQ' },
                { href: '#support', label: 'Support' },
              ].map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors flex items-center group"
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <ChevronRight className={`
                      text-accent w-5 h-5 mr-2
                      transform transition-all duration-300
                      ${hoveredLink === link.href ? 'translate-x-2 scale-110' : ''}
                    `} />
                    <span className={`
                      transform transition-all duration-300
                      ${hoveredLink === link.href ? 'translate-x-1' : ''}
                    `}>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={`
            transform transition-all duration-700 delay-400
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `} data-aos="fade-up" data-aos-delay="200">
            <h4 className="text-lg font-semibold text-primary-foreground mb-8 relative group">
              <span className="relative z-10">Our Services</span>
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-secondary rounded-full transform -translate-y-2 opacity-70 group-hover:w-24 transition-all"></div>
            </h4>
            <ul className="space-y-4">
              {[
                'Event Websites',
                'RSVP Management',
                'Collaborative Planning',
              ].map((service) => (
                <li key={service}>
                  <a 
                    href="#" 
                    className="text-primary-foreground/70 hover:text-accent transition-colors flex items-center group"
                    onMouseEnter={() => setHoveredLink(service)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <ChevronRight className={`
                      text-accent w-5 h-5 mr-2
                      transform transition-all duration-300
                      ${hoveredLink === service ? 'translate-x-2 scale-110' : ''}
                    `} />
                    <span className={`
                      transform transition-all duration-300
                      ${hoveredLink === service ? 'translate-x-1' : ''}
                    `}>{service}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={`
            transform transition-all duration-700 delay-600
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `} data-aos="fade-up" data-aos-delay="300">
            <h4 className="text-lg font-semibold text-primary-foreground mb-8 relative group">
              <span className="relative z-10">Legal</span>
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-secondary rounded-full transform -translate-y-2 opacity-70 group-hover:w-24 transition-all"></div>
            </h4>
            <ul className="space-y-4">
              {[
                'Privacy Policy',
                'Terms of Service',
                'Cookie Policy',
              ].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-primary-foreground/70 hover:text-accent transition-colors flex items-center group"
                    onMouseEnter={() => setHoveredLink(item)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <ChevronRight className={`
                      text-accent w-5 h-5 mr-2
                      transform transition-all duration-300
                      ${hoveredLink === item ? 'translate-x-2 scale-110' : ''}
                    `} />
                    <span className={`
                      transform transition-all duration-300
                      ${hoveredLink === item ? 'translate-x-1' : ''}
                    `}>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`
          flex justify-center space-x-6 mb-12
          transform transition-all duration-700 delay-800
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `} data-aos="fade-up" data-aos-delay="400">
          {socialLinks.map((social, index) => (
            <a 
              key={`social-${index}`}
              href={social.href}
              className="relative group"
              onMouseEnter={() => setHoveredSocial(index)}
              onMouseLeave={() => setHoveredSocial(null)}
            >
              <div className={`
                w-12 h-12 rounded-xl bg-primary-foreground/10 border border-primary-foreground/10
                flex items-center justify-center
                transform transition-all duration-300
                ${hoveredSocial === index ? 'scale-110 rotate-12 shadow-lg bg-accent/20' : ''}
              `}>
                <div className={`
                  text-accent
                  transform transition-transform duration-300
                  ${hoveredSocial === index ? 'scale-110' : ''}
                `}>
                  {social.icon}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className={`
          text-center border-t border-primary-foreground/15 pt-8
          transform transition-all duration-700 delay-1000
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `} data-aos="fade-up" data-aos-delay="500">
          <p className="text-primary-foreground/70">
            © {new Date().getFullYear()} <span className="text-accent font-semibold">Kinship Sync</span>. All Rights Reserved.
          </p>
          <p className="text-primary-foreground/50 mt-2 flex items-center justify-center">
            Designed with 
            <Heart className="text-secondary w-5 h-5 mx-2 animate-pulse" fill="currentColor" /> 
            for modern families
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
