import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { landingFaqs } from '@/constants/mock/landingPage';

const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(landingFaqs.items[0]?.id ?? null);

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <h2 className="font-display italic text-3xl md:text-4xl lg:text-[2.75rem] text-[#5D2413] text-center mb-12 md:mb-16">
          {landingFaqs.headline}
        </h2>

        <div className="max-w-3xl mx-auto space-y-3 mb-12">
          {landingFaqs.items.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-[#F5EFE8] rounded-2xl overflow-hidden border border-[#D6C8AF]/30"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-[#5D2413] text-sm md:text-base">
                    {faq.question}
                  </span>
                  <FiChevronDown
                    className={`w-5 h-5 text-[#5D2413] flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-5 text-muted-foreground text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto bg-[#FAF3EB] rounded-3xl p-8 md:p-10 text-center">
          <p className="text-[#5D2413]/80 text-base md:text-lg mb-6">
            {landingFaqs.supportCta.text}
          </p>
          <a
            href={`mailto:${landingFaqs.supportCta.email}`}
            className="inline-flex items-center px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-[#516036] transition-colors"
          >
            {landingFaqs.supportCta.button}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
