import React from 'react';
import { FiClock, FiHeart, FiCalendar } from 'react-icons/fi';
import { landingStats, landingValueProp } from '@/constants/mock/landingPage';

const statIconMap = {
  clock: FiClock,
  heart: FiHeart,
  calendar: FiCalendar,
} as const;

const statColorMap = {
  rust: {
    iconBg: 'bg-[#5D2413]/10',
    icon: 'text-[#5D2413]',
    value: 'text-[#5D2413]',
  },
  orange: {
    iconBg: 'bg-secondary/15',
    icon: 'text-secondary',
    value: 'text-secondary',
  },
  green: {
    iconBg: 'bg-primary/15',
    icon: 'text-primary',
    value: 'text-primary',
  },
} as const;

const StatsSection: React.FC = () => {
  return (
    <section id="stats" className="py-16 md:py-24 bg-[#F5EFE8]">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display italic text-3xl md:text-4xl lg:text-[2.75rem] text-[#5D2413] mb-4">
            {landingStats.headline}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            {landingStats.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 md:mb-16">
          {landingStats.items.map((stat) => {
            const Icon = statIconMap[stat.icon];
            const colors = statColorMap[stat.color];

            return (
              <div
                key={stat.id}
                className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#D6C8AF]/30"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center mx-auto mb-5`}
                >
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <p className={`font-display text-4xl md:text-5xl font-bold ${colors.value} mb-3`}>
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">{stat.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-primary rounded-3xl p-8 md:p-12 lg:p-14 text-white">
          <h3 className="font-display italic text-2xl md:text-3xl lg:text-4xl mb-3">
            {landingValueProp.headline}
          </h3>
          <p className="font-semibold text-base md:text-lg mb-6">{landingValueProp.subheadline}</p>

          {landingValueProp.paragraphs.map((para) => (
            <p key={para.highlight} className="text-white/90 leading-relaxed mb-4 text-base md:text-lg">
              <span className="text-accent font-bold">{para.highlight}</span> {para.text}
            </p>
          ))}

          <blockquote className="mt-8 pl-5 border-l-4 border-accent">
            <p className="font-display italic text-lg md:text-xl text-white/95">
              &ldquo;{landingValueProp.quote}&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
