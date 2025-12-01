// PricingSection.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight, Tag } from 'lucide-react';

const PricingSection: React.FC = () => {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
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

    const section = document.getElementById('pricing');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const plans = [
    {
      name: "Starter",
      price: "0",
      features: [
        { text: "Basic event website", included: true },
        { text: "Up to 50 guests", included: true },
        { text: "Basic RSVP management", included: true },
        { text: "Event schedule", included: true },
        { text: "Advanced customization", included: false },
        { text: "Gift registry", included: false },
        { text: "Premium support", included: false }
      ]
    },
    {
      name: "Family",
      price: "9.99",
      popular: true,
      features: [
        { text: "Custom event website", included: true },
        { text: "Up to 200 guests", included: true },
        { text: "Advanced RSVP management", included: true },
        { text: "Detailed event schedule", included: true },
        { text: "Basic customization", included: true },
        { text: "Gift registry", included: true },
        { text: "Premium support", included: false }
      ]
    },
    {
      name: "Premium",
      price: "19.99",
      features: [
        { text: "Premium event website", included: true },
        { text: "Unlimited guests", included: true },
        { text: "Full RSVP management", included: true },
        { text: "Advanced scheduling", included: true },
        { text: "Full customization", included: true },
        { text: "Premium gift registry", included: true },
        { text: "24/7 Premium support", included: true }
      ]
    }
  ];

  const comparisonFeatures = [
    { feature: "Event Websites", starter: "Basic", family: "Custom", premium: "Premium" },
    { feature: "Guest Management", starter: "Up to 50", family: "Up to 200", premium: "Unlimited" },
    { feature: "Customization", starter: "Basic", family: "Advanced", premium: "Full" },
    { feature: "Support", starter: "Email", family: "Email & Chat", premium: "24/7 Priority" }
  ];

  return (
    <section id="pricing" className="pricing section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className={`
        absolute inset-0 bg-gradient-to-b from-backgroundSecondary to-background
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
        absolute bottom-1/4 left-0 w-64 h-64 bg-primary rounded-full
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
          <span className="inline-block mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider transform hover:scale-105 transition-transform group">
            <Tag className="inline-block w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform" />
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Choose Your Perfect Plan
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Select the plan that best fits your family event planning needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`
                relative transform transition-all duration-700 delay-${300 * (index + 1)}
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
              data-aos="fade-up"
              data-aos-delay={100 * (index + 1)}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <div className={`
                pricing-card bg-white rounded-3xl shadow-lg p-8 h-full flex flex-col
                relative transform transition-all duration-500
                ${hoveredPlan === index ? 'scale-[1.02] shadow-2xl translate-y-[-4px]' : ''}
                ${plan.popular ? 'border-2 border-primary' : ''}
              `}>
                {/* Popular Badge */}
                {plan.popular && (
                  <div className={`
                    absolute -top-5 left-1/2 -translate-x-1/2
                    transform transition-all duration-300
                    ${hoveredPlan === index ? 'scale-110' : ''}
                  `}>
                    <div className="bg-primary text-primaryContrastText px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                
                {/* Plan Header */}
                <div className="pricing-header mb-8">
                  <h3 className={`
                    text-2xl font-bold text-foreground mb-4
                    transform transition-all duration-300
                    ${hoveredPlan === index ? 'text-primary' : ''}
                  `}>{plan.name}</h3>
                  <div className={`
                    price flex items-baseline
                    transform transition-all duration-300
                    ${hoveredPlan === index ? 'scale-105' : ''}
                  `}>
                    <span className="currency text-gray-500 text-xl">$</span>
                    <span className="amount text-4xl lg:text-5xl font-bold text-gray-800 mx-1">{plan.price}</span>
                    <span className="period text-gray-500">/month</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="pricing-features flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li 
                        key={i} 
                        className={`
                          flex items-start gap-3 transform transition-all duration-300
                          ${hoveredPlan === index ? 'translate-x-2' : ''}
                        `}
                      >
                        <div className={`
                          flex-shrink-0 w-5 h-5 rounded-full
                          ${feature.included ? 'bg-primary/10' : 'bg-red-50'}
                          flex items-center justify-center mt-0.5
                          transform transition-all duration-300
                          ${hoveredPlan === index ? 'scale-110 rotate-3' : ''}
                        `}>
                          {feature.included ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <X className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        <span className={`
                          text-gray-600 transition-colors duration-300
                          ${hoveredPlan === index ? 'text-gray-800' : ''}
                        `}>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="pricing-footer mt-8">
                  <Link 
                    to="/auth" 
                    className={`
                      group relative w-full overflow-hidden
                      inline-flex items-center justify-center px-8 py-4 rounded-xl
                      font-medium transition-all duration-300 text-base
                      ${plan.popular 
                        ? 'bg-primary text-primaryContrastText hover:bg-primary/80' 
                        : 'bg-primary/10 text-primary hover:bg-primary/20'}
                      transform hover:-translate-y-1 hover:shadow-lg
                    `}
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Background Gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent
                  rounded-3xl opacity-0 transition-opacity duration-300
                  ${hoveredPlan === index ? 'opacity-5' : ''}
                `}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className={`
          mt-20 transform transition-all duration-700 delay-1000
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `} data-aos="fade-up" data-aos-delay="400">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Compare Plans</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-4 px-6 text-left font-semibold text-gray-600">Feature</th>
                      <th className="py-4 px-6 text-center font-semibold text-gray-600">Starter</th>
                      <th className="py-4 px-6 text-center font-semibold text-primary">Family</th>
                      <th className="py-4 px-6 text-center font-semibold text-gray-600">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {comparisonFeatures.map((row, i) => (
                      <tr 
                        key={i}
                        className={`
                          transition-all duration-300
                                                  ${hoveredRow === i ? 'bg-primary/5' : 'hover:bg-gray-50'}
                      `}
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className={`
                        py-4 px-6 text-gray-800 font-medium
                        transition-all duration-300
                        ${hoveredRow === i ? 'text-primary' : ''}
                      `}>{row.feature}</td>
                      <td className="py-4 px-6 text-center text-gray-600">{row.starter}</td>
                      <td className="py-4 px-6 text-center text-gray-600 bg-primary/10">{row.family}</td>
                        <td className="py-4 px-6 text-center text-gray-600">{row.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
        `}
      </style>
    </section>
  );
};

export default PricingSection;
