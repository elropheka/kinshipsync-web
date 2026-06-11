import React, { useState, useEffect } from 'react';
import { ListChecks, Plus } from 'lucide-react';
import { detailedFeatures, additionalFeatures } from '@/constants/landingContent';

const DetailedFeaturesSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    const section = document.getElementById('detailed-features');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  return (
    <section id="detailed-features" className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className={`
          text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-flex items-center mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider">
            <ListChecks className="w-5 h-5 mr-2" />
            Features
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {detailedFeatures.map((feature, index) => (
            <div
              key={feature.category}
              className={`
                bg-card border border-border rounded-2xl p-6 shadow-lg
                transform transition-all duration-700 hover:shadow-xl hover:-translate-y-1
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
              style={{ transitionDelay: `${100 * index}ms` }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.category}</h3>
              <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`
          mt-12 bg-card border border-border rounded-2xl p-8 shadow-lg
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `} style={{ transitionDelay: '1000ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <Plus className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Additional Features</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {additionalFeatures.map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-foreground/80 bg-background rounded-lg px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedFeaturesSection;
