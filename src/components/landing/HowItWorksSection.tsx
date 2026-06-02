import React from 'react';
import { FiEdit3, FiCheck, FiMessageCircle, FiHeart } from 'react-icons/fi';
import { landingHowItWorks } from '@/constants/mock/landingPage';

const stepIconMap = {
  edit: FiEdit3,
  check: FiCheck,
  chat: FiMessageCircle,
  heart: FiHeart,
} as const;

const PhoneMockup: React.FC = () => {
  const { phonePreview } = landingHowItWorks;

  return (
    <div className="relative mx-auto w-[280px] md:w-[300px]">
      <div className="absolute -top-4 -right-4 w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-lg rotate-12 z-20">
        <FiCheck className="w-7 h-7 text-white" />
      </div>

      <div className="relative bg-[#1a1a1a] rounded-[2.5rem] p-3 shadow-2xl">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10" />

        <div className="bg-[#F5EFE8] rounded-[2rem] overflow-hidden min-h-[480px] pt-10 px-4 pb-6">
          <div className="flex items-center justify-between mb-5">
            <h4 className="font-display text-[#5D2413] text-lg font-semibold">
              {phonePreview.eventTitle}
            </h4>
            <div className="w-8 h-8 rounded-full bg-[#D6C8AF]/50" />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-[#5D2413] font-bold text-sm">
                {phonePreview.initials}
              </div>
              <div>
                <p className="font-bold text-[#5D2413] text-sm">{phonePreview.location}</p>
                <p className="text-muted-foreground text-xs">{phonePreview.date}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 py-2 rounded-full bg-primary text-white text-xs font-semibold"
              >
                ✓ Going
              </button>
              <button
                type="button"
                className="flex-1 py-2 rounded-full bg-[#F5EFE8] text-[#5D2413] text-xs font-semibold border border-[#D6C8AF]"
              >
                Maybe
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <p className="text-muted-foreground text-xs mb-3">{phonePreview.confirmedCount}</p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-secondary border-2 border-white" />
                ))}
              </div>
              <span className="text-muted-foreground text-xs">{phonePreview.moreCount}</span>
            </div>
          </div>

          <div className="bg-secondary/15 rounded-xl px-3 py-2 flex items-center gap-2">
            <FiMessageCircle className="w-4 h-4 text-secondary flex-shrink-0" />
            <p className="text-[#5D2413] text-xs truncate">{phonePreview.latestMessage}</p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-6 w-14 h-14 rounded-xl bg-primary flex flex-col items-center justify-center shadow-lg text-white text-xs font-bold leading-tight">
        <span className="text-[10px] text-red-400">JUL</span>
        <span className="text-lg">17</span>
      </div>
    </div>
  );
};

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#F5EFE8]">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display italic text-3xl md:text-4xl lg:text-[2.75rem] text-[#5D2413] mb-4">
            {landingHowItWorks.headline}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {landingHowItWorks.subheadline}
          </p>
        </div>

        <div className="flex justify-center mb-12 md:mb-16">
          <PhoneMockup />
        </div>

        <div className="max-w-2xl mx-auto space-y-8 md:space-y-10">
          {landingHowItWorks.steps.map((step) => {
            const Icon = stepIconMap[step.icon];

            return (
              <div key={step.id} className="flex gap-5 items-start">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-[#F5EFE8] border border-[#D6C8AF]/50 flex items-center justify-center">
                    <span className="text-muted-foreground font-bold text-sm">{step.number}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-md bg-white shadow flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-[#5D2413]" />
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="font-display text-[#5D2413] text-lg md:text-xl font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
