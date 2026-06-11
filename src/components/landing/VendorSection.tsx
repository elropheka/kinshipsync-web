import React, { useState, useEffect } from 'react';
import { Store, Briefcase, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const VendorSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    const section = document.getElementById('vendors');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  const benefits = [
    { icon: Briefcase, text: 'Create business profiles' },
    { icon: Store, text: 'Receive bookings' },
    { icon: Star, text: 'Showcase services' },
    { icon: TrendingUp, text: 'Collect reviews' },
  ];

  return (
    <section id="vendors" className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`
            text-center mb-12
            transform transition-all duration-700
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <span className="inline-flex items-center mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider">
              <Store className="w-5 h-5 mr-2" />
              Vendor Opportunities
            </span>
            <h2 className="text-3xl md:text-4xl text-foreground mb-4 font-heading tracking-tight">
              Grow your business with Kinship Sync.
            </h2>
            <p className="text-lg text-muted-foreground">
              Vendors can:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {benefits.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  className={`
                    flex items-center gap-4 bg-card border border-border rounded-xl p-5 shadow-md
                    transform transition-all duration-700 hover:shadow-lg hover:-translate-y-0.5
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                  `}
                  style={{ transitionDelay: `${150 * index}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{item.text}</span>
                </div>
              );
            })}
          </div>

          <div className={`
            text-center
            transform transition-all duration-700 delay-600
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-muted-foreground mb-6">
              Gain visibility through featured listings and participate in sponsored placements.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/80 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Become a Vendor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorSection;
