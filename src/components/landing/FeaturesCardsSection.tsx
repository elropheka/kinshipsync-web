import React from 'react';
import { FiCalendar, FiUsers, FiMessageCircle, FiBell } from 'react-icons/fi';
import { landingFeatures } from '@/constants/mock/landingPage';

const featureIconMap = {
  calendar: FiCalendar,
  users: FiUsers,
  message: FiMessageCircle,
  bell: FiBell,
} as const;

const featureColorMap = {
  green: 'bg-primary text-white',
  orange: 'bg-secondary text-white',
} as const;

const FeaturesCardsSection: React.FC = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display italic text-3xl md:text-4xl lg:text-[2.75rem] text-[#5D2413] mb-4">
            {landingFeatures.headline}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {landingFeatures.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
          {landingFeatures.items.map((feature) => {
            const Icon = featureIconMap[feature.icon];
            const iconColors = featureColorMap[feature.color];

            return (
              <div key={feature.id} className="flex gap-5 items-start">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-xl ${iconColors} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#5D2413] text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {feature.description}
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

export default FeaturesCardsSection;
