import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { landingAbout } from '@/constants/landingContent';

const AboutSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    const section = document.getElementById('about');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  return (
    <section id="about" className="about section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className={`
        absolute inset-0 bg-gradient-to-b from-background to-backgroundSecondary
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `} />
      <div className={`
        absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full
        mix-blend-multiply filter blur-3xl opacity-0 transition-all duration-1000 delay-300
        ${isVisible ? 'opacity-5 animate-blob' : ''}
      `} />
      <div className={`
        absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full
        mix-blend-multiply filter blur-3xl opacity-0 transition-all duration-1000 delay-500
        ${isVisible ? 'opacity-5 animate-blob animation-delay-2000' : ''}
      `} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`
            inline-flex items-center mb-8 bg-primary/10 text-primary
            px-6 py-3 rounded-full font-medium shadow-lg
            transform transition-all duration-700
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <Info className="w-5 h-5 mr-2" />
            <span className="font-display">About Kinship Sync</span>
          </div>

          <p className={`
            text-lg md:text-xl text-foreground mb-6 leading-relaxed font-display
            transform transition-all duration-700 delay-200
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            {landingAbout.title}
          </p>

          <p className={`
            text-base md:text-lg text-muted-foreground mb-6 leading-relaxed
            transform transition-all duration-700 delay-400
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            {landingAbout.description}
          </p>

          <p className={`
            text-base md:text-lg text-primary font-medium leading-relaxed
            transform transition-all duration-700 delay-600
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            {landingAbout.closing}
          </p>
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

export default AboutSection;
