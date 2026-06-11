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
      <div className={`
        absolute inset-0 bg-gradient-to-b from-[#F5EFE8] to-[#D6C8AF]
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}></div>
      <div className={`
        absolute top-1/4 right-0 w-64 h-64 bg-[#5F6E3D] rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-300
        ${isVisible ? 'opacity-5 animate-blob' : ''}
      `}></div>
      <div className={`
        absolute bottom-1/4 left-0 w-64 h-64 bg-[#5F6E3D] rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-500
        ${isVisible ? 'opacity-5 animate-blob animation-delay-2000' : ''}
      `}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`
          section-header text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `} data-aos="fade-up">
          <span className="inline-block mb-4 px-4 py-2 bg-[#F5EFE8] text-[#5F6E3D] rounded-full text-sm uppercase font-semibold tracking-wider transform hover:scale-105 transition-transform">
            Our Partners
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#5D2413] mb-6">
            Trusted by Leading Companies
          </h2>
          <p className="text-lg md:text-xl text-[#5F6E3D] max-w-3xl mx-auto">
            Join the growing list of companies that trust Kinship Sync for their family event planning needs
          </p>
        </div>

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
              <div className={`
                absolute inset-0 bg-[#F5EFE8] rounded-2xl shadow-lg
                transform transition-all duration-500
                ${hoveredIndex === index ? 'scale-105 shadow-xl translate-y-[-4px]' : ''}
              `}></div>

              <div className={`
                absolute -inset-0.5 bg-gradient-to-r from-[#E08433] to-[#ECAB47]
                rounded-2xl opacity-0 transition-opacity duration-300
                ${hoveredIndex === index ? 'opacity-15' : ''}
              `}></div>

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

        <div className={`
          mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center
          transform transition-all duration-700 delay-1000
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `} data-aos="fade-up" data-aos-delay="400">
          {[
            { value: "500+", label: "Events Hosted", icon: <CalendarCheck className="w-6 h-6 text-[#5F6E3D]" /> },
            { value: "98%", label: "Client Satisfaction", icon: <SmilePlus className="w-6 h-6 text-[#5F6E3D]" /> },
            { value: "24/7", label: "Support Available", icon: <Headphones className="w-6 h-6 text-[#5F6E3D]" /> },
            { value: "Global", label: "Coverage", icon: <Globe className="w-6 h-6 text-[#5F6E3D]" /> }
          ].map((stat, index) => (
            <div 
              key={index}
              className="group"
              onMouseEnter={() => setHoveredIndex(index + clients.length)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`
                w-16 h-16 mx-auto mb-4 rounded-xl
                bg-[#F5EFE8] flex items-center justify-center
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
                text-2xl font-bold text-[#5D2413] mb-1
                transform transition-all duration-300
                ${hoveredIndex === index + clients.length ? 'text-[#5F6E3D] scale-105' : ''}
              `}>{stat.value}</div>
              <div className={`
                text-sm text-[#5F6E3D]
                transition-colors duration-300
                ${hoveredIndex === index + clients.length ? 'text-[#5D2413]' : ''}
              `}>{stat.label}</div>

              <div className={`
                mt-4 h-1 w-12 mx-auto rounded-full
                bg-gradient-to-r from-[#F5EFE8] to-[#5F6E3D]/20
                transform transition-all duration-300
                ${hoveredIndex === index + clients.length ? 'w-24' : ''}
              `}></div>
            </div>
          ))}
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

export default ClientsSection;
