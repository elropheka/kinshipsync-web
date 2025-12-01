// ClientsSection.tsx
import React, { useState, useEffect } from 'react';
import { CalendarCheck, SmilePlus, Headphones, Globe } from 'lucide-react';
import client1 from '../../assets/img/clients/client-1.png';
import client2 from '../../assets/img/clients/client-2.png';
import client3 from '../../assets/img/clients/client-3.png';
import client4 from '../../assets/img/clients/client-4.png';
import client5 from '../../assets/img/clients/client-5.png';
import client6 from '../../assets/img/clients/client-6.png';
import client7 from '../../assets/img/clients/client-7.png';
import client8 from '../../assets/img/clients/client-8.png';

const ClientsSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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

    const section = document.getElementById('clients');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const clients = [
    { image: client1, name: "Client 1" },
    { image: client2, name: "Client 2" },
    { image: client3, name: "Client 3" },
    { image: client4, name: "Client 4" },
    { image: client5, name: "Client 5" },
    { image: client6, name: "Client 6" },
    { image: client7, name: "Client 7" },
    { image: client8, name: "Client 8" }
  ];

  return (
    <section id="clients" className="clients section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className={`
        absolute inset-0 bg-gradient-to-b from-white to-gray-50
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}></div>
      <div className={`
        absolute top-1/4 right-0 w-64 h-64 bg-[#2ECDB0] rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-300
        ${isVisible ? 'opacity-5 animate-blob' : ''}
      `}></div>
      <div className={`
        absolute bottom-1/4 left-0 w-64 h-64 bg-[#2ECDB0] rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-500
        ${isVisible ? 'opacity-5 animate-blob animation-delay-2000' : ''}
      `}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`
          section-header text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `} data-aos="fade-up">
          <span className="inline-block mb-4 px-4 py-2 bg-[#DDFBF4] text-[#2ECDB0] rounded-full text-sm uppercase font-semibold tracking-wider transform hover:scale-105 transition-transform">
            Our Partners
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Trusted by Leading Companies
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Join the growing list of companies that trust Kinship Sync for their family event planning needs
          </p>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12" data-aos="fade-up" data-aos-delay="200">
          {clients.map((client, index) => (
            <div
              key={index}
              className={`
                relative group transform transition-all duration-700 delay-${200 * (index + 1)}
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card Background */}
              <div className={`
                absolute inset-0 bg-white rounded-2xl shadow-lg
                transform transition-all duration-500
                ${hoveredIndex === index ? 'scale-105 shadow-xl translate-y-[-4px]' : ''}
              `}></div>

              {/* Decorative Elements */}
              <div className={`
                absolute -inset-0.5 bg-gradient-to-r from-[#2ECDB0] to-[#1AB89C]
                rounded-2xl opacity-0 transition-opacity duration-300
                ${hoveredIndex === index ? 'opacity-15' : ''}
              `}></div>

              {/* Client Logo */}
              <div className="relative p-8">
                <div className={`
                  aspect-[3/2] flex items-center justify-center
                  transform transition-all duration-500
                  ${hoveredIndex === index ? 'scale-110' : ''}
                `}>
                  <img
                    src={client.image}
                    alt={client.name}
                    className={`
                      max-h-12 md:max-h-16 w-auto object-contain
                      transition-all duration-500
                      ${hoveredIndex === index ? 'grayscale-0' : 'grayscale hover:grayscale-0'}
                    `}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className={`
          mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center
          transform transition-all duration-700 delay-1000
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `} data-aos="fade-up" data-aos-delay="400">
          {[
            { value: "500+", label: "Events Hosted", icon: <CalendarCheck className="w-6 h-6 text-[#2ECDB0]" /> },
            { value: "98%", label: "Client Satisfaction", icon: <SmilePlus className="w-6 h-6 text-[#2ECDB0]" /> },
            { value: "24/7", label: "Support Available", icon: <Headphones className="w-6 h-6 text-[#2ECDB0]" /> },
            { value: "Global", label: "Coverage", icon: <Globe className="w-6 h-6 text-[#2ECDB0]" /> }
          ].map((stat, index) => (
            <div 
              key={index}
              className="group"
              onMouseEnter={() => setHoveredIndex(index + clients.length)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`
                w-16 h-16 mx-auto mb-4 rounded-xl
                bg-[#DDFBF4] flex items-center justify-center
                transform transition-all duration-500
                ${hoveredIndex === index + clients.length ? 'rotate-12 scale-110 shadow-lg' : ''}
              `}>
                <div className={`
                  transform transition-all duration-300
                  ${hoveredIndex === index + clients.length ? 'scale-110' : ''}
                `}>
                  {stat.icon}
                </div>
              </div>
              <div className={`
                text-2xl font-bold text-gray-800 mb-1
                transform transition-all duration-300
                ${hoveredIndex === index + clients.length ? 'text-[#2ECDB0] scale-105' : ''}
              `}>{stat.value}</div>
              <div className={`
                text-sm text-gray-600
                transition-colors duration-300
                ${hoveredIndex === index + clients.length ? 'text-gray-800' : ''}
              `}>{stat.label}</div>

              {/* Decorative Line */}
              <div className={`
                mt-4 h-1 w-12 mx-auto rounded-full
                bg-gradient-to-r from-[#DDFBF4] to-[#2ECDB0]/20
                transform transition-all duration-300
                ${hoveredIndex === index + clients.length ? 'w-24' : ''}
              `}></div>
            </div>
          ))}
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

export default ClientsSection;
