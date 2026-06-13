import React from 'react';
import PublicPageLayout from '@/components/landing/PublicPageLayout';
import LegalDocumentView from '@/components/legal/LegalDocumentView';
import { MetaTags } from '@/components/common/MetaTags';
import { cookiePolicyDocument } from '@/constants/mock/legalContent';

const CookiePolicyPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <MetaTags
        title={cookiePolicyDocument.title}
        description={cookiePolicyDocument.metaDescription}
      />
      <LegalDocumentView document={cookiePolicyDocument} />
    </PublicPageLayout>
  );
};

export default CookiePolicyPage;
