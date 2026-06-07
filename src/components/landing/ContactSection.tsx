// ContactSection.tsx
import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, Headphones } from 'lucide-react';
import { landingSupport } from '@/constants/landingSupportContent';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [hoveredContact, setHoveredContact] = useState<number | null>(null);
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

    const section = document.getElementById('support');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      '',
      formData.message,
    ].join('\n');

    const mailtoUrl = `mailto:${landingSupport.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="support" className="contact section relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className={`
        absolute inset-0 bg-gradient-to-b from-backgroundSecondary to-background
        transform transition-opacity duration-1000
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `} />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`
          section-header text-center mb-16
          transform transition-all duration-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <span className="inline-flex items-center mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm uppercase font-semibold tracking-wider">
            <Headphones className="w-5 h-5 mr-2" />
            {landingSupport.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {landingSupport.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {landingSupport.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className={`
            transform transition-all duration-700 delay-200
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className="bg-primary rounded-2xl p-8 lg:p-12 shadow-xl h-full">
              <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>

              {landingSupport.contacts.map((item, index) => (
                <div
                  key={item.title}
                  className="flex items-start gap-6 mb-8 last:mb-0 group/item"
                  onMouseEnter={() => setHoveredContact(index)}
                  onMouseLeave={() => setHoveredContact(null)}
                >
                  <div className={`
                    flex-shrink-0 w-14 h-14 bg-white rounded-xl flex items-center justify-center
                    transform transition-all duration-500
                    ${hoveredContact === index ? 'rotate-12 scale-110 shadow-lg' : ''}
                  `}>
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                    {item.link ? (
                      <a href={item.link} className="text-white hover:text-accent transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white">{item.value}</p>
                    )}
                    <p className="text-sm text-white/80 mt-1">{item.subtext}</p>
                  </div>
                </div>
              ))}

              <p className="mt-10 pt-8 border-t border-white/20 text-sm text-white/80">
                {landingSupport.responseTime}
              </p>
            </div>
          </div>

          <div className={`
            transform transition-all duration-700 delay-400
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <div className="bg-card border border-border rounded-2xl p-8 lg:p-12 shadow-xl h-full">
              <h3 className="text-2xl font-bold text-foreground mb-2">Send a Message</h3>
              <p className="text-muted-foreground mb-8 text-sm">
                Fill out the form below and your email app will open with your message ready to send.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(['name', 'email'] as const).map((field) => (
                    <div key={field}>
                      <label
                        htmlFor={field}
                        className={`block text-sm font-medium mb-2 transition-colors duration-300 ${focusedField === field ? 'text-primary' : 'text-foreground'}`}
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        onFocus={() => setFocusedField(field)}
                        onBlur={() => setFocusedField(null)}
                        className={`
                          w-full px-4 py-3 rounded-xl border bg-background transition-all duration-300
                          ${focusedField === field ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'}
                        `}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className={`block text-sm font-medium mb-2 transition-colors duration-300 ${focusedField === 'subject' ? 'text-primary' : 'text-foreground'}`}
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
                    placeholder="e.g. Help with guest invites"
                    className={`
                      w-full px-4 py-3 rounded-xl border bg-background transition-all duration-300
                      ${focusedField === 'subject' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'}
                    `}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className={`block text-sm font-medium mb-2 transition-colors duration-300 ${focusedField === 'message' ? 'text-primary' : 'text-foreground'}`}
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
                    placeholder="Tell us how we can help with your reunion or event..."
                    className={`
                      w-full px-4 py-3 rounded-xl resize-none border bg-background transition-all duration-300
                      ${focusedField === 'message' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'}
                    `}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  Open Email to Send
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
