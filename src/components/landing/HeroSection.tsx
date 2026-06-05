import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { landingHero } from '@/constants/content/landingPage';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-end pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${landingHero.backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      <div className="relative z-10 w-full max-w-container mx-auto px-4 md:px-8 pb-16 md:pb-24 pt-32 md:pt-40">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-6 md:mb-8 px-4 py-2 rounded-full bg-secondary text-white text-sm font-medium">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{landingHero.badge}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] text-white mb-6">
            {landingHero.headlineLine1}
            <br />
            <span className="text-secondary italic">{landingHero.headlineLine2}</span>
          </h1>

          <p className="text-base md:text-lg text-white/90 leading-relaxed mb-4 max-w-xl">
            {landingHero.body}
          </p>

          <p className="text-secondary font-semibold text-base md:text-lg mb-8">
            {landingHero.emphasis}
          </p>

          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-secondary text-white font-semibold text-base hover:bg-[#CC742B] transition-colors shadow-lg"
          >
            {landingHero.cta}
            <FiArrowRight className="w-5 h-5" />
          </Link>

          <div className="mt-10 inline-flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-secondary border-2 border-white/30"
                />
              ))}
            </div>
            <div>
              <p className="text-white font-bold text-sm md:text-base">
                {landingHero.socialProofCount}
              </p>
              <p className="text-white/70 text-xs md:text-sm">{landingHero.socialProofSubtext}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
