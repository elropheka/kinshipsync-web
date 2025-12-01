import React from 'react';
import type { Event, WebsitePayload } from '@/types/eventTypes';
import type { ThemeColors } from '@/types/themeTypes';
import { useAllThemes } from '@/hooks/useAllThemes';
import { cn } from '@/lib/utils';
import { MetaTags } from '@/components/common/MetaTags';
import { getEventWebsiteUrl } from '@/utils/eventUrlUtils';
import { CalendarDays, MapPin, ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventSiteFooter } from '@/components/eventSite/EventSiteFooter';

interface EventSitePageProps {
  event: Event;
  websiteDetails: WebsitePayload;
}

const getThemeStyles = (colors: ThemeColors) => ({
  '--theme-primary': colors.primary,
  '--theme-secondary': colors.secondary,
  '--theme-accent': colors.accent,
  '--theme-background': colors.background,
  '--theme-background-secondary': colors.backgroundSecondary,
  '--theme-text': colors.text,
  '--theme-text-muted': colors.textMuted,
  '--theme-border': colors.border,
  '--theme-primary-contrast': colors.primaryContrastText,
});

export const EventSitePage: React.FC<EventSitePageProps> = ({ event, websiteDetails }) => {
  const { allThemes, isLoading: isLoadingThemes } = useAllThemes();
  const theme = allThemes.find(t => t.id === (websiteDetails.websiteThemeId || event.themeId));

  const isLoading = isLoadingThemes;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-blue-400 animate-pulse mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Loading Event</h2>
          <p className="text-slate-500">Preparing your experience...</p>
        </div>
      </div>
    );
  }

  if (!theme) {
    console.warn('Theme not found, using default styles');
  }

  if (!event || !websiteDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Event Not Found</h1>
          <p className="text-slate-600 leading-relaxed">
            The event you're looking for might have been removed or is not available.
          </p>
          <Link 
            to="/dashboard/events" 
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={websiteDetails.title || event.name}
        description={websiteDetails.welcomeMessage || event.description || `Join us for ${event.name} on ${new Date(event.date).toLocaleDateString()}`}
        image={websiteDetails.headerImageUrl}
        type="event"
        url={getEventWebsiteUrl(websiteDetails.customUrlSlug || '')}
      />
      <div 
        className="min-h-screen"
        style={theme ? {
          ...getThemeStyles(theme.colors),
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          fontFamily: theme.fonts.body.fontFamily,
        } as React.CSSProperties : {
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        }}
      >
        {/* Enhanced Navigation */}
        <nav className="absolute top-6 left-6 z-20">
          <Link 
            to="/dashboard/events" 
            className="group inline-flex items-center gap-3 px-4 py-2 bg-white/90 backdrop-blur-sm border border-white/20 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300"
            style={theme ? { 
              backgroundColor: `${theme.colors.primary}15`,
              borderColor: `${theme.colors.primary}30`,
              color: theme.colors.primary 
            } : undefined}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Events</span>
          </Link>
        </nav>

        {/* Enhanced Hero Section */}
        <header className="relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
          {/* Background Image with Enhanced Overlay */}
          {websiteDetails.headerImageUrl && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center scale-105"
                style={{ backgroundImage: `url(${websiteDetails.headerImageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
            </>
          )}
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto z-10">
            <div className="space-y-8 animate-fade-in">
              {/* Event Title */}
              <h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight"
                style={theme ? { 
                  fontFamily: theme.fonts.heading.fontFamily,
                  color: theme.colors.primaryContrastText || 'hsl(var(--primary-foreground))',
                  textShadow: '0 4px 20px hsl(var(--foreground) / 0.5)'
                } : {
                  color: 'hsl(var(--primary-foreground))',
                  textShadow: '0 4px 20px hsl(var(--foreground) / 0.5)'
                }}
              >
                {websiteDetails.title || event.name}
              </h1>

              {/* Event Date */}
              <div className="flex items-center justify-center gap-4 text-xl md:text-2xl text-white/90">
                <CalendarDays className="w-6 h-6" />
                <span className="font-medium">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              {/* Time and Location */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-lg text-white/80">
                {event.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button 
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold text-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                  style={theme ? {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                    color: theme.colors.primaryContrastText
                  } : undefined}
                >
                  Learn More
                </button>
              </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Message Section */}
        {websiteDetails.welcomeMessage && (
          <section className="py-10 px-4 sm:px-6 md:py-20">
            <div className="max-w-4xl mx-auto">
              <div 
                className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-white/20"
                style={theme ? {
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                } : undefined}
              >
                <div className="text-center">
                  <div 
                    className="w-16 h-1 mx-auto mb-8 rounded-full"
                    style={theme ? {
                      backgroundColor: theme.colors.primary
                    } : {
                      backgroundColor: 'hsl(var(--primary))'
                    }}
                  ></div>
                  <p 
                    className="text-lg sm:text-xl md:text-2xl leading-relaxed font-light"
                    style={theme ? { color: theme.colors.text } : undefined}
                  >
                    {websiteDetails.welcomeMessage}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Event Details Grid */}
        <section className="py-10 px-4 sm:px-6 md:py-20">
          <div className="max-w-6xl mx-auto">
            <h2 
              className="text-3xl sm:text-4xl font-bold text-center mb-10 md:mb-16"
              style={theme ? { 
                fontFamily: theme.fonts.heading.fontFamily,
                color: theme.colors.primary 
              } : { color: 'hsl(var(--foreground))' }}
            >
              Event Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Date Card */}
              <div 
                className="group p-6 sm:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={theme ? {
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                } : undefined}
              >
                <div className="text-center">
                  <div 
                    className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={theme ? {
                      backgroundColor: theme.colors.primary + '20',
                      color: theme.colors.primary
                    } : {
                      backgroundColor: 'hsl(var(--primary) / 0.2)',
                      color: 'hsl(var(--primary))'
                    }}
                  >
                    <CalendarDays className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h3 
                    className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3"
                    style={theme ? { color: theme.colors.primary } : { color: 'hsl(var(--foreground))' }}
                  >
                    Date
                  </h3>
                  <p className="text-base sm:text-lg font-medium">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Time Card */}
              {event.time && (
                <div 
                  className="group p-6 sm:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  style={theme ? {
                    backgroundColor: theme.colors.accent + '20',
                    color: theme.colors.accent
                  } : {
                    backgroundColor: 'hsl(var(--accent) / 0.2)',
                    color: 'hsl(var(--accent))'
                  }}
                >
                  <div className="text-center">
                    <div 
                      className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={theme ? {
                        backgroundColor: theme.colors.accent + '20',
                        color: theme.colors.accent
                      } : {
                        backgroundColor: 'hsl(var(--accent) / 0.2)',
                        color: 'hsl(var(--accent))'
                      }}
                    >
                      <Clock className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h3 
                      className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3"
                      style={theme ? { color: theme.colors.primary } : { color: 'hsl(var(--foreground))' }}
                    >
                      Time
                    </h3>
                    <p className="text-base sm:text-lg font-medium">{event.time}</p>
                  </div>
                </div>
              )}

              {/* Location Card */}
              {event.location && (
                <div 
                  className={cn(
                    "group p-6 sm:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2",
                    !event.time && "md:col-span-2 lg:col-span-1"
                  )}
                  style={theme ? {
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderColor: theme.colors.border,
                  } : undefined}
                >
                  <div className="text-center">
                    <div 
                      className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={theme ? {
                        backgroundColor: theme.colors.secondary + '20',
                        color: theme.colors.secondary
                      } : {
                        backgroundColor: 'hsl(var(--secondary) / 0.2)',
                        color: 'hsl(var(--secondary))'
                      }}
                    >
                      <MapPin className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h3 
                      className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3"
                      style={theme ? { color: theme.colors.primary } : { color: 'hsl(var(--foreground))' }}
                    >
                      Location
                    </h3>
                    <p className="text-base sm:text-lg font-medium">{event.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Dynamic Sections */}
        {websiteDetails.sections?.map((section, index) => (
          <section 
            key={section.id} 
            className={cn(
              "py-10 px-4 sm:px-6 md:py-20",
              index % 2 === 1 && "bg-gradient-to-r from-slate-50/50 to-transparent"
            )}
            style={{
              ...(index % 2 === 1 && theme ? {
                backgroundColor: theme.colors.backgroundSecondary,
              } : {}),
              order: section.order
            }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <div 
                  className="w-16 h-1 mx-auto mb-6 md:mb-8 rounded-full"
                  style={theme ? {
                    backgroundColor: theme.colors.primary
                  } : {
                    backgroundColor: 'hsl(var(--primary))'
                  }}
                ></div>
                <h2 
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6"
                  style={theme ? { 
                    fontFamily: theme.fonts.heading.fontFamily,
                    color: theme.colors.primary 
                  } : { color: 'hsl(var(--foreground))' }}
                >
                  {section.title}
                </h2>
              </div>
              
              <div 
                className="prose prose-lg sm:prose-xl max-w-none text-center leading-relaxed"
                style={theme ? { color: theme.colors.text } : undefined}
              >
                {section.content}
              </div>
            </div>
          </section>
        ))}
      </div>
      
      <EventSiteFooter
        title={websiteDetails.title || event.name}
        url={getEventWebsiteUrl(websiteDetails.customUrlSlug || '')}
        description={websiteDetails.welcomeMessage || event.description}
        themeColors={theme?.colors}
      />
    </>
  );
};
