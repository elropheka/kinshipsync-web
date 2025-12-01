import React from 'react';
import { SocialShareButtons } from './SocialShareButtons';
import type { ThemeColors } from '@/types/themeTypes';

interface EventSiteFooterProps {
  title: string;
  url: string;
  description?: string;
  themeColors?: ThemeColors;
}

const getFooterStyles = (colors: ThemeColors) => ({
  backgroundColor: colors.backgroundPrimary, // A distinct background for the footer
  color: colors.textSecondary, // A slightly muted text color
  borderTop: `1px solid ${colors.border}`,
});

export const EventSiteFooter: React.FC<EventSiteFooterProps> = ({ title, url, description, themeColors }) => {
  return (
    <footer 
      className="py-8 px-4 text-center container mx-auto"
      style={themeColors ? getFooterStyles(themeColors) : undefined}
    >
      <SocialShareButtons title={title} url={url} description={description} />
      <p className="mt-4 text-sm">
        Powered by <span className="font-semibold">KinshipSync</span>
      </p>
    </footer>
  );
};
