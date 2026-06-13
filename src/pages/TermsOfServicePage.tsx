import React from 'react';
import PublicPageLayout from '@/components/landing/PublicPageLayout';
import LegalDocumentView from '@/components/legal/LegalDocumentView';
import { MetaTags } from '@/components/common/MetaTags';
import { termsOfServiceDocument } from '@/constants/mock/legalContent';

const TermsOfServicePage: React.FC = () => {
  return (
    <PublicPageLayout>
      <MetaTags
        title={termsOfServiceDocument.title}
        description={termsOfServiceDocument.metaDescription}
      />
      <LegalDocumentView document={termsOfServiceDocument} />
    </PublicPageLayout>
  );
};

export default TermsOfServicePage;
