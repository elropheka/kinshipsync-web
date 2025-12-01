// HeroSection.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users,  ArrowRight, Play } from 'lucide-react';
// import featuresIllustration from '../../assets/img/features-illustration-1.webp';

const HeroSection: React.FC = () => {
  // const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  // const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // const stats = [
  //   { value: '10K+', label: 'Active Users', icon: <Users className="w-6 h-6 text-primary" /> },
//   { value: '50K+', label: 'Events Planned', icon: <CalendarCheck className="w-6 h-6 text-primary" /> },
//   { value: '99%', label: 'Satisfaction', icon: <SmilePlus className="w-6 h-6 text-primary" /> }
  // ];

  return (
    <section id="hero" className="hero section relative pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-24 lg:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className={`
        absolute inset-0 bg-gradient-to-b from-backgroundSecondary to-background
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}></div>
      <div className={`
        absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-300
        ${isVisible ? 'opacity-5 animate-blob' : ''}
      `}></div>
      <div className={`
        absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-500
        ${isVisible ? 'opacity-5 animate-blob animation-delay-2000' : ''}
      `}></div>
      <div className={`
        absolute top-1/2 left-1/2 w-64 h-64 bg-primary rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-700
        ${isVisible ? 'opacity-5 animate-blob animation-delay-4000' : ''}
      `}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          {/* Content */}
          <div className="hero-content text-center lg:text-left">
            {/* Badge */}
            <div className={`
              inline-flex items-center mb-8 bg-primary/10 text-primary
              px-6 py-3 rounded-full font-medium shadow-lg
              transform transition-all duration-700 group
              hover:scale-105 hover:shadow-xl hover:-translate-y-1
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <Users className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform" />
              <span className="relative">
                Bringing Families Together
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>
            </div>

            {/* Heading */}
            <h1 className={`
              mb-8 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight
              transform transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Plan Your Perfect
              <br className="hidden md:block" />
              Family{' '}
              <span className="relative inline-block group">
                <span className="relative z-10 text-primary transform transition-transform duration-300 group-hover:scale-110">Event</span>
                <span className={`
                  absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10
                  transform -rotate-2 transition-all duration-300
                  group-hover:h-full group-hover:bottom-0 group-hover:rotate-0
                `}></span>
              </span>
            </h1>

            {/* Description */}
            <p className={`
              mb-10 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed
              transform transition-all duration-700 delay-400
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Kinship Sync makes event planning simple and collaborative. Create beautiful event websites, manage RSVPs, and keep everyone in sync—all in one place.
            </p>

            {/* CTA Buttons */}
            <div className={`
              flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start
              transform transition-all duration-700 delay-600
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <Link 
                to="/auth" 
                className="group relative w-full sm:w-auto inline-flex items-center justify-center"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative px-8 py-4 bg-primary text-primaryContrastText font-medium rounded-xl inline-flex items-center transform transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>

              <a 
                href="#features" 
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 text-primary font-medium hover:text-primary/80 transition-colors"
              >
                <span className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center transform group-hover:scale-110 transition-transform group-hover:shadow-lg">
                  <Play className="w-6 h-6 text-primary transform group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="relative">
                  Watch Demo
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
              </a>
            </div>

            {/* Trust Indicators
            <div className={`
              mt-12 pt-12 border-t border-gray-100
              transform transition-all duration-700 delay-800
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="text-center group"
                    onMouseEnter={() => setHoveredStat(index)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div className={`
                      w-12 h-12 mx-auto mb-3 rounded-xl
                      bg-primary/10 flex items-center justify-center
                      transform transition-all duration-300
                      ${hoveredStat === index ? 'rotate-12 scale-110 shadow-lg' : ''}
                    `}>
                      <div className={`
                        transform transition-all duration-300
                        ${hoveredStat === index ? 'scale-110' : ''}
                      `}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className={`
                      text-2xl font-bold text-gray-800 mb-1
                      transform transition-all duration-300
                      ${hoveredStat === index ? 'text-primary scale-105' : ''}
                    `}>
                      {stat.value}
                    </div>
                    <div className={`
                      text-sm text-gray-500
                      transition-colors duration-300
                      ${hoveredStat === index ? 'text-gray-800' : ''}
                    `}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div> 

          {/* Image */}
          {/* <div className={`
            hero-image relative
            transform transition-all duration-700 delay-1000
            ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
          `}>
            <div className="relative group">
              {/* Background Glow *
              <div className={`
                absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/10 rounded-2xl
                blur opacity-30 transition-all duration-1000
                group-hover:opacity-40 group-hover:blur-md animate-tilt
              `}></div>
              
              {/* Main Image 
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-20 rounded-2xl"></div>
                <img
                  src={featuresIllustration}
                  alt="Kinship Sync App Interface"
                  className={`
                    w-full h-auto rounded-2xl shadow-2xl
                    transform transition-all duration-700
                    ${isImageLoaded ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}
                    group-hover:scale-[1.02] group-hover:shadow-3xl
                  `}
                  onLoad={() => setIsImageLoaded(true)}
                />
              </div>

              {/* Floating Elements 
              <div className={`
                absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4
                transform -rotate-6 transition-all duration-300
                group-hover:rotate-0 group-hover:-translate-y-2 group-hover:shadow-xl
              `}>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary transform group-hover:rotate-12 transition-transform" />
                  <span className="text-sm font-medium">Easy Planning</span>
                </div>
              </div>
              <div className={`
                absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4
                transform rotate-6 transition-all duration-300
                group-hover:rotate-0 group-hover:translate-y-2 group-hover:shadow-xl
              `}>
                <div className="flex items-center gap-3">
                  <UsersRound className="w-5 h-5 text-primary transform group-hover:rotate-12 transition-transform" />
                  <span className="text-sm font-medium">Family First</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes tilt {
            0%, 50%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(0.5deg); }
            75% { transform: rotate(-0.5deg); }
          }
          .animate-tilt {
            animation: tilt 10s infinite linear;
          }
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
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
      </style>
    </section>
  );
};

export default HeroSection;
