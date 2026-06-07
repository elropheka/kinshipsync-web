// FAQSection.tsx
import React, { useState, useEffect } from 'react';
import { Mail, ChevronDown } from 'lucide-react';
import { landingFaq, landingSupport } from '@/constants/landingSupportContent';

const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
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

    const section = document.getElementById('faq');
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
    <section id="faq" className="faq section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className={`
        absolute inset-0 bg-gradient-to-b from-background to-card
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className={`
            lg:sticky lg:top-8 lg:h-fit
            transform transition-all duration-700
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <span className="inline-block mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider">
              {landingFaq.badge}
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {landingFaq.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {landingFaq.description}
            </p>

            <div className="group bg-primary/5 border border-border rounded-xl p-6 shadow-lg transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-foreground mb-4">{landingFaq.supportPrompt}</h3>
              <p className="text-muted-foreground mb-6">
                Reach out and we will help you with event planning, guest invites, vendors, or account issues.
              </p>
              <a
                href={`mailto:${landingSupport.email}`}
                className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors group/link"
              >
                <Mail className="w-5 h-5 transform group-hover/link:rotate-12 transition-transform" />
                <span className="font-medium relative">
                  {landingFaq.supportCta}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover/link:w-full transition-all duration-300" />
                </span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {landingFaq.items.map((faq, index) => (
              <div
                key={faq.question}
                className={`
                  relative transform transition-all duration-700
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}
                style={{ transitionDelay: `${100 * (index + 1)}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`
                  bg-card border border-border rounded-xl shadow-lg overflow-hidden
                  transform transition-all duration-300
                  ${activeIndex === index ? 'ring-2 ring-primary/30 shadow-xl' : ''}
                  ${hoveredIndex === index ? 'translate-x-2' : ''}
                `}>
                  <button
                    type="button"
                    className="w-full px-6 py-5 text-left focus:outline-none"
                    onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                    aria-expanded={activeIndex === index}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className={`
                        font-semibold transition-colors duration-300
                        ${activeIndex === index || hoveredIndex === index ? 'text-primary' : 'text-foreground'}
                      `}>
                        {faq.question}
                      </h3>
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                        transform transition-all duration-300
                        ${activeIndex === index ? 'bg-primary/10 rotate-180' : 'bg-muted'}
                        ${hoveredIndex === index ? 'scale-110' : ''}
                      `}>
                        <ChevronDown className={`
                          w-5 h-5 transition-colors duration-300
                          ${activeIndex === index || hoveredIndex === index ? 'text-primary' : 'text-muted-foreground'}
                        `} />
                      </div>
                    </div>
                  </button>

                  <div className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
