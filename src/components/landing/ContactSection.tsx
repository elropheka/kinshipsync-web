// ContactSection.tsx
import React, { useState, useEffect } from 'react';
import { Mail, MapPin, ArrowRight, Facebook, Twitter, Instagram, Linkedin, CheckCircle, AlertCircle } from 'lucide-react';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [hoveredContact, setHoveredContact] = useState<number | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
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

    const section = document.getElementById('contact');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus(error ? 'error' : 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: 'Email',
      content: 'support@kinshipsync.com',
      subtext: 'We typically respond within 24 hours',
      link: 'mailto:support@kinshipsync.com',
      gradient: 'from-primary/20 to-primary/60'
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: 'Location',
      content: 'United States',
      subtext: 'Serving families worldwide',
      link: null,
      gradient: 'from-primary/20 to-primary/60'
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', color: '#1877F2' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', color: '#1DA1F2' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', color: '#E4405F' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', color: '#0A66C2' }
  ];

  return (
    <section id="contact" className="contact section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className={`
        absolute inset-0 bg-gradient-to-b from-backgroundSecondary to-background
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
          section-header text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-block mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider transform hover:scale-105 transition-transform group">
            <Mail className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform" />
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Get in{' '}
            <span className="relative inline-block group">
              <span className="relative z-10 text-primary transform transition-transform duration-300 group-hover:scale-110">Touch</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 transform -rotate-2 transition-all duration-300 group-hover:h-full group-hover:bottom-0 group-hover:rotate-0"></span>
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions or need assistance? We're here to help make your family event planning experience seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Contact Information */}
          <div className={`
            transform transition-all duration-700 delay-200
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className="bg-primary rounded-2xl p-8 lg:p-12 shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>

                {contactInfo.map((item, index) => (
                  <div 
                    key={index}
                    className={`
                      flex items-start gap-6 mb-8 last:mb-0 group/item
                      transform transition-all duration-700 delay-${300 * (index + 1)}
                      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                    `}
                    onMouseEnter={() => setHoveredContact(index)}
                    onMouseLeave={() => setHoveredContact(null)}
                  >
                    <div className={`
                      flex-shrink-0 w-14 h-14 bg-white rounded-xl
                      flex items-center justify-center
                      transform transition-all duration-500
                      ${hoveredContact === index ? 'rotate-12 scale-110 shadow-lg' : ''}
                    `}>
                      <div className={`
                        transform transition-transform duration-300
                        ${hoveredContact === index ? 'scale-110' : ''}
                      `}>
                        {item.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className={`
                        text-lg font-semibold text-white mb-1
                        transform transition-all duration-300
                        ${hoveredContact === index ? 'translate-x-1' : ''}
                      `}>{item.title}</h4>
                      {item.link ? (
                        <a 
                          href={item.link} 
                          className={`
                            text-white hover:text-primary/20 transition-colors
                            transform transition-all duration-300
                            ${hoveredContact === index ? 'translate-x-1' : ''}
                          `}
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className={`
                          text-white
                          transform transition-all duration-300
                          ${hoveredContact === index ? 'translate-x-1' : ''}
                        `}>{item.content}</p>
                      )}
                      <p className={`
                        text-sm text-white/80 mt-1
                        transform transition-all duration-300
                        ${hoveredContact === index ? 'translate-x-1' : ''}
                      `}>{item.subtext}</p>
                    </div>
                  </div>
                ))}

                {/* Social Links */}
                <div className={`
                  mt-12 pt-8 border-t border-white/20
                  transform transition-all duration-700 delay-1000
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className="relative group/social"
                        onMouseEnter={() => setHoveredSocial(index)}
                        onMouseLeave={() => setHoveredSocial(null)}
                      >
                        <div className={`
                          absolute inset-0 bg-gradient-to-r from-primary/20 to-[${social.color}]
                          rounded-lg opacity-0 transition-opacity duration-300
                          ${hoveredSocial === index ? 'opacity-20' : ''}
                        `}></div>
                        <div className={`
                          w-10 h-10 bg-white rounded-lg
                          flex items-center justify-center
                          text-primary hover:bg-primary/10
                          transform transition-all duration-300
                          ${hoveredSocial === index ? 'scale-110 rotate-12 shadow-lg' : ''}
                        `}>
                          <div className={`
                            transform transition-transform duration-300
                            ${hoveredSocial === index ? 'scale-110' : ''}
                          `}>
                            {social.icon}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`
            transform transition-all duration-700 delay-400
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['name', 'email'].map((field, index) => (
                    <div key={field} className={`
                      transform transition-all duration-700 delay-${500 + (index * 200)}
                      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                    `}>
                      <label 
                        htmlFor={field}
                        className={`
                          block text-sm font-medium mb-2
                          transition-colors duration-300
                          ${focusedField === field ? 'text-primary' : 'text-gray-700'}
                        `}
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        id={field}
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        onFocus={() => setFocusedField(field)}
                        onBlur={() => setFocusedField(null)}
                        className={`
                          w-full px-4 py-3 rounded-xl
                          border transition-all duration-300 
                          ${focusedField === field 
                            ? 'border-primary ring-1 ring-primary shadow-lg bg-gray-50' 
                            : 'border-gray-200 hover:border-primary bg-gray-50'
                          }
                        `}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className={`
                  transform transition-all duration-700 delay-900
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}>
                  <label 
                    htmlFor="subject"
                    className={`
                      block text-sm font-medium mb-2
                      transition-colors duration-300
                      ${focusedField === 'subject' ? 'text-primary' : 'text-gray-700'}
                    `}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    className={`
                      w-full px-4 py-3 rounded-xl
                      border transition-all duration-300
                      ${focusedField === 'subject' 
                        ? 'border-primary ring-1 ring-primary shadow-lg bg-gray-50' 
                        : 'border-gray-200 hover:border-primary bg-gray-50'
                      }
                    `}
                    required
                  />
                </div>

                <div className={`
                  transform transition-all duration-700 delay-1000
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}>
                  <label 
                    htmlFor="message"
                    className={`
                      block text-sm font-medium mb-2
                      transition-colors duration-300
                      ${focusedField === 'message' ? 'text-primary' : 'text-gray-700'}
                    `}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    rows={6}
                    className={`
                      w-full px-4 py-3 rounded-xl resize-none
                      border transition-all duration-300
                      ${focusedField === 'message' 
                        ? 'border-primary ring-1 ring-primary shadow-lg bg-gray-50' 
                        : 'border-gray-200 hover:border-primary bg-gray-50'
                      }
                    `}
                    required
                  ></textarea>
                </div>

                <div className={`
                  text-center
                  transform transition-all duration-700 delay-1100
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      group relative overflow-hidden
                      inline-flex items-center justify-center
                      px-8 py-4 rounded-xl text-white font-medium text-base
                      transform transition-all duration-300
                      ${isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-primary hover:bg-primary/80 hover:-translate-y-1 hover:shadow-lg'
                      }
                    `}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Send Message</span>
                        <ArrowRight className="w-5 h-5 ml-2 relative z-10 transform group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className={`
                    text-center mt-4 text-green-600
                    transform transition-all duration-300
                    animate-fadeIn
                  `}>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Your message has been sent successfully!
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className={`
                    text-center mt-4 text-red-600
                    transform transition-all duration-300
                    animate-fadeIn
                  `}>
                    <AlertCircle className="w-5 h-5 mr-2" />
                    There was an error sending your message. Please try again.
                  </div>
                )}
              </form>
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
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </section>
  );
};

export default ContactSection;
