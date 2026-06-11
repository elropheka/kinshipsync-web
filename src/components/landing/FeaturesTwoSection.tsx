import React, { useState, useEffect } from 'react';
import { Globe, Users, ClipboardCheck, Calendar, MessageSquare } from 'lucide-react';
import { whyChooseFeatures } from '@/constants/landingContent';

const iconMap = [Globe, Users, ClipboardCheck, Calendar, MessageSquare];

const WhyChooseSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    const section = document.getElementById('features');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  return (
    <section id="features" className="features section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className={`
        absolute inset-0 bg-gradient-to-b from-backgroundSecondary to-background
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `} />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`
          text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-flex items-center mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider">
            <Globe className="w-5 h-5 mr-2" />
            Why Choose Kinship Sync
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseFeatures.map((feature, index) => {
            const Icon = iconMap[index];
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={feature.title}
                className={`
                  relative group transform transition-all duration-700
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}
                style={{ transitionDelay: `${200 * index}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`
                  relative h-full bg-card rounded-2xl p-8 border border-border
                  transform transition-all duration-500
                  ${isHovered ? 'scale-[1.02] shadow-2xl -translate-y-1' : 'shadow-lg'}
                `}>
                  <div className={`
                    w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6
                    transform transition-all duration-500
                    ${isHovered ? 'rotate-12 scale-110 shadow-lg' : ''}
                  `}>
                    <Icon className={`w-7 h-7 text-primary transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-foreground'}`}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  <div className={`
                    absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-b-2xl
                    transform scale-x-0 transition-transform duration-500 origin-left
                    ${isHovered ? 'scale-x-100' : ''}
                  `} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
