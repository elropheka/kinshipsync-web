import React from 'react';
import PublicPageLayout from '@/components/landing/PublicPageLayout';
import LegalDocumentView from '@/components/legal/LegalDocumentView';
import { MetaTags } from '@/components/common/MetaTags';
import { privacyPolicyDocument } from '@/constants/mock/legalContent';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <PublicPageLayout>
      <MetaTags
        title={privacyPolicyDocument.title}
        description={privacyPolicyDocument.metaDescription}
      />
      <LegalDocumentView document={privacyPolicyDocument} />
    </PublicPageLayout>
  );
};

export default PrivacyPolicyPage;
