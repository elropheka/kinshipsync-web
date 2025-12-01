// FeaturesTwoSection.tsx
import React, { useState, useEffect } from 'react';
import { Smartphone, Bell, ShieldCheck, CalendarDays, MessageCircle, BarChart, Grid, GitBranchIcon as Tree } from 'lucide-react';
import PhoneImage from '../../assets/img/phone.png';

const FeaturesTwoSection: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('features-2');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const leftFeatures = [
    {
      icon: <Smartphone className="w-8 h-8 text-primary" />,
      title: 'Cross-Platform Access',
      description: "Access your event plans from any device. Our responsive design ensures a seamless experience whether you're on desktop, tablet, or mobile.",
      color: 'primary',
      delay: 200
    },
    {
      icon: <Bell className="w-8 h-8 text-primary" />,
      title: 'Real-Time Updates',
      description: 'Stay in sync with instant notifications and updates. Everyone involved in the planning process stays informed of changes as they happen.',
      color: 'primary',
      delay: 300
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: 'Secure & Private',
      description: "Your family's information is protected with enterprise-grade security. We never share your data with third parties.",
      color: 'primary',
      delay: 400
    },
    {
      icon: <Tree className="w-8 h-8 text-primary" />,
      title: 'Family Tree',
      description: 'Visualize and manage your family connections easily with our intuitive family tree feature.',
      color: 'primary',
      delay: 500
    }
  ];

  const rightFeatures = [
    {
      icon: <CalendarDays className="w-8 h-8 text-primary" />,
      title: 'Event Scheduling',
      description: 'Create detailed schedules, manage multiple events, and keep track of important dates and deadlines.',
      color: 'primary',
      delay: 200
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: 'Group Communication',
      description: 'Built-in messaging and announcement system to keep all attendees informed and engaged.',
      color: 'primary',
      delay: 300
    },
    {
      icon: <BarChart className="w-8 h-8 text-primary" />,
      title: 'Analytics & Insights',
      description: "Get valuable insights into your event's performance with attendance tracking and engagement metrics.",
      color: 'primary',
      delay: 400
    }
  ];

  return (
    <section id="features-2" className="features-2 section relative py-16 md:py-24 lg:py-32 overflow-hidden">
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
        {/* Section Header */}
        <div className={`
          section-header text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-block mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider transform hover:scale-105 transition-transform group">
            <Grid className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform" />
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Powerful{' '}
            <span className="relative inline-block group">
              <span className="relative z-10 text-primary transform transition-transform duration-300 group-hover:scale-110">Features</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 transform -rotate-2 transition-all duration-300 group-hover:h-full group-hover:bottom-0 group-hover:rotate-0"></span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create memorable family events
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-12 lg:gap-16">
          {/* Left Features */}
          <div className="space-y-12">
            {leftFeatures.map((feature, index) => (
              <div
                key={index}
                className={`
                  relative text-right transform transition-all duration-700 delay-${200 * (index + 1)}
                  ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}
                `}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="flex items-center justify-end gap-6 group">
                  <div className={`
                    max-w-sm transform transition-all duration-300
                    ${hoveredFeature === index ? 'translate-x-2' : ''}
                  `}>
                    <h3 className={`
                      text-xl font-semibold mb-3
                      transition-colors duration-300
                      ${hoveredFeature === index ? 'text-primary' : 'text-foreground'}
                    `}>{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                  <div className={`
                    w-16 h-16 flex-shrink-0 rounded-xl
                    bg-primary/10 flex items-center justify-center
                    transform transition-all duration-500
                    ${hoveredFeature === index ? 'rotate-12 scale-110 shadow-lg' : ''}
                  `}>
                    {feature.icon}
                  </div>
                </div>
                {/* Decorative Line */}
                <div className={`
                  absolute -right-2 top-1/2 w-1 h-16 rounded-full
                  bg-gradient-to-b from-primary to-transparent
                  transform -translate-y-1/2 transition-all duration-300
                  ${hoveredFeature === index ? 'h-24 opacity-100' : 'opacity-50'}
                `}></div>
              </div>
            ))}
          </div>

          {/* Center Phone Image */}
          <div 
            className={`
              relative transform transition-all duration-700 delay-500
              ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
            `}
            onMouseEnter={() => setIsImageLoaded(true)}
          >
            <div className="relative group">
              {/* Decorative Elements */}
              <div className={`
                absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent
                opacity-20 rounded-3xl transform rotate-6 transition-all duration-500
                group-hover:opacity-30 group-hover:rotate-3
              `}></div>
              <div className={`
                absolute -top-8 -right-8 w-32 h-32 bg-primary rounded-full
                mix-blend-multiply filter blur-2xl transition-all duration-500
                ${isImageLoaded ? 'opacity-20 scale-110' : 'opacity-10'}
              `}></div>
              <div className={`
                absolute -bottom-8 -left-8 w-32 h-32 bg-primary rounded-full
                mix-blend-multiply filter blur-2xl transition-all duration-500
                ${isImageLoaded ? 'opacity-20 scale-110' : 'opacity-10'}
              `}></div>
              
              {/* Phone Image */}
              <img 
                src={PhoneImage} 
                alt="Kinship Sync Mobile App"
                className={`
                  relative z-10 w-full max-w-sm mx-auto
                  transform transition-all duration-700
                  ${isImageLoaded ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}
                  group-hover:scale-105 group-hover:rotate-2
                `}
                onLoad={() => setIsImageLoaded(true)}
              />

              {/* Floating Elements */}
              <div className={`
                absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4
                transform transition-all duration-500 delay-300
                ${isImageLoaded ? 'translate-y-0 rotate-6 opacity-100' : 'translate-y-4 rotate-0 opacity-0'}
                group-hover:-translate-y-2 group-hover:rotate-12
              `}>
                {/* <div className="flex items-center gap-3">
                  <StarIcon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">4.9 Rating</span>
                </div> */}
              </div>
              <div className={`
                absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4
                transform transition-all duration-500 delay-500
                ${isImageLoaded ? 'translate-y-0 -rotate-6 opacity-100' : 'translate-y-4 rotate-0 opacity-0'}
                group-hover:translate-y-2 group-hover:-rotate-12
              `}>
                {/* <div className="flex items-center gap-3">
                  <DownloadIcon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">10K+ Downloads</span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Right Features */}
          <div className="space-y-12">
            {rightFeatures.map((feature, index) => (
              <div
                key={index}
                className={`
                  relative transform transition-all duration-700 delay-${200 * (index + 1)}
                  ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
                `}
                onMouseEnter={() => setHoveredFeature(index + leftFeatures.length)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="flex items-center gap-6 group">
                  <div className={`
                    w-16 h-16 flex-shrink-0 rounded-xl
                    bg-primary/10 flex items-center justify-center
                    transform transition-all duration-500
                    ${hoveredFeature === index + leftFeatures.length ? 'rotate-12 scale-110 shadow-lg' : ''}
                  `}>
                    {feature.icon}
                  </div>
                  <div className={`
                    max-w-sm transform transition-all duration-300
                    ${hoveredFeature === index + leftFeatures.length ? '-translate-x-2' : ''}
                  `}>
                    <h3 className={`
                      text-xl font-semibold mb-3
                      transition-colors duration-300
                      ${hoveredFeature === index + leftFeatures.length ? 'text-primary' : 'text-foreground'}
                    `}>{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                {/* Decorative Line */}
                <div className={`
                  absolute -left-2 top-1/2 w-1 h-16 rounded-full
                  bg-gradient-to-b from-primary to-transparent
                  transform -translate-y-1/2 transition-all duration-300
                  ${hoveredFeature === index + leftFeatures.length ? 'h-24 opacity-100' : 'opacity-50'}
                `}></div>
              </div>
            ))}
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

export default FeaturesTwoSection;
