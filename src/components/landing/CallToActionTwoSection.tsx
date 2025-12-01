// CallToActionTwoSection.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, ThumbsUp, Star, ArrowRight } from 'lucide-react';

const CallToActionTwoSection: React.FC = () => {
  const [hoveredBadge, setHoveredBadge] = useState<number | null>(null);
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

    const section = document.getElementById('call-to-action-2');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const badges = [
    { icon: <ShieldCheck className="w-8 h-8" />, text: 'Secure & Private', color: 'from-primary to-primary/80' },
    { icon: <Clock className="w-8 h-8" />, text: '24/7 Support', color: 'from-primary to-primary/80' },
    { icon: <ThumbsUp className="w-8 h-8" />, text: 'Easy to Use', color: 'from-primary to-primary/80' },
    { icon: <Star className="w-8 h-8" />, text: '5-Star Rated', color: 'from-primary to-primary/80' }
  ];

  return (
    <section id="call-to-action-2" className="call-to-action-2 section relative py-20 md:py-28 lg:py-36 bg-gray-900 overflow-hidden">
      {/* Decorative background elements */}
      <div className={`
        absolute inset-0 bg-gradient-to-br from-primary to-primary/80 opacity-0
        transform -skew-y-6 transition-all duration-1000
        ${isVisible ? 'opacity-5' : ''}
      `}></div>
      <div className="absolute inset-0">
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
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center" data-aos="fade-up">
            {/* Badge */}
            <div className={`
              inline-block relative mb-6 group
              transform transition-all duration-700 delay-300
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-full opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <span className="relative px-6 py-3 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider transform hover:scale-105 transition-transform inline-block">
                Get Started Today
              </span>
            </div>
            
            {/* Heading */}
            <h3 className={`
              text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight
              transform transition-all duration-700 delay-500
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Join Our Growing Community
            </h3>
            
            {/* Description */}
            <p className={`
              text-lg md:text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto
              transform transition-all duration-700 delay-700
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              Don't let the stress of event planning take away from the joy of family gatherings. With Kinship Sync, you'll have everything you need to create memorable events that bring your family closer together.
            </p>

            {/* CTA Buttons */}
            <div className={`
              cta-buttons flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6
              transform transition-all duration-700 delay-900
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <Link 
                to="/auth" 
                className="group relative w-full sm:w-auto overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-3 bg-primary text-primaryContrastText px-10 py-4 rounded-xl font-medium transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl text-lg">
                  <span>Start Your Free Trial</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Trust badges */}
            <div className={`
              mt-16 pt-16 border-t border-gray-800
              transform transition-all duration-700 delay-1000
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {badges.map((badge, index) => (
                  <div 
                    key={index}
                    className="text-center group"
                    onMouseEnter={() => setHoveredBadge(index)}
                    onMouseLeave={() => setHoveredBadge(null)}
                  >
                    <div className="relative">
                      <div className={`
                        absolute inset-0 bg-gradient-to-r ${badge.color}
                        rounded-2xl opacity-0 group-hover:opacity-10
                        transition-opacity duration-300
                      `}></div>
                      <div className={`
                        relative w-16 h-16 mx-auto mb-4
                        rounded-2xl bg-gray-800 overflow-hidden
                        flex items-center justify-center
                        transform transition-all duration-500
                        ${hoveredBadge === index ? 'rotate-12 scale-110 shadow-lg' : ''}
                      `}>
                        <div className={`
                          absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0
                          transition-opacity duration-300
                          ${hoveredBadge === index ? 'opacity-10' : ''}
                        `}></div>
                        <div className={`
                          text-primary relative z-10
                          transform transition-all duration-300
                          ${hoveredBadge === index ? 'scale-110' : ''}
                        `}>
                          {badge.icon}
                        </div>
                      </div>
                    </div>
                    <p className={`
                      text-gray-400 text-sm font-medium
                      transform transition-all duration-300
                      ${hoveredBadge === index ? 'text-primary scale-105' : ''}
                    `}>
                      {badge.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

export default CallToActionTwoSection;
