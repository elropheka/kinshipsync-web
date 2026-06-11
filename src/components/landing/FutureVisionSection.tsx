import React, { useState, useEffect } from 'react';
import { Eye, Globe, Users, Settings, ShoppingBag } from 'lucide-react';

const FutureVisionSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    const section = document.getElementById('future-vision');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  const pillars = [
    { icon: Globe, text: 'Collaboration tools' },
    { icon: Users, text: 'Family networking features' },
    { icon: ShoppingBag, text: 'Vendor marketplace' },
    { icon: Settings, text: 'Event management capabilities' },
  ];

  return (
    <section id="future-vision" className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-primary text-primary-foreground">
      <div className={`
        absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(74_28%_28%)]
        transition-opacity duration-1000
      `} />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`
            inline-flex items-center mb-6 px-4 py-2 bg-primary-foreground/10 text-accent rounded-full text-sm font-medium border border-primary-foreground/20
            transform transition-all duration-700
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <Eye className="w-4 h-4 mr-2" />
            Future Vision
          </div>

          <h2 className={`
            text-3xl md:text-4xl font-bold mb-6 leading-tight
            transform transition-all duration-700 delay-200
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            Kinship Sync is building the future of collaborative event planning by connecting families, communities, organizers, and vendors in one unified platform.
          </h2>

          <p className={`
            text-lg text-primary-foreground/85 mb-10 max-w-2xl mx-auto
            transform transition-all duration-700 delay-400
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            As we grow, we'll continue expanding our collaboration tools, family networking features, vendor marketplace, and event management capabilities.
          </p>

          <div className={`
            grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto
            transform transition-all duration-700 delay-600
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  className="flex flex-col items-center gap-3 p-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/20">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <span className="text-sm text-primary-foreground/80 font-medium">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureVisionSection;
