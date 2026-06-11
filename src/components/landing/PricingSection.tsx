import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Sparkles, ArrowRight, Package } from 'lucide-react';
import { pricingPlans, addons } from '@/constants/landingContent';

const PricingSection: React.FC = () => {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    const section = document.getElementById('pricing');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  return (
    <section id="pricing" className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-backgroundSecondary">
      <div className={`
        absolute top-1/4 right-0 w-64 h-64 bg-primary rounded-full
        mix-blend-multiply filter blur-3xl opacity-0 transition-all duration-1000 delay-300
        ${isVisible ? 'opacity-5 animate-blob' : ''}
      `} />
      <div className={`
        absolute bottom-1/4 left-0 w-64 h-64 bg-primary rounded-full
        mix-blend-multiply filter blur-3xl opacity-0 transition-all duration-1000 delay-500
        ${isVisible ? 'opacity-5 animate-blob animation-delay-2000' : ''}
      `} />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`
          text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-flex items-center mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider">
            <Tag className="w-5 h-5 mr-2" />
            <span className="font-display not-italic">Pricing</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const isHovered = hoveredPlan === index;
            const isPro = index === 2;
            return (
              <div
                key={plan.name}
                className={`
                  relative bg-card border border-border rounded-3xl p-8 shadow-lg flex flex-col
                  transform transition-all duration-700
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                  ${isHovered ? 'scale-[1.02] shadow-2xl -translate-y-1' : ''}
                  ${isPro ? 'border-primary border-2' : ''}
                `}
                style={{ transitionDelay: `${200 * index}ms` }}
                onMouseEnter={() => setHoveredPlan(index)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-1.5 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4 mt-2">
                  <Package className="w-6 h-6 text-primary" />
                  <h3 className={`text-xl transition-colors duration-300 font-heading tracking-tight ${isHovered ? 'text-primary' : 'text-foreground'}`}>
                    {plan.name}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-8 flex-grow">{plan.description}</p>

                <Link
                  to="/auth"
                  className={`
                    group relative w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300
                    ${isPro
                      ? 'bg-primary text-primary-foreground hover:bg-primary/80'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'}
                    transform hover:-translate-y-1 hover:shadow-lg
                  `}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className={`
          mt-12 max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-lg
          transform transition-all duration-700 delay-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-accent" />
            <h3 className="text-xl font-semibold text-foreground">Available Add-ons</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {addons.map((addon) => (
              <span key={addon} className="flex items-center gap-2 text-sm text-foreground/80 bg-background rounded-lg px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                {addon}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <Sparkles className="w-4 h-4" />
            Free Trial Available
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </section>
  );
};

export default PricingSection;
