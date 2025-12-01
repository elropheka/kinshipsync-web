import React from 'react';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

interface SocialShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ title, url, description }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=KinshipSync`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };

  return (
    <div className="flex justify-center space-x-4 py-4">
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook size={28} />
      </a>
      <a 
        href={shareLinks.twitter} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-400 hover:text-blue-600 transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter size={28} />
      </a>
      <a 
        href={shareLinks.linkedin} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-700 hover:text-blue-900 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={28} />
      </a>
      <a 
        href={shareLinks.email} 
        className="text-gray-600 hover:text-gray-800 transition-colors"
        aria-label="Share via Email"
      >
        <Mail size={28} />
      </a>
    </div>
  );
};
