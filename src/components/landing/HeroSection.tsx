import React, { useState, useEffect } from 'react';
import { Sparkles, Download } from 'lucide-react';
import { landingHero } from '@/constants/landingContent';
import { APP_STORE_LINKS } from '@/constants/links';
import familyTableImage from '@/assets/img/family_table.webp';
import tealLogo from '@/assets/branding/teal-logo-only.png';

const getDownloadLink = (): string => {
  if (typeof navigator === 'undefined') return APP_STORE_LINKS.ios;
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return APP_STORE_LINKS.android;
  if (/iPad|iPhone|iPod/i.test(ua)) return APP_STORE_LINKS.ios;
  return APP_STORE_LINKS.ios;
};

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [downloadLink, setDownloadLink] = useState(APP_STORE_LINKS.ios);

  useEffect(() => {
    setIsVisible(true);
    setDownloadLink(getDownloadLink());
  }, []);

  return (
    <section
      id="hero"
      className="hero section relative pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-24 lg:pb-32 overflow-hidden bg-primary text-primary-foreground"
    >
      <div
        className="absolute inset-0 bg-primary opacity-100"
      />
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `url(${tealLogo})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 120px',
        }}
      />

      <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="hero-content">
            <div
              className={`
                inline-flex items-center mb-6 px-4 py-2 bg-primary-foreground/10 text-accent rounded-full text-sm font-medium border border-primary-foreground/20
                transform transition-all duration-700
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Kinship Sync
            </div>

            <h1
              className={`
                mb-6 font-display text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-semibold text-primary-foreground leading-tight
                transform transition-all duration-700 delay-200
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
            >
              {landingHero.headline}
            </h1>

            <p
              className={`
                mb-4 text-lg md:text-xl text-primary-foreground/85 max-w-3xl leading-relaxed
                transform transition-all duration-700 delay-400
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
            >
              {landingHero.description}
            </p>

            <p
              className={`
                mb-8 text-base md:text-lg text-primary-foreground/75 max-w-3xl leading-relaxed
                transform transition-all duration-700 delay-500
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
            >
              {landingHero.subDescription}
            </p>

            <div
              className={`
                flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start
                transform transition-all duration-700 delay-700
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
            >
              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center"
              >
                <span className="absolute inset-0 bg-secondary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-xl inline-flex items-center gap-2 transform transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                  <Download className="w-5 h-5" />
                  Download Now
                </span>
              </a>
            </div>
          </div>

          <div
            className={`
              relative transform transition-all duration-700 delay-500
              ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
            `}
            onMouseEnter={() => setIsImageLoaded(true)}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent opacity-30 rounded-3xl transform rotate-3 transition-all duration-500 group-hover:opacity-40 group-hover:rotate-1" />
              <div className={`absolute -top-6 -right-6 w-40 h-40 bg-secondary rounded-full mix-blend-soft-light filter blur-3xl transition-all duration-500 ${isImageLoaded ? 'opacity-20 scale-110' : 'opacity-10'}`} />
              <div className={`absolute -bottom-6 -left-6 w-40 h-40 bg-accent rounded-full mix-blend-soft-light filter blur-3xl transition-all duration-500 ${isImageLoaded ? 'opacity-20 scale-110' : 'opacity-10'}`} />

              <img
                src={familyTableImage}
                alt="Family gathered around a table"
                className={`
                  relative z-10 w-full rounded-3xl shadow-2xl
                  transform transition-all duration-700
                  ${isImageLoaded ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}
                  group-hover:scale-[1.02] group-hover:shadow-3xl
                `}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </section>
  );
};

export default HeroSection;
