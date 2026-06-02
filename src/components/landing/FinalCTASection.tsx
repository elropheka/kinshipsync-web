import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import { landingFinalCta } from '@/constants/mock/landingPage';

const FinalCTASection: React.FC = () => {
  return (
    <section id="final-cta" className="bg-primary text-white">
      <div className="max-w-container mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-secondary text-white text-sm font-medium">
          <FiClock className="w-4 h-4" />
          <span>{landingFinalCta.badge}</span>
        </div>

        <h2 className="font-display italic text-3xl md:text-4xl lg:text-5xl mb-6 max-w-3xl mx-auto">
          {landingFinalCta.headline}
        </h2>

        <p className="text-white/90 text-base md:text-lg mb-2 max-w-2xl mx-auto">
          {landingFinalCta.body}
        </p>
        <p className="text-secondary font-bold text-base md:text-lg mb-10">
          {landingFinalCta.emphasis}
        </p>

        <Link
          to="/auth"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-secondary text-white font-semibold text-base hover:bg-[#CC742B] transition-colors shadow-lg mb-4"
        >
          {landingFinalCta.cta}
          <FiArrowRight className="w-5 h-5" />
        </Link>

        <p className="text-white/60 text-sm mb-12">{landingFinalCta.microcopy}</p>

        <div className="border-t border-white/20 pt-10">
          <p className="text-base md:text-lg mb-1">
            <span className="text-accent font-bold">{landingFinalCta.socialProofHighlight}</span>{' '}
            {landingFinalCta.socialProofRest}
          </p>
          <p className="text-white/60 text-sm">{landingFinalCta.socialProofSubtext}</p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
