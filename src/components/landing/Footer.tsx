import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import tealTextLogo from '@/assets/branding/teal-text-logo.png';
import { landingFooter } from '@/constants/mock/landingPage';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-[#5D2413] text-white pt-16 pb-8">
      <div className="max-w-container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <img
                src={tealTextLogo}
                alt="Kinship Sync"
                className="h-12 w-auto object-contain brightness-110"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-4">{landingFooter.tagline}</p>
            <p className="text-white/50 text-sm flex items-center gap-1.5">
              {landingFooter.madeWith}{' '}
              <FiHeart className="w-4 h-4 text-secondary fill-secondary" />{' '}
              {landingFooter.madeFor}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-5">Product</h4>
            <ul className="space-y-3">
              {landingFooter.productLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="text-white/70 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-5">Company</h4>
            <ul className="space-y-3">
              {landingFooter.companyLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="text-white/70 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/15 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-white/50 text-sm">{landingFooter.copyright}</p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            {landingFooter.legalLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-white/50 text-sm hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
