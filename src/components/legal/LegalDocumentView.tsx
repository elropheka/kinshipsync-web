import React from 'react';
import { Mail, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LegalDocument } from '@/constants/mock/legalContent';
import { legalPageRoutes } from '@/constants/mock/legalContent';

interface LegalDocumentViewProps {
  document: LegalDocument;
}

const LegalDocumentView: React.FC<LegalDocumentViewProps> = ({ document }) => {
  const relatedLinks = [
    { label: 'Privacy Policy', to: legalPageRoutes.privacyPolicy },
    { label: 'Terms of Service', to: legalPageRoutes.termsOfService },
    { label: 'Cookie Policy', to: legalPageRoutes.cookiePolicy },
  ].filter((link) => link.to !== `/${document.slug}`);

  return (
    <section className="relative py-16 md:py-24 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-backgroundSecondary" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000" />

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center mb-6 bg-primary/10 text-primary px-6 py-3 rounded-full font-medium shadow-lg">
            <Scale className="w-5 h-5 mr-2" />
            <span className="font-display">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            {document.title}
          </h1>
          <p className="text-lg text-muted-foreground">{document.subtitle}</p>
          <p className="mt-4 text-sm text-primary font-medium">
            Effective date: {document.effectiveDate}
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl shadow-xl p-8 md:p-12 space-y-10">
          {document.intro && (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {document.intro}
            </p>
          )}

          {document.sections.map((section) => (
            <article key={section.title} className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-foreground border-b border-border pb-3">
                {section.title}
              </h2>

              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-base text-muted-foreground leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul className="list-disc list-outside ml-6 space-y-2 text-muted-foreground">
                  {section.list.map((item) => (
                    <li key={item} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {section.subsections?.map((subsection) => (
                <div key={subsection.title} className="space-y-3 pl-0 md:pl-4">
                  <h3 className="text-lg font-heading font-semibold text-foreground">
                    {subsection.title}
                  </h3>
                  {subsection.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="text-base text-muted-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </article>
          ))}

          <div className="rounded-2xl bg-primary/5 border border-primary/15 p-6 md:p-8 text-center space-y-3">
            <h2 className="text-xl font-display font-semibold text-foreground">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this {document.title.toLowerCase()}, please contact us.
            </p>
            <a
              href={`mailto:${document.contactEmail}`}
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium transition-colors"
            >
              <Mail className="w-5 h-5" />
              {document.contactEmail}
            </a>
          </div>

          {document.footerNote && (
            <p className="text-center text-sm text-muted-foreground/70 pt-4 border-t border-border">
              {document.footerNote}
            </p>
          )}
        </div>

        <nav
          aria-label="Related legal pages"
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          {relatedLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-primary hover:text-secondary transition-colors underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </section>
  );
};

export default LegalDocumentView;
