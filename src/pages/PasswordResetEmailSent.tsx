import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import tealTextLogo from '@/assets/branding/teal-text-logo.png';

const PasswordResetEmailSent = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Link to="/">
              <img src={tealTextLogo} alt="KinshipSync" className="h-12 w-auto object-contain" />
            </Link>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MailCheck size={28} aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Check Your Email</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                We&apos;ve sent a password reset link to your email. Check your inbox and spam
                folder to continue.
              </p>
            </div>
          </div>

          <Link
            to="/auth"
            className="block w-full py-4 bg-secondary hover:bg-secondary/90 rounded-full text-secondary-foreground font-bold text-center transition-all shadow-md hover:shadow-lg"
          >
            BACK TO SIGN IN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetEmailSent;
