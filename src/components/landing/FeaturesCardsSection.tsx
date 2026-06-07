// FeaturesCardsSection.tsx
import React, { useState, useEffect } from 'react';
import { Grid } from 'lucide-react';
import { landingFeatures } from '@/constants/landingContent';

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

  return (
    <section id="features" className="features-cards section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className={`
        absolute inset-0 bg-gradient-to-b from-backgroundSecondary to-background
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `} />

      <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        <div className={`
          section-header text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-block mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider">
            <Grid className="inline-block w-5 h-5 mr-2 text-primary" />
            Features
          </span>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {landingFeatures.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {landingFeatures.items.map((feature, index) => (
            <div
              key={feature.title}
              className={`
                transform transition-all duration-700
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
              style={{ transitionDelay: `${150 * (index + 1)}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`
                relative overflow-hidden rounded-2xl p-6 h-full
                bg-card border border-border shadow-md
                transform transition-all duration-300
                flex items-center gap-4
                ${hoveredIndex === index ? '-translate-y-1 shadow-lg border-primary/20' : ''}
              `}>
                <div className={`
                  flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10
                  flex items-center justify-center
                  transform transition-all duration-300
                  ${hoveredIndex === index ? 'scale-110 bg-primary/15' : ''}
                `}>
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className={`
                  text-lg font-semibold text-foreground
                  transition-colors duration-300
                  ${hoveredIndex === index ? 'text-primary' : ''}
                `}>
                  {feature.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesCardsSection;
