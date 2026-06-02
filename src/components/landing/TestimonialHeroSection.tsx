import React from 'react';
import { landingTestimonialHero } from '@/constants/mock/landingPage';

const TestimonialHeroSection: React.FC = () => {
  return (
    <section className="py-8 md:py-12 bg-[#F5EFE8]">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-lg min-h-[320px] md:min-h-[400px]">
          <img
            src={landingTestimonialHero.image}
            alt="Happy family gathering"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="relative z-10 flex flex-col justify-end h-full min-h-[320px] md:min-h-[400px] p-8 md:p-12">
            <blockquote className="font-display italic text-xl md:text-2xl lg:text-3xl text-white leading-snug max-w-3xl mb-4">
              &ldquo;{landingTestimonialHero.quote}&rdquo;
            </blockquote>
            <p className="text-white/80 text-sm md:text-base">{landingTestimonialHero.attribution}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialHeroSection;
