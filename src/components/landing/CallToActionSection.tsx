// CallToActionSection.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarCheck, SmilePlus, Headphones, ArrowRight } from 'lucide-react';

const CallToActionSection: React.FC = () => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<'trial' | 'call' | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('call-to-action');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const stats = [
    { value: '10K+', label: 'Active Users', icon: <Users className="w-6 h-6" /> },
    { value: '50K+', label: 'Events Planned', icon: <CalendarCheck className="w-6 h-6" /> },
    { value: '99%', label: 'Satisfaction Rate', icon: <SmilePlus className="w-6 h-6" /> },
    { value: '24/7', label: 'Support Available', icon: <Headphones className="w-6 h-6" /> }
  ];

  return (
    <section id="call-to-action" className="call-to-action section relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div className={`
        container mx-auto px-4 transform transition-all duration-700
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 shadow-xl">
          {/* Decorative Elements */}
          <div className={`
            absolute top-0 left-0 w-96 h-96 bg-white opacity-0
            rounded-full transform -translate-x-1/2 -translate-y-1/2
            transition-all duration-1000 delay-300
            ${isVisible ? 'opacity-10 animate-blob' : ''}
          `}></div>
          <div className={`
            absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-white opacity-0
            rounded-full transform translate-x-1/2 translate-y-1/2
            transition-all duration-1000 delay-500
            ${isVisible ? 'opacity-10 animate-blob animation-delay-2000' : ''}
          `}></div>
          <div className={`
            absolute top-1/2 left-1/4 w-48 h-48 bg-white opacity-0
            rounded-full transform -translate-y-1/2
            transition-all duration-1000 delay-700
            ${isVisible ? 'opacity-10 animate-blob animation-delay-4000' : ''}
          `}></div>
          
          <div className="content py-16 px-8 md:px-16 lg:px-24 text-center relative z-10">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
              <h2 className={`
                text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight
                transform transition-all duration-700 delay-200
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}>
                Ready to Transform Your Family Event Planning?
              </h2>
              <p className={`
                text-lg md:text-xl text-white opacity-90 mb-12 leading-relaxed
                transform transition-all duration-700 delay-400
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}>
                Join thousands of families who have made their gatherings more organized, collaborative, and enjoyable with Kinship Sync. Start your free trial today and experience the difference.
              </p>
              
              {/* CTA Buttons */}
              <div className={`
                cta-buttons flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6
                transform transition-all duration-700 delay-600
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}>
                <Link 
                  to="/auth" 
                  className="group relative w-full sm:w-auto overflow-hidden"
                  onMouseEnter={() => setHoveredButton('trial')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <div className={`
                    absolute inset-0 bg-gradient-to-r from-background to-primary/10
                    opacity-0 transition-opacity duration-300
                    ${hoveredButton === 'trial' ? 'opacity-10' : ''}
                  `}></div>
                  <div className={`
                    relative flex items-center justify-center gap-3
                    bg-background text-primary font-semibold py-4 px-10 rounded-xl
                    transform transition-all duration-500
                    ${hoveredButton === 'trial' ? '-translate-y-2 shadow-xl scale-105' : ''}
                  `}>
                    <span>Start Free Trial</span>
                    <ArrowRight className={`
                      w-5 h-5
                      transform transition-transform duration-300
                      ${hoveredButton === 'trial' ? 'translate-x-2' : ''}
                    `} />
                  </div>
                </Link>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className={`
              mt-16 pt-12 border-t border-white/20
              transform transition-all duration-700 delay-800
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`
                      text-white text-center group
                      transform transition-all duration-700 delay-${200 * (index + 1)}
                      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                    `}
                    onMouseEnter={() => setHoveredStat(index)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div className={`
                      w-16 h-16 mx-auto mb-4 rounded-xl
                      flex items-center justify-center
                      bg-white/10 backdrop-blur-sm
                      transform transition-all duration-500
                      ${hoveredStat === index ? 'rotate-12 scale-110 shadow-lg bg-white/20' : ''}
                    `}>
                      <div className={`
                        transform transition-transform duration-300
                        ${hoveredStat === index ? 'scale-110' : ''}
                      `}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className={`
                      text-3xl font-bold mb-2
                      transform transition-all duration-300
                      ${hoveredStat === index ? 'scale-110 text-white' : 'text-white/90'}
                    `}>
                      {stat.value}
                    </div>
                    <div className={`
                      text-sm transition-all duration-300
                      ${hoveredStat === index ? 'opacity-100' : 'opacity-80'}
                    `}>
                      {stat.label}
                    </div>
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

export default CallToActionSection;
