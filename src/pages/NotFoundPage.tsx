import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotFoundPageProps {
  /** When true, renders inside dashboard shell (no full-viewport centering). */
  compact?: boolean;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ compact = false }) => {
  const navigate = useNavigate();
  const { currentUser, userProfile, loading } = useAuth();

  const resolveHomePath = (): string => {
    if (loading) return '/';
    if (!currentUser) return '/';
    const role = userProfile?.role ?? currentUser.role;
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'vendor') return '/dashboard/vendor';
    return '/dashboard/events';
  };

  const handleGoHome = () => {
    navigate(resolveHomePath());
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  };

  return (
    <>
      <Helmet>
        <title>Page not found | KinshipSync</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap"
        />
      </Helmet>

      <div
        className={cn(
          'flex flex-col items-center justify-center px-6 text-center bg-background',
          compact ? 'py-16 min-h-[60vh]' : 'min-h-screen py-12'
        )}
      >
        <div className="w-full max-w-md flex flex-col items-center">
          <div
            className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/15 ring-1 ring-secondary/25"
            aria-hidden
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-secondary/60">
              <AlertCircle className="h-7 w-7 text-secondary" strokeWidth={2} />
            </div>
          </div>

          <p
            className="text-7xl sm:text-8xl font-bold leading-none text-primary tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            404
          </p>

          <h1
            className="mt-4 text-2xl sm:text-3xl font-semibold text-primary"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Page Not Found
          </h1>

          <p className="mt-4 text-base text-muted-foreground max-w-sm leading-relaxed">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="mt-10 w-full flex flex-col gap-3 sm:gap-4">
            <Button
              type="button"
              onClick={handleGoHome}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md text-base font-medium"
            >
              <Home className="mr-2 h-5 w-5" />
              Go to Home
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoBack}
              className="w-full h-12 rounded-full border-2 border-primary text-primary hover:bg-primary/5 shadow-sm text-base font-medium"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>

          {!compact && (
            <p className="mt-8 text-sm text-muted-foreground">
              Need help?{' '}
              <Link to="/" className="text-primary font-medium hover:underline">
                Return to KinshipSync
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
