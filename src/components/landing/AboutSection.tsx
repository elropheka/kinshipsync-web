import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, Heart } from 'lucide-react';

const AboutSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    const section = document.getElementById('about-ks');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  return (
    <section id="about-ks" className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-backgroundSecondary">
      <div className={`
        absolute inset-0 bg-gradient-to-b from-backgroundSecondary to-background
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
            text-center mb-12
            transform transition-all duration-700
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <span className="inline-flex items-center mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider">
              <Sparkles className="w-5 h-5 mr-2" />
              How It Works
            </span>
          </div>

          <div className={`
            transform transition-all duration-700 delay-200
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-lg md:text-xl text-foreground mb-8 leading-relaxed text-center">
              Kinship Sync is a family-first planning platform built to bring people together without the stress.
            </p>
          </div>

          <div className={`
            mb-10
            transform transition-all duration-700 delay-300
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-muted-foreground font-medium mb-4 text-center">It&apos;s for:</p>
            <ul className="space-y-3 max-w-xl mx-auto">
              {[
                'The cousin who always starts the group chat',
                'The auntie who keeps everyone on track',
                'The family that refuses to lose touch, no matter the distance',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`
            mb-10
            transform transition-all duration-700 delay-400
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-foreground mb-6 leading-relaxed text-center">
              Kinship Sync brings everything into one simple, shared space so planning feels easy again.
            </p>
            <p className="text-muted-foreground font-medium mb-4 text-center">With Kinship Sync, you can:</p>
            <ul className="space-y-3 max-w-xl mx-auto">
              {[
                'Coordinate schedules without the back-and-forth',
                'Collect RSVPs in seconds',
                'Share updates everyone actually sees',
                'Keep traditions alive across cities and generations',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`
            mb-10
            transform transition-all duration-700 delay-500
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-foreground font-medium mb-4 text-center">
              Because this isn&apos;t just about planning events.
            </p>
            <p className="text-muted-foreground font-medium mb-4 text-center">It&apos;s about:</p>
            <ul className="space-y-3 max-w-xl mx-auto">
              {[
                'Staying connected',
                'Showing up for each other',
                'Creating moments that turn into memories',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`
            text-center mb-8
            transform transition-all duration-700 delay-600
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <p className="text-lg text-foreground font-display leading-relaxed max-w-2xl mx-auto">
              Kinship Sync helps families do what they&apos;ve always done best&mdash;be together.
            </p>
          </div>

          <div className={`
            text-center
            transform transition-all duration-700 delay-700
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <Link
              to="/auth"
              className="group inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/80 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              Download the App &amp; Start Planning
              <Sparkles className="w-5 h-5 ml-2 transform group-hover:scale-110 transition-transform" />
            </Link>
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

export default AboutSection;
