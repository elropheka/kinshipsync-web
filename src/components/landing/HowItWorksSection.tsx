import React, { useState, useEffect } from 'react';
import { ArrowRight, Lightbulb, Users, Puzzle, PartyPopper } from 'lucide-react';
import { howItWorks } from '@/constants/landingContent';

const stepIcons = [Lightbulb, Users, Puzzle, PartyPopper];

const HowItWorksSection: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    const section = document.getElementById('how-it-works');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  return (
    <section id="how-it-works" className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className={`
          text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-flex items-center mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider">
            <Lightbulb className="w-5 h-5 mr-2" />
            <span className="font-display not-italic">How It Works</span>
          </span>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = stepIcons[index];
              const isHovered = hoveredStep === index;
              return (
                <div
                  key={step.step}
                  className={`
                    relative flex flex-col items-center text-center
                    transform transition-all duration-700
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                  `}
                  style={{ transitionDelay: `${200 * index}ms` }}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <div className={`
                    relative w-20 h-20 rounded-full bg-card border-2 border-border
                    flex items-center justify-center mb-6 shadow-lg
                    transform transition-all duration-500
                    ${isHovered ? 'scale-110 border-primary shadow-xl' : ''}
                  `}>
                    <Icon className={`w-8 h-8 text-primary transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                    <div className={`
                      absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground
                      flex items-center justify-center text-sm font-bold shadow-md
                      transform transition-all duration-300
                      ${isHovered ? 'scale-110' : ''}
                    `}>
                      {step.step}
                    </div>
                  </div>
                  <h3 className={`text-lg mb-2 transition-colors duration-300 font-heading tracking-tight ${isHovered ? 'text-primary' : 'text-foreground'}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">{step.description}</p>
                  {index < howItWorks.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute -right-4 top-10 w-8 h-8 text-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
