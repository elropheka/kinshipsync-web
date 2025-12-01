// FeaturesCardsSection.tsx
import React, { useState, useEffect } from 'react';
import { Grid, LayoutTemplate, Users, CalendarCheck } from 'lucide-react';

const FeaturesCardsSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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

    const section = document.getElementById('features');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const features = [
    {
      icon: <LayoutTemplate className="w-8 h-8 text-primary" />,
      title: 'Custom Event Websites',
      description: "Create beautiful, personalized event websites that reflect your family's style and event theme.",
      color: 'primary',
      gradient: 'from-primary/20 to-primary/5',
      iconColor: 'text-primary',
      hoverGradient: 'from-primary/30 to-primary/10'
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: 'Collaborative Planning',
      description: 'Invite family and friends to help plan. Share responsibilities, ideas, and updates in real-time.',
      color: 'primary',
      gradient: 'from-primary/20 to-primary/5',
      iconColor: 'text-primary',
      hoverGradient: 'from-primary/30 to-primary/10'
    },
    {
      icon: <CalendarCheck className="w-8 h-8 text-primary" />,
      title: 'RSVP Management',
      description: 'Track attendance, collect preferences, and send automated reminders to keep everyone informed.',
      color: 'primary',
      gradient: 'from-primary/20 to-primary/5',
      iconColor: 'text-primary',
      hoverGradient: 'from-primary/30 to-primary/10'
    },
    {
      icon: <LayoutTemplate className="w-8 h-8 text-primary" />,
      title: 'Vendor',
      description: 'You can register as a vendor and you can also patronise vendors directly in the application',
      color: 'primary',
      gradient: 'from-primary/20 to-primary/5',
      iconColor: 'text-primary',
      hoverGradient: 'from-primary/30 to-primary/10'
    }
  ];

  return (
    <section id="features" className="features-cards section relative py-16 md:py-24 lg:py-32 overflow-hidden">
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
            <Grid className="inline-block w-5 h-5 mr-2 text-primary transform group-hover:rotate-12 transition-transform" />
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Key{' '}
            <span className="relative inline-block group">
              <span className="relative z-10 text-primary transform transition-transform duration-300 group-hover:scale-110">Features</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 transform -rotate-2 transition-all duration-300 group-hover:h-full group-hover:bottom-0 group-hover:rotate-0"></span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to plan the perfect family event, all in one place
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                relative group
                transform transition-all duration-700 delay-${200 * (index + 1)}
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card */}
              <div className={`
                relative overflow-hidden rounded-2xl p-8
                bg-white shadow-lg
                transform transition-all duration-500
                ${hoveredIndex === index ? '-translate-y-2 shadow-xl' : ''}
              `}>
                {/* Background Gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${feature.gradient}
                  transition-opacity duration-300
                  ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}
                `}></div>

                {/* Icon Container */}
                <div className={`
                  relative w-16 h-16 rounded-xl
                  bg-primary/10 shadow-md
                  flex items-center justify-center
                  transform transition-all duration-500
                  ${hoveredIndex === index ? 'rotate-12 scale-110 shadow-lg' : ''}
                `}>
                  <div className={`
                    transform transition-transform duration-300
                    ${hoveredIndex === index ? 'scale-110' : ''}
                  `}>
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="mt-8 relative">
                  <h4 className={`
                    text-xl font-semibold mb-4 text-foreground
                    transform transition-all duration-300
                    ${hoveredIndex === index ? 'translate-x-2 text-primary' : ''}
                  `}>
                    {feature.title}
                  </h4>
                  <p className={`
                    text-muted-foreground leading-relaxed
                    transform transition-all duration-300
                    ${hoveredIndex === index ? 'translate-x-2' : ''}
                  `}>
                    {feature.description}
                  </p>
                </div>

                {/* Decorative Line */}
                <div className={`
                  absolute bottom-0 left-1/2 transform -translate-x-1/2
                  w-16 h-1 rounded-full
                  bg-gradient-to-r from-primary to-primary/20
                  transition-all duration-300
                  ${hoveredIndex === index ? 'w-32 opacity-100' : 'opacity-50'}
                `}></div>

                {/* Hover Border Effect */}
                <div className={`
                  absolute inset-0 border-2 border-primary rounded-2xl
                  opacity-0 transition-opacity duration-300
                  ${hoveredIndex === index ? 'opacity-10' : ''}
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

export default FeaturesCardsSection;
