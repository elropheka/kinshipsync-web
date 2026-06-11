import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { perfectFor } from '@/constants/landingContent';

const PerfectForSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    const section = document.getElementById('perfect-for');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  return (
    <section id="perfect-for" className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-backgroundSecondary">
      <div className="container mx-auto px-4 relative z-10">
        <div className={`
          text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
            <span className="inline-flex items-center mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider">
              <Target className="w-5 h-5 mr-2" />
              <span className="font-display not-italic">Perfect For</span>
            </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perfectFor.map((item, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={item.title}
                className={`
                  relative group bg-card border border-border rounded-2xl p-8 shadow-lg
                  transform transition-all duration-700
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}
                style={{ transitionDelay: `${150 * index}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`
                  w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6
                  transform transition-all duration-500
                  ${isHovered ? 'rotate-12 scale-110 shadow-lg' : ''}
                `}>
                  <Target className={`w-7 h-7 text-primary transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                </div>
                <h3 className={`text-xl mb-3 transition-colors duration-300 font-heading tracking-tight ${isHovered ? 'text-primary' : 'text-foreground'}`}>
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PerfectForSection;
