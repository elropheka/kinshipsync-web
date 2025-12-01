// AboutSection.tsx
import React, { useState, useEffect } from 'react';
import { Heart, Globe, Users, ShieldCheck, Smartphone, RotateCw } from 'lucide-react';
// import briaDemetrius from '../../assets/img/Bria-Demetrius.jpg';
// import about5 from '../../assets/img/about-5.webp';
// import about2 from '../../assets/img/about-2.webp';

const AboutSection: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  // const [isImageHovered, setIsImageHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('about');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const features = [
    { icon: <Heart className="w-6 h-6" />, text: 'Family-first approach', color: 'primary' },
    { icon: <Globe className="w-6 h-6" />, text: 'Cultural sensitivity', color: 'primary' },
    { icon: <Users className="w-6 h-6" />, text: 'Community focus', color: 'primary' },
    { icon: <ShieldCheck className="w-6 h-6" />, text: 'Privacy protection', color: 'primary' },
    { icon: <Smartphone className="w-6 h-6" />, text: 'User-friendly design', color: 'primary' },
    { icon: <RotateCw className="w-6 h-6" />, text: 'Continuous innovation', color: 'primary' }
  ];

  return (
    <section id="about" className="about section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className={`
        absolute inset-0 bg-gradient-to-b from-background to-backgroundSecondary
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="about-content">
            {/* Badge */}
            <div className={`
              inline-flex items-center mb-8 bg-primary/10 text-primary
              px-6 py-3 rounded-full font-medium shadow-lg group
              transform transition-all duration-700
              hover:scale-105 hover:shadow-xl hover:-translate-y-1
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <Heart className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform" fill="currentColor" />
              <span className="relative">
                OUR MISSION
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>
            </div>

            {/* Title */}
            <h2 className={`
              text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight
              transform transition-all duration-700 delay-200
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Bringing Families Together Through{' '}
              <span className="relative inline-block group">
                <span className="relative z-10 text-primary transform transition-transform duration-300 group-hover:scale-110">Technology</span>
                <span className={`
                  absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10
                  transform -rotate-2 transition-all duration-300
                  group-hover:h-full group-hover:bottom-0 group-hover:rotate-0
                `}></span>
              </span>
            </h2>

            {/* Description */}
            <p className={`
              text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl
              transform transition-all duration-700 delay-400
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Kinship Sync was born from the need to simplify family event planning while maintaining the warmth and connection that makes family gatherings special. We understand the unique challenges of organizing family events and have created a platform that makes it easier, more collaborative, and more enjoyable.
            </p>

            {/* Features Grid */}
            <div className={`
              grid grid-cols-1 md:grid-cols-2 gap-8 mb-12
              transform transition-all duration-700 delay-600
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="feature-item group relative"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={`
                    absolute inset-0 bg-gradient-to-r from-[#DDFBF4] to-transparent
                    rounded-xl opacity-0 transition-opacity duration-300
                    ${hoveredFeature === index ? 'opacity-50' : ''}
                  `}></div>
                  <div className="relative flex items-center gap-4 p-4 rounded-xl transform transition-all duration-300 hover:translate-x-2">
                    <div className={`
                      flex-shrink-0 w-12 h-12 rounded-xl bg-[#DDFBF4]
                      flex items-center justify-center
                      transform transition-all duration-500
                      ${hoveredFeature === index ? 'rotate-12 scale-110 shadow-lg' : ''}
                    `}>
                      <div className={`
                        text-${feature.color}
                        transform transition-all duration-300
                        ${hoveredFeature === index ? 'scale-110' : ''}
                      `}>
                        {feature.icon}
                      </div>
                    </div>
                    <span className={`
                      text-gray-700 font-medium
                      transition-colors duration-300
                      ${hoveredFeature === index ? 'text-[#2ECDB0]' : ''}
                    `}>{feature.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Founder Info Card */}
            {/* <div className={`
              bg-white rounded-2xl shadow-lg p-8 group
              transform transition-all duration-700 delay-800
              hover:shadow-xl hover:-translate-y-1
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                {/* Profile 
                <div className="flex items-center gap-6">
                  <div className="relative group/image">
                    <div className="absolute inset-0 bg-[#DDFBF4] rounded-full transform -rotate-6 group-hover/image:rotate-12 transition-transform"></div>
                    <img 
                      src={briaDemetrius} 
                      alt="Bria Demetrius" 
                      className="w-20 h-20 rounded-full object-cover relative z-10 border-4 border-white transform group-hover/image:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-[#2ECDB0] transition-colors">Bria Demetrius</h4>
                    <p className="text-gray-500">Founder & CEO</p>
                  </div>
                </div>

                {/* Contact 
                <div className="group/contact relative overflow-hidden w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2ECDB0] to-[#1AB89C] opacity-0 group-hover/contact:opacity-5 transition-opacity rounded-2xl"></div>
                  <div className="bg-white rounded-2xl p-5 sm:p-6 flex items-center gap-4 relative shadow-sm hover:shadow-xl transform transition-all duration-300 group-hover/contact:-translate-y-1 border border-gray-100 hover:border-[#DDFBF4] w-full">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#DDFBF4] flex items-center justify-center transform group-hover/contact:rotate-12 transition-transform shadow-sm group-hover/contact:shadow-md flex-shrink-0">
                      <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-[#2ECDB0] group-hover/contact:scale-110 transition-transform" />
                    </div>
                    <div className="flex-grow min-w-0 py-0.5">
                      <p className="text-sm font-medium text-[#2ECDB0] mb-1 group-hover/contact:translate-x-1 transform transition-transform truncate">Email us anytime</p>
                      <a 
                        href="mailto:support@kinshipsync.com" 
                        className="text-gray-800 font-semibold hover:text-[#2ECDB0] transition-all hover:underline block group-hover/contact:translate-x-1 transform truncate"
                      >
                        support@kinshipsync.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div> 

          {/* Images */}
          {/* <div className={`
            about-images relative
            transform transition-all duration-700 delay-1000
            ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
          `}>
            <div 
              className="relative"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              {/* Main Image 
              <div className={`
                relative z-10 rounded-2xl overflow-hidden shadow-2xl
                transform transition-all duration-500 group
                ${isImageHovered ? 'scale-[1.02]' : ''}
              `}>
                <div className={`
                  absolute inset-0 bg-gradient-to-tr from-[#DDFBF4] to-transparent
                  transition-opacity duration-300
                  ${isImageHovered ? 'opacity-30' : 'opacity-20'}
                `}></div>
                <img 
                  src={about5} 
                  alt="Family Gathering" 
                  className="w-full h-auto transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Secondary Image 
              <div className={`
                absolute -bottom-8 -right-8 w-2/3 z-20
                transform transition-all duration-500
                ${isImageHovered ? 'translate-x-2 translate-y-2' : ''}
              `}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <div className={`
                    absolute inset-0 bg-gradient-to-tr from-[#DDFBF4] to-transparent
                    transition-opacity duration-300
                    ${isImageHovered ? 'opacity-30' : 'opacity-20'}
                  `}></div>
                  <img 
                    src={about2} 
                    alt="Event Planning" 
                    className="w-full h-auto border-4 border-white transform transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Stats Badge 
              {/* <div className={`
                absolute -top-8 -left-8 bg-white rounded-2xl shadow-xl p-6 z-30
                transform transition-all duration-500 group
                ${isImageHovered ? 'scale-110 -translate-y-2 rotate-3' : ''}
              `}>
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-[#2ECDB0] transform transition-transform duration-300 group-hover:scale-110">10K+</span>
                    <span className="text-gray-800 font-medium">Events</span>
                  </div>
                  <p className="text-gray-600 text-sm">Successfully planned</p>
                </div>
              </div> 
            </div>
          </div> */}
        </div>
      </div>

      {/* Animation Styles */}
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
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
      </style>
    </section>
  );
};

export default AboutSection;
