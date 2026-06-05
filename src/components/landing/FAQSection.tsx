// FAQSection.tsx
import React, { useState, useEffect } from 'react';
import { Mail, ChevronDown } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
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

    const section = document.getElementById('faq');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const faqs = [
    {
      question: "What types of events can I plan with Kinship Sync?",
      answer: "Kinship Sync is perfect for all types of family events including reunions, weddings, birthdays, holiday gatherings, and more. Our platform is designed to handle events of any size, from intimate family dinners to large-scale celebrations."
    },
    {
      question: "How does the collaborative planning feature work?",
      answer: "You can invite family members to help plan by sharing access to your event. Each person can contribute ideas, manage tasks, and update information in real-time. The platform keeps everyone in sync with automatic notifications and updates."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely through our payment gateway, and you can cancel your subscription at any time."
    },
    {
      question: "Is my family's data secure?",
      answer: "Yes, we take data security seriously. All information is encrypted and stored securely. We never share your data with third parties, and you have full control over who can access your event information."
    },
    {
      question: "Can I use Kinship Sync on my mobile device?",
      answer: "Absolutely! Kinship Sync is available on both iOS and Android devices through our mobile apps. You can also access all features through our responsive web interface on any device."
    },
    {
      question: "What happens if I need to cancel my subscription?",
      answer: "You can cancel your subscription at any time. If you cancel, you'll continue to have access to your account until the end of your current billing period. Your event data will be preserved, and you can reactivate your subscription at any time."
    }
  ];

  return (
    <section id="faq" className="faq section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className={`
        absolute inset-0 bg-gradient-to-b from-background to-card
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}></div>
      <div className={`
        absolute top-1/4 right-0 w-64 h-64 bg-primary rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-300
        ${isVisible ? 'opacity-5 animate-blob' : ''}
      `}></div>
      <div className={`
        absolute bottom-1/4 left-0 w-64 h-64 bg-accent rounded-full
        mix-blend-multiply filter blur-3xl opacity-0
        transition-all duration-1000 delay-500
        ${isVisible ? 'opacity-5 animate-blob animation-delay-2000' : ''}
      `}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column */}
          <div className={`
            lg:sticky lg:top-8 lg:h-fit
            transform transition-all duration-700
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `} data-aos="fade-up">
            <span className="inline-block mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider transform hover:scale-105 transition-transform">
              FAQ
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Find answers to common questions about Kinship Sync and how it can help you plan your next family event.
            </p>
            
            {/* Contact Support */}
            <div className="group bg-primary/5 border border-border rounded-xl p-6 shadow-lg transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Still have questions?</h3>
                <p className="text-muted-foreground mb-6">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <a 
                  href="mailto:support@kinshipsync.com"
                  className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors group"
                >
                  <Mail className="w-5 h-5 transform group-hover:rotate-12 transition-transform" />
                  <span className="font-medium relative">
                    Contact Support
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`
                  relative transform transition-all duration-700 delay-${200 * (index + 1)}
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`
                  bg-card border border-border rounded-xl shadow-lg overflow-hidden
                  transform transition-all duration-300
                  ${activeIndex === index ? 'ring-2 ring-primary/30 shadow-xl' : ''}
                  ${hoveredIndex === index ? 'translate-x-2' : ''}
                `}>
                  <button
                    className="w-full px-6 py-5 text-left focus:outline-none"
                    onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className={`
                        font-semibold transition-colors duration-300
                        ${activeIndex === index ? 'text-primary' : 'text-foreground'}
                        ${hoveredIndex === index ? 'text-primary' : ''}
                      `}>
                        {faq.question}
                      </h3>
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-lg
                        flex items-center justify-center
                        transform transition-all duration-300
                        ${activeIndex === index ? 'bg-primary/10 rotate-180' : 'bg-muted'}
                        ${hoveredIndex === index ? 'scale-110' : ''}
                      `}>
                        <ChevronDown className={`
                          w-5 h-5
                          transition-colors duration-300
                          ${activeIndex === index || hoveredIndex === index ? 'text-primary' : 'text-muted-foreground'}
                        `} />
                      </div>
                    </div>
                  </button>
                  
                  <div className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="p-6 pt-0">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>

                  {/* Background Gradient */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent
                    rounded-2xl opacity-0 transition-opacity duration-300
                    ${hoveredIndex === index ? 'opacity-5' : ''}
                  `}></div>
                </div>
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
        `}
      </style>
    </section>
  );
};

export default FAQSection;
