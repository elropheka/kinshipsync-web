// PlatformSection.tsx
import React, { useState, useEffect } from 'react';
import { Smartphone, ShieldCheck, Globe, Layers, Monitor, CheckCircle, Heart, Users } from 'lucide-react';

const PlatformSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
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

    const section = document.getElementById('platform');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const stats = [
    {
      icon: <Smartphone className="w-8 h-8 text-primary" />,
      title: 'Mobile First',
      description: 'Optimized for on-the-go planning',
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: 'Secure Platform',
      description: 'Enterprise-grade security',
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: 'Global Access',
      description: 'Available worldwide',
      gradient: 'from-primary/20 to-primary/5'
    }
  ];

  return (
    <section id="platform" className="platform section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className={`
        absolute inset-0 bg-gradient-to-b from-backgroundSecondary to-background
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}></div>
      <div className={`
        absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-300
        ${isVisible ? 'opacity-5 animate-blob' : ''}
      `}></div>
      <div className={`
        absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-500
        ${isVisible ? 'opacity-5 animate-blob animation-delay-2000' : ''}
      `}></div>
      <div className={`
        absolute top-1/2 left-1/2 w-64 h-64 bg-primary rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-700
        ${isVisible ? 'opacity-5 animate-blob animation-delay-4000' : ''}
      `}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`
          section-header text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-block mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider transform hover:scale-105 transition-transform group">
            <Layers className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform" />
            Platform
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Platform &{' '}
            <span className="relative inline-block group">
              <span className="relative z-10 text-primary transform transition-transform duration-300 group-hover:scale-110">Audience</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 transform -rotate-2 transition-all duration-300 group-hover:h-full group-hover:bottom-0 group-hover:rotate-0"></span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Built for modern families and event planners, with a focus on accessibility and ease of use
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Platform Requirements Card */}
          <div 
            className={`
              relative transform transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`
              bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden group
              transform transition-all duration-500
              ${hoveredCard === 0 ? 'scale-[1.02] shadow-xl -translate-y-2' : ''}
            `}>
              {/* Background Gradient */}
              <div className={`
                absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent
                opacity-0 transition-opacity duration-300
                ${hoveredCard === 0 ? 'opacity-100' : ''}
              `}></div>

              {/* Icon */}
              <div className={`
                relative w-16 h-16 rounded-xl bg-primary/10
                flex items-center justify-center mb-6
                transform transition-all duration-500
                ${hoveredCard === 0 ? 'rotate-12 scale-110 shadow-lg' : ''}
              `}>
                <Monitor className={`
                  w-8 h-8 text-primary
                  transform transition-transform duration-300
                  ${hoveredCard === 0 ? 'scale-110' : ''}
                `} />
              </div>

              {/* Content */}
              <h3 className={`
                text-2xl font-semibold mb-6
                transition-colors duration-300
                ${hoveredCard === 0 ? 'text-primary' : 'text-foreground'}
              `}>Platform Requirements</h3>
              
              <div className="space-y-6">
                <div className={`
                  transform transition-all duration-300
                  ${hoveredCard === 0 ? 'translate-x-2' : ''}
                `}>
                  <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                    <Smartphone className="w-6 h-6 text-primary mr-3 transform transition-transform duration-300 group-hover:rotate-12" />
                    Mobile & Desktop Support
                  </h4>
                  <ul className="space-y-3 text-gray-600">
                    {[
                      'iOS and Android mobile apps',
                      'Responsive web interface',
                      'Latest and previous 2 OS versions',
                      'Cross-platform synchronization'
                    ].map((item, index) => (
                      <li 
                        key={index}
                        className={`
                          flex items-center transform transition-all duration-300
                          ${hoveredCard === 0 ? `delay-${100 * (index + 1)} translate-x-2` : ''}
                        `}
                      >
                        <CheckCircle className={`
                          w-5 h-5 text-primary mr-2
                          transform transition-transform duration-300
                          ${hoveredCard === 0 ? 'scale-110' : ''}
                        `} fill="currentColor" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Decorative Line */}
              <div className={`
                absolute bottom-0 left-1/2 transform -translate-x-1/2
                w-16 h-1 rounded-full bg-gradient-to-r from-primary to-primary/20
                transition-all duration-300
                ${hoveredCard === 0 ? 'w-32 opacity-100' : 'opacity-50'}
              `}></div>
            </div>
          </div>

          {/* Target Audience Card */}
          <div 
            className={`
              relative transform transition-all duration-700 delay-400
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`
              bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden group
              transform transition-all duration-500
              ${hoveredCard === 1 ? 'scale-[1.02] shadow-xl -translate-y-2' : ''}
            `}>
              {/* Background Gradient */}
              <div className={`
                absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent
                opacity-0 transition-opacity duration-300
                ${hoveredCard === 1 ? 'opacity-100' : ''}
              `}></div>

              {/* Icon */}
              <div className={`
                relative w-16 h-16 rounded-xl bg-primary/10
                flex items-center justify-center mb-6
                transform transition-all duration-500
                ${hoveredCard === 1 ? 'rotate-12 scale-110 shadow-lg' : ''}
              `}>
                <Users className={`
                  w-8 h-8 text-primary
                  transform transition-transform duration-300
                  ${hoveredCard === 1 ? 'scale-110' : ''}
                `} />
              </div>

              {/* Content */}
              <h3 className={`
                text-2xl font-semibold mb-6
                transition-colors duration-300
                ${hoveredCard === 1 ? 'text-primary' : 'text-foreground'}
              `}>Target Audience</h3>
              
              <div className="space-y-6">
                <div className={`
                  transform transition-all duration-300
                  ${hoveredCard === 1 ? 'translate-x-2' : ''}
                `}>
                  <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                    <Heart className="w-6 h-6 text-primary mr-3 transform transition-transform duration-300 group-hover:rotate-12" />
                    Primary Users
                  </h4>
                  <ul className="space-y-3 text-gray-600">
                    {[
                      'African American women and women of color',
                      'Family planners and organizers',
                      'Age 21+ and tech-savvy',
                      'Active in planning family gatherings'
                    ].map((item, index) => (
                      <li 
                        key={index}
                        className={`
                          flex items-center transform transition-all duration-300
                          ${hoveredCard === 1 ? `delay-${100 * (index + 1)} translate-x-2` : ''}
                        `}
                      >
                        <CheckCircle className={`
                          w-5 h-5 text-primary mr-2
                          transform transition-transform duration-300
                          ${hoveredCard === 1 ? 'scale-110' : ''}
                        `} fill="currentColor" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Decorative Line */}
              <div className={`
                absolute bottom-0 left-1/2 transform -translate-x-1/2
                w-16 h-1 rounded-full bg-gradient-to-r from-primary to-primary/20
                transition-all duration-300
                ${hoveredCard === 1 ? 'w-32 opacity-100' : 'opacity-50'}
              `}></div>
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`
                relative transform transition-all duration-700 delay-${600 + (200 * index)}
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className={`
                bg-white rounded-2xl p-8 text-center relative overflow-hidden group
                shadow-lg transition-all duration-500
                transform hover:-translate-y-2
                ${hoveredStat === index ? 'shadow-xl' : ''}
              `}>
                {/* Background Gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${stat.gradient}
                  opacity-0 transition-opacity duration-300
                  ${hoveredStat === index ? 'opacity-100' : ''}
                `}></div>

                {/* Icon */}
                <div className={`
                  relative w-16 h-16 mx-auto rounded-xl
                  bg-primary/10 flex items-center justify-center mb-6
                  transform transition-all duration-500
                  ${hoveredStat === index ? 'rotate-12 scale-110 shadow-lg' : ''}
                `}>
                  <div className={`
                    transform transition-transform duration-300
                    ${hoveredStat === index ? 'scale-110' : ''}
                  `}>
                    {stat.icon}
                  </div>
                </div>

                {/* Content */}
                <h4 className={`
                  text-xl font-semibold mb-2
                  transition-colors duration-300
                  ${hoveredStat === index ? 'text-primary' : 'text-foreground'}
                `}>
                  {stat.title}
                </h4>
                <p className={`
                  text-muted-foreground transition-all duration-300
                  ${hoveredStat === index ? 'translate-y-1' : ''}
                `}>
                  {stat.description}
                </p>

                {/* Decorative Line */}
                <div className={`
                  absolute bottom-0 left-1/2 transform -translate-x-1/2
                  w-16 h-1 rounded-full bg-gradient-to-r from-primary to-primary/20
                  transition-all duration-300
                  ${hoveredStat === index ? 'w-32 opacity-100' : 'opacity-50'}
                `}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation Styles */}
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
    </section>
  );
};

export default PlatformSection;
