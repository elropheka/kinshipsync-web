// ContactSection.tsx
import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { landingSupport } from '@/constants/landingSupportContent';

const ContactSection: React.FC = () => {
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

    const section = document.getElementById('support');
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
    <section id="support" className="contact section relative py-10 md:py-14 lg:py-18 overflow-hidden">
      <div className={`
        absolute inset-0 bg-gradient-to-b from-backgroundSecondary to-background
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `} />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`
          section-header text-center mb-10
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-flex items-center mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider">
            <Mail className="w-5 h-5 mr-2" />
            {landingSupport.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {landingSupport.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {landingSupport.description}
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className={`
            transform transition-all duration-700 delay-200
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className="bg-primary rounded-2xl p-6 lg:p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-8">Contact Us</h3>

              {landingSupport.contacts.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-6 mb-8 last:mb-0 group/item"
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                    {item.link ? (
                      <a href={item.link} className="text-white hover:text-accent transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white">{item.value}</p>
                    )}
                    <p className="text-sm text-white/80 mt-1">{item.subtext}</p>
                  </div>
                </div>
              ))}

              <p className="mt-10 pt-8 border-t border-white/20 text-sm text-white/80">
                {landingSupport.responseTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
