// FeaturesTwoSection.tsx
import React, { useState, useEffect } from 'react';
import { Grid } from 'lucide-react';
import PhoneImage from '../../assets/img/phone.png';
import { landingFeatures } from '@/constants/landingContent';

interface FeatureItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  align: 'left' | 'right';
  index: number;
  globalIndex: number;
  isVisible: boolean;
  hoveredFeature: number | null;
  onHover: (index: number | null) => void;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  title,
  description,
  icon,
  align,
  index,
  globalIndex,
  isVisible,
  hoveredFeature,
  onHover,
}) => {
  const isHovered = hoveredFeature === globalIndex;
  const isRight = align === 'right';

  return (
    <div
      className={`
        relative transform transition-all duration-700
        ${isVisible ? 'translate-x-0 opacity-100' : isRight ? 'translate-x-4 opacity-0' : '-translate-x-4 opacity-0'}
      `}
      style={{ transitionDelay: `${200 * (index + 1)}ms` }}
      onMouseEnter={() => onHover(globalIndex)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={`flex items-center gap-6 group ${isRight ? '' : 'justify-end'}`}>
        {!isRight && (
          <div className={`
            max-w-sm text-right transform transition-all duration-300
            ${isHovered ? 'translate-x-2' : ''}
          `}>
            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-foreground'}`}>
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          </div>
        )}

        <div className={`
          w-16 h-16 flex-shrink-0 rounded-xl bg-primary/10 flex items-center justify-center
          transform transition-all duration-500
          ${isHovered ? 'rotate-12 scale-110 shadow-lg' : ''}
        `}>
          {icon}
        </div>

        {isRight && (
          <div className={`
            max-w-sm transform transition-all duration-300
            ${isHovered ? '-translate-x-2' : ''}
          `}>
            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-foreground'}`}>
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          </div>
        )}
      </div>

      <div className={`
        absolute top-1/2 w-1 h-16 rounded-full bg-gradient-to-b from-primary to-transparent
        transform -translate-y-1/2 transition-all duration-300
        ${isRight ? '-left-2' : '-right-2'}
        ${isHovered ? 'h-24 opacity-100' : 'opacity-50'}
      `} />
    </div>
  );
};

const FeaturesTwoSection: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const leftFeatures = landingFeatures.items.slice(0, 3);
  const rightFeatures = landingFeatures.items.slice(3);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('features');
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
    <section id="features" className="features section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className={`
        absolute inset-0 bg-gradient-to-b from-backgroundSecondary to-background
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `} />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`
          section-header text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-flex items-center mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider">
            <Grid className="w-5 h-5 mr-2" />
            Features
          </span>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {landingFeatures.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-12 lg:gap-10">
          <div className="space-y-10 order-2 lg:order-1">
            {leftFeatures.map((feature, index) => (
              <FeatureItem
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={<feature.icon className="w-8 h-8 text-primary" />}
                align="left"
                index={index}
                globalIndex={index}
                isVisible={isVisible}
                hoveredFeature={hoveredFeature}
                onHover={setHoveredFeature}
              />
            ))}
          </div>

          <div
            className={`
              relative order-1 lg:order-2 transform transition-all duration-700 delay-500
              ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
            `}
            onMouseEnter={() => setIsImageLoaded(true)}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-20 rounded-3xl transform rotate-6 transition-all duration-500 group-hover:opacity-30 group-hover:rotate-3" />
              <div className={`absolute -top-8 -right-8 w-32 h-32 bg-primary rounded-full mix-blend-multiply filter blur-2xl transition-all duration-500 ${isImageLoaded ? 'opacity-20 scale-110' : 'opacity-10'}`} />
              <div className={`absolute -bottom-8 -left-8 w-32 h-32 bg-primary rounded-full mix-blend-multiply filter blur-2xl transition-all duration-500 ${isImageLoaded ? 'opacity-20 scale-110' : 'opacity-10'}`} />

              <img
                src={PhoneImage}
                alt="Kinship Sync mobile app"
                className={`
                  relative z-10 w-full max-w-sm mx-auto
                  transform transition-all duration-700
                  ${isImageLoaded ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}
                  group-hover:scale-105 group-hover:rotate-2
                `}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
          </div>

          <div className="space-y-10 order-3">
            {rightFeatures.map((feature, index) => (
              <FeatureItem
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={<feature.icon className="w-8 h-8 text-primary" />}
                align="right"
                index={index}
                globalIndex={index + leftFeatures.length}
                isVisible={isVisible}
                hoveredFeature={hoveredFeature}
                onHover={setHoveredFeature}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesTwoSection;
