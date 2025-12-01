// StatsSection.tsx
import React, { useState, useEffect } from 'react';
import { CalendarCheck, Users, SmilePlus, Headphones, TrendingUp } from 'lucide-react';

const StatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startCounting();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('stats');
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
      value: 50000,
      label: 'Events Planned',
      icon: <CalendarCheck className="w-8 h-8 text-primary" />,
      suffix: '+',
      description: 'Successfully organized family gatherings',
      gradient: 'from-primary to-primary/80'
    },
    {
      value: 10000,
      label: 'Active Users',
      icon: <Users className="w-8 h-8 text-primary" />,
      suffix: '+',
      description: 'Growing community of families',
      gradient: 'from-primary to-primary/80'
    },
    {
      value: 99,
      label: 'Satisfaction Rate',
      icon: <SmilePlus className="w-8 h-8 text-primary" />,
      suffix: '%',
      description: 'Happy families and successful events',
      gradient: 'from-primary to-primary/80'
    },
    {
      value: 24,
      label: 'Support Hours',
      icon: <Headphones className="w-8 h-8 text-primary" />,
      suffix: '/7',
      description: 'Always here to help you',
      gradient: 'from-primary to-primary/80'
    }
  ];

  const startCounting = () => {
    stats.forEach((stat, index) => {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 steps for smooth animation
      const increment = stat.value / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(current + increment, stat.value);
        setCounts(prev => {
          const newCounts = [...prev];
          newCounts[index] = Math.round(current);
          return newCounts;
        });

        if (step >= steps) {
          clearInterval(timer);
        }
      }, duration / steps);
    });
  };

  return (
    <section id="stats" className="stats section relative py-16 md:py-24 lg:py-32 overflow-hidden">
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
          text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-block mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider transform hover:scale-105 transition-transform group">
            <TrendingUp className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform" />
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Making Family Events{' '}
            <span className="relative inline-block group">
              <span className="relative z-10 text-primary transform transition-transform duration-300 group-hover:scale-110">Better</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 transform -rotate-2 transition-all duration-300 group-hover:h-full group-hover:bottom-0 group-hover:rotate-0"></span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            See how we're helping families create memorable moments together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
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
              <div className={`
                stats-item bg-white rounded-2xl p-8 text-center
                shadow-lg transition-all duration-500 relative
                transform hover:-translate-y-2
                ${hoveredIndex === index ? 'shadow-xl' : ''}
              `}>
                {/* Background Gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${stat.gradient}
                  rounded-2xl opacity-0 transition-opacity duration-300
                  ${hoveredIndex === index ? 'opacity-5' : ''}
                `}></div>

                {/* Icon */}
                <div className={`
                  relative mb-6 mx-auto
                  w-16 h-16 rounded-xl bg-primary/10
                  flex items-center justify-center
                  transform transition-all duration-500
                  ${hoveredIndex === index ? 'rotate-12 scale-110 shadow-lg' : ''}
                `}>
                  <div className={`
                    transform transition-all duration-300
                    ${hoveredIndex === index ? 'scale-110' : ''}
                  `}>
                    {stat.icon}
                  </div>
                </div>

                {/* Counter */}
                <div className={`
                  counter-container mb-4 relative
                  transform transition-all duration-300
                  ${hoveredIndex === index ? 'scale-105' : ''}
                `}>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`
                      text-4xl lg:text-5xl font-bold text-foreground tabular-nums
                      transition-colors duration-300
                      ${hoveredIndex === index ? 'text-primary' : ''}
                    `}>
                      {isVisible ? counts[index].toLocaleString() : '0'}
                    </span>
                    <span className="text-4xl lg:text-5xl font-bold text-primary">
                      {stat.suffix}
                    </span>
                  </div>
                </div>

                {/* Label */}
                <h3 className={`
                  text-lg font-semibold mb-2
                  transition-colors duration-300
                  ${hoveredIndex === index ? 'text-primary' : 'text-foreground'}
                `}>{stat.label}</h3>

                {/* Description */}
                <p className={`
                  text-sm text-muted-foreground max-h-0 overflow-hidden
                  transition-all duration-500 ease-in-out
                  ${hoveredIndex === index ? 'max-h-20 opacity-100 mt-2' : 'opacity-0'}
                `}>
                  {stat.description}
                </p>

                {/* Decorative Line */}
                <div className={`
                  mt-6 h-1 mx-auto rounded-full
                  bg-gradient-to-r ${stat.gradient}
                  transition-all duration-300
                  ${hoveredIndex === index ? 'w-24 opacity-100' : 'w-12 opacity-50'}
                `}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes countUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .counting {
            animation: countUp 1s ease-out forwards;
          }
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

export default StatsSection;
