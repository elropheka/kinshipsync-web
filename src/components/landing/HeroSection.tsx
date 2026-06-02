// HeroSection.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="hero"
      className="hero section relative pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-24 lg:pb-32 overflow-hidden bg-primary text-primary-foreground"
    >
      <div
        className={`
        absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(74_28%_28%)]
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      />
      <div
        className={`
        absolute top-0 left-1/4 w-96 h-96 bg-secondary rounded-full
        mix-blend-soft-light filter blur-3xl opacity-0
        transition-all duration-1000 delay-300
        ${isVisible ? 'opacity-20 animate-blob' : ''}
      `}
      />
      <div
        className={`
        absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full
        mix-blend-soft-light filter blur-3xl opacity-0
        transition-all duration-1000 delay-500
        ${isVisible ? 'opacity-15 animate-blob animation-delay-2000' : ''}
      `}
      />

      <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          <div className="hero-content text-center lg:text-left">
            <div
              className={`
              inline-flex items-center mb-8 bg-primary-foreground/15 text-primary-foreground
              px-6 py-3 rounded-full font-medium shadow-lg border border-primary-foreground/20
              transform transition-all duration-700 group
              hover:scale-105 hover:shadow-xl hover:-translate-y-1
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
            >
              <Users className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform" />
              <span className="relative tracking-wide">
                Bringing Families Together
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </span>
            </div>

            <h1
              className={`
              mb-8 text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight
              transform transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
            >
              Plan Your Perfect
              <br className="hidden md:block" />
              Family{' '}
              <span className="relative inline-block group">
                <span className="relative z-10 text-accent transform transition-transform duration-300 group-hover:scale-110">
                  Event
                </span>
                <span
                  className={`
                  absolute bottom-2 left-0 w-full h-3 bg-secondary/40 -z-10
                  transform -rotate-2 transition-all duration-300
                  group-hover:h-full group-hover:bottom-0 group-hover:rotate-0
                `}
                />
              </span>
            </h1>

            <p
              className={`
              mb-10 text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto lg:mx-0 leading-relaxed
              transform transition-all duration-700 delay-400
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
            >
              KinshipSync makes event planning simple and collaborative. Create beautiful event
              websites, manage RSVPs, and keep everyone in sync—all in one warm, family-first place.
            </p>

            <div
              className={`
              flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start
              transform transition-all duration-700 delay-600
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
            >
              <Link
                to="/auth"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center"
              >
                <span className="absolute inset-0 bg-secondary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-xl inline-flex items-center transform transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>

              <a
                href="#features"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 text-primary-foreground font-medium hover:text-accent transition-colors"
              >
                <span className="w-12 h-12 rounded-full bg-primary-foreground/15 flex items-center justify-center transform group-hover:scale-110 transition-transform group-hover:shadow-lg border border-primary-foreground/20">
                  <Play className="w-6 h-6 text-accent transform group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="relative">
                  Watch Demo
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}
      </style>
    </section>
  );
};

export default HeroSection;
