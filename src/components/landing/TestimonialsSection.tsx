// TestimonialsSection.tsx
import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, MapPin, Star, Quote } from 'lucide-react';
import testimonial1 from '../../assets/img/testimonials/testimonials-1.jpg';
import testimonial2 from '../../assets/img/testimonials/testimonials-2.jpg';
import testimonial3 from '../../assets/img/testimonials/testimonials-3.jpg';
import testimonial4 from '../../assets/img/testimonials/testimonials-4.jpg';

const TestimonialsSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
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

    const section = document.getElementById('testimonials');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  useEffect(() => {
    if (!hoveredIndex) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [hoveredIndex]);

  const testimonials = [
    {
      img: testimonial1,
      name: "Michelle Thompson",
      role: "Family Reunion Organizer",
      quote: "Planning our annual family reunion used to be a nightmare. With Kinship Sync, I can easily coordinate with 50+ family members, track RSVPs, and share updates. It's been a game-changer for our family gatherings!",
      location: "Atlanta, GA"
    },
    {
      img: testimonial2,
      name: "Aisha Williams",
      role: "Wedding Planner",
      quote: "The collaborative features made planning my sister's wedding so much easier. We could all contribute ideas, track the guest list, and manage the schedule in one place. It brought our family closer during the planning process.",
      location: "Chicago, IL"
    },
    {
      img: testimonial3,
      name: "Tanya Rodriguez",
      role: "Community Event Coordinator",
      quote: "As someone who organizes multiple family events throughout the year, Kinship Sync has been invaluable. The RSVP management and scheduling features save me hours of work, and the mobile app makes it easy to update on the go.",
      location: "Miami, FL"
    },
    {
      img: testimonial4,
      name: "Keisha Brown",
      role: "Family Celebration Host",
      quote: "I love how Kinship Sync understands the importance of family traditions while making event planning modern and efficient. The gift registry feature was especially helpful for our family's milestone celebrations.",
      location: "Houston, TX"
    }
  ];

  return (
    <section id="testimonials" className="testimonials section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className={`
        absolute inset-0 bg-gradient-to-b from-gray-50 to-white
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}></div>
      <div className={`
        absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-300
        ${isVisible ? 'opacity-5 animate-blob' : ''}
      `}></div>
      <div className={`
        absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-500
        ${isVisible ? 'opacity-5 animate-blob animation-delay-2000' : ''}
      `}></div>
      <div className={`
        absolute top-1/2 left-1/2 w-64 h-64 bg-primary/20 rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-700
        ${isVisible ? 'opacity-5 animate-blob animation-delay-4000' : ''}
      `}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`
          section-title text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-block mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider transform hover:scale-105 transition-transform group">
            <MessageSquareQuote className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform" />
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Success{' '}
            <span className="relative inline-block group">
              <span className="relative z-10 text-primary transform transition-transform duration-300 group-hover:scale-110">Stories</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 transform -rotate-2 transition-all duration-300 group-hover:h-full group-hover:bottom-0 group-hover:rotate-0"></span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from families who have transformed their event planning experience
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`
                relative transform transition-all duration-700 delay-${200 * (index + 1)}
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                ${index === activeIndex ? 'z-20 scale-100 opacity-100' : 'z-10 scale-95 opacity-75'}
              `}
              onMouseEnter={() => {
                setHoveredIndex(index);
                setActiveIndex(index);
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card */}
              <div className={`
                bg-white rounded-2xl p-8 relative group
                shadow-lg transition-all duration-500
                transform hover:-translate-y-2
                ${hoveredIndex === index ? 'shadow-2xl ring-2 ring-primary/20' : 'hover:shadow-xl'}
              `}>
                {/* Background Gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent
                  rounded-2xl opacity-0 transition-opacity duration-300
                  ${hoveredIndex === index ? 'opacity-50' : ''}
                `}></div>

                {/* Profile Section */}
                <div className="flex items-center mb-6 relative">
                  {/* Image Container */}
                  <div className="relative group/image">
                    <div className={`
                      absolute inset-0 bg-gradient-to-br from-[#2ECDB0] to-[#1AB89C]
                      rounded-full transform transition-all duration-500
                      ${hoveredIndex === index ? '-rotate-12 scale-110' : '-rotate-6'}
                    `}></div>
                    <img 
                      src={testimonial.img} 
                      className={`
                        w-20 h-20 rounded-full object-cover relative z-10
                        border-4 border-white transition-all duration-500
                        ${hoveredIndex === index ? 'scale-105 shadow-lg' : ''}
                      `}
                      alt={testimonial.name}
                    />
                  </div>

                  {/* Name and Role */}
                  <div className="ml-4">
                    <h3 className={`
                      text-xl font-semibold mb-1
                      transition-colors duration-300
                      ${hoveredIndex === index ? 'text-[#2ECDB0]' : 'text-gray-800'}
                    `}>{testimonial.name}</h3>
                    <h4 className="text-sm text-gray-500 mb-1">{testimonial.role}</h4>
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className={`
                        w-4 h-4 mr-1
                        transition-colors duration-300
                        ${hoveredIndex === index ? 'text-[#2ECDB0]' : ''}
                      `} />
                      {testimonial.location}
                    </div>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="stars flex space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`
                        w-5 h-5
                        transform transition-all duration-300
                        ${hoveredIndex === index 
                          ? i <= 4 
                            ? 'text-[#1AB89C] scale-110 rotate-[360deg]' 
                            : 'text-gray-200'
                          : i <= 4 
                            ? 'text-[#2ECDB0]' 
                            : 'text-gray-200'
                        }
                      `}
                      fill="currentColor"
                    />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative">
                  {/* Quote Icons */}
                  <Quote className={`
                    w-8 h-8 text-[#2ECDB0] absolute -top-4 -left-2 opacity-20
                    transform transition-all duration-500
                    ${hoveredIndex === index ? 'rotate-12 scale-110' : ''}
                  `} />
                  
                  {/* Testimonial Text */}
                  <p className={`
                    text-gray-700 leading-relaxed relative z-10 px-2
                    transform transition-all duration-300
                    ${hoveredIndex === index ? 'scale-102' : ''}
                  `}>
                    {testimonial.quote}
                  </p>
                  
                  <Quote className={`
                    w-8 h-8 text-[#2ECDB0] absolute -bottom-4 -right-2
                    opacity-20 transform scale-[-1] transition-all duration-500
                    ${hoveredIndex === index ? '-rotate-12 scale-110' : ''}
                  `} />
                </div>

                {/* Decorative Line */}
                <div className={`
                  mt-6 h-1 mx-auto rounded-full
                  bg-gradient-to-r from-[#DDFBF4] to-[#2ECDB0]/20
                  transition-all duration-300
                  ${hoveredIndex === index ? 'w-32 opacity-100' : 'w-16 opacity-50'}
                `}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className={`
          flex justify-center space-x-2 mt-12
          transform transition-all duration-700 delay-1000
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                transform hover:scale-110
                ${activeIndex === index 
                  ? 'bg-[#2ECDB0] w-8 shadow-lg'
                  : 'bg-[#DDFBF4] hover:bg-[#2ECDB0]/50'
                }
              `}
              aria-label={`Go to testimonial ${index + 1}`}
            />
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
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .scale-102 {
            transform: scale(1.02);
          }
        `}
      </style>
    </section>
  );
};

export default TestimonialsSection;
