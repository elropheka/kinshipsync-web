import React, { useState, useEffect } from 'react';
import { landingTestimonials } from '@/constants/content/landingPage';

const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { items } = landingTestimonials;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length]);

  const active = items[activeIndex];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-background">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <h2 className="font-display italic text-3xl md:text-4xl lg:text-[2.75rem] text-foreground text-center mb-12 md:mb-16">
          {landingTestimonials.headline}
        </h2>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-md border border-border/30 relative">
            <span className="font-display text-6xl md:text-7xl text-secondary/40 leading-none absolute top-6 left-8 md:left-10">
              &ldquo;
            </span>

            <blockquote className="font-display italic text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed pt-8 mb-8">
              &ldquo;{active.quote}&rdquo;
            </blockquote>

            <div className="border-t border-border/40 pt-6">
              <p className="font-bold text-foreground text-base">{active.name}</p>
              <p className="text-muted-foreground text-sm">{active.role}</p>
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 mt-8">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View testimonial ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? 'w-8 bg-primary'
                    : 'w-2.5 bg-border hover:bg-muted/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
