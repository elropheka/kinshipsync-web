// AppInstallSection.tsx
import React, { useState, useEffect } from 'react';
import { Star, Download, Globe, Smartphone, CloudDownload } from 'lucide-react';
import appImage from '../../assets/img/app.png';
import appStore from '../../assets/img/App_Store_(iOS).svg.webp';
import playStore from '../../assets/img/playstore.svg';

const AppInstallSection: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [hoveredPlatform, setHoveredPlatform] = useState<number | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (isImageLoaded) {
      // Animate download count
      const targetDownloads = 10000;
      const duration = 2000;
      const steps = 60;
      const increment = targetDownloads / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(current + increment, targetDownloads);
        setDownloadCount(Math.round(current));

        if (step >= steps) {
          clearInterval(timer);
        }
      }, duration / steps);

      // Animate rating
      const targetRating = 4.9;
      const ratingIncrement = targetRating / steps;
      let currentRating = 0;

      const ratingTimer = setInterval(() => {
        currentRating = Math.min(currentRating + ratingIncrement, targetRating);
        setRating(Number(currentRating.toFixed(1)));

        if (currentRating >= targetRating) {
          clearInterval(ratingTimer);
        }
      }, duration / steps);
    }
  }, [isImageLoaded]);

  const platforms = [
    {
      icon: appStore,
      store: "App Store",
      text: "Download on the",
      color: "blue",
      link: "#"
    },
    {
      icon: playStore,
      store: "Google Play",
      text: "Get it on",
      color: "green",
      link: "#"
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      store: "Web App",
      text: "Install as",
      color: "purple",
      link: "#"
    }
  ];

  const features = [
    {
      icon: <Smartphone className="w-6 h-6 text-primary" />,
      title: "Native Apps",
      description: "Optimized performance on iOS and Android devices",
      color: "indigo"
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Web Access",
      description: "Use from any browser with full PWA support",
      color: "teal"
    },
    {
      icon: <CloudDownload className="w-6 h-6 text-primary" />,
      title: "Offline Mode",
      description: "Keep planning even without internet connection",
      color: "rose"
    }
  ];

  return (
    <section id="app-install" className="app-install section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-backgroundSecondary"></div>
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="section-header text-center mb-16" data-aos="fade-up">
          <span className="inline-block mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider transform hover:scale-105 transition-transform">
            Mobile App
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Install Our App
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Get Kinship Sync on your favorite devices and stay connected with your family events
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="max-w-5xl w-full">
            {/* App Preview */}
            <div 
              className="app-device-mockup mb-16 relative" 
              data-aos="zoom-in"
              onMouseEnter={() => setIsImageLoaded(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-20 rounded-3xl transform rotate-2"></div>
              <div className="relative group">
                {/* Decorative Elements */}
                <div className={`
                  absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-full
                  mix-blend-multiply filter blur-2xl transition-all duration-500
                  ${isImageLoaded ? 'opacity-20 scale-110' : 'opacity-10'}
                `}></div>
                <div className={`
                  absolute -bottom-8 -left-8 w-32 h-32 bg-primary/20 rounded-full
                  mix-blend-multiply filter blur-2xl transition-all duration-500
                  ${isImageLoaded ? 'opacity-20 scale-110' : 'opacity-10'}
                `}></div>
                
                {/* App Image */}
                <img 
                  src={appImage} 
                  alt="Kinship Sync App" 
                  className={`
                    w-full rounded-3xl shadow-2xl relative z-10
                    transform transition-all duration-1000
                    ${isImageLoaded ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}
                  `}
                  onLoad={() => setIsImageLoaded(true)}
                />

                {/* Floating Badges */}
                <div className={`
                  absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4
                  transform transition-all duration-700
                  ${isImageLoaded ? 'translate-y-0 rotate-6 opacity-100' : 'translate-y-4 rotate-0 opacity-0'}
                `}>
                  <div className="flex items-center gap-3">
                    <Star className="text-primary w-6 h-6" />
                    <span className="text-sm font-medium">{rating} Rating</span>
                  </div>
                </div>
                <div className={`
                  absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4
                  transform transition-all duration-700
                  ${isImageLoaded ? 'translate-y-0 -rotate-6 opacity-100' : 'translate-y-4 rotate-0 opacity-0'}
                `}>
                  <div className="flex items-center gap-3">
                    <Download className="text-primary w-6 h-6" />
                    <span className="text-sm font-medium">{downloadCount.toLocaleString()}+ Downloads</span>
                  </div>
                </div>
              </div>
            </div>

            {/* App Stores */}
            <div className="app-stores mb-16" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">Available on All Platforms</h3>
              <div className="store-buttons flex flex-wrap justify-center items-center gap-6">
                {platforms.map((platform, index) => (
                  <a 
                    key={index}
                    href={platform.link}
                    className="store-button group relative overflow-hidden"
                    onMouseEnter={() => setHoveredPlatform(index)}
                    onMouseLeave={() => setHoveredPlatform(null)}
                  >
                    <div className={`
                      relative z-10 flex items-center gap-4 px-8 py-4 rounded-xl
                      border-2 transition-all duration-300
                      ${hoveredPlatform === index 
                        ? 'border-primary/60 bg-primary/10 shadow-lg' 
                        : 'border-primary/20 bg-background'
                      }
                    `}>
                      {React.isValidElement(platform.icon) ? (
                        <div className={`
                          w-12 h-12 rounded-xl bg-primary/10
                          flex items-center justify-center
                          transform transition-all duration-500
                          ${hoveredPlatform === index ? 'rotate-12 scale-110' : ''}
                        `}>
                          {platform.icon}
                        </div>
                      ) : (
                        <img 
                          src={platform.icon as string} 
                          alt={platform.store}
                          className={`
                            w-12 h-12 object-contain
                            transform transition-all duration-500
                            ${hoveredPlatform === index ? 'scale-110' : ''}
                          `}
                        />
                      )}
                      <div className="text-left">
                        <div className="text-xs text-muted-foreground">{platform.text}</div>
                        <div className="text-lg font-semibold text-foreground">{platform.store}</div>
                      </div>
                    </div>
                    {/* Hover Effect */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10
                      transition-opacity duration-300
                      ${hoveredPlatform === index ? 'opacity-10' : 'opacity-0'}
                    `}></div>
                  </a>
                ))}
              </div>
            </div>

            {/* App Features */}
            <div className="app-features grid grid-cols-1 md:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="200">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="feature-box relative overflow-hidden"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={`
                    bg-background p-8 rounded-2xl relative
                    transform transition-all duration-500
                    ${hoveredFeature === index ? 'translate-y-[-4px] shadow-xl' : 'shadow-lg'}
                  `}>
                    {/* Icon */}
                    <div className={`
                      w-16 h-16 rounded-xl bg-primary/10
                      flex items-center justify-center mb-6
                      transform transition-all duration-500
                      ${hoveredFeature === index ? 'rotate-12 scale-110' : ''}
                    `}>
                      {feature.icon}
                    </div>

                    {/* Content */}
                    <h4 className={`
                      text-xl font-semibold text-foreground mb-3
                      transform transition-all duration-300
                      ${hoveredFeature === index ? 'translate-x-1' : ''}
                    `}>{feature.title}</h4>
                    <p className={`
                      text-muted-foreground transition-all duration-300
                      ${hoveredFeature === index ? 'translate-x-1' : ''}
                    `}>{feature.description}</p>

                    {/* Decorative Line */}
                    <div className={`
                      absolute bottom-0 left-1/2 transform -translate-x-1/2
                      w-16 h-1 rounded-full transition-all duration-500
                      bg-gradient-to-r from-primary/10 to-primary/20
                      ${hoveredFeature === index ? 'w-32' : ''}
                    `}></div>
                  </div>
                </div>
              ))}
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
        `}
      </style>
    </section>
  );
};

export default AppInstallSection;
