import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'sonner';
import { auth } from '@/services/firebaseConfig';
import { getErrorMessage } from '@/lib/errorUtils';
import tealTextLogo from '@/assets/branding/teal-text-logo.png';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, trimmed);
      navigate('/auth/password-reset-sent', { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Link to="/">
              <img src={tealTextLogo} alt="KinshipSync" className="h-12 w-auto object-contain" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/30 pl-4 pr-10 bg-card text-foreground"
                required
                autoComplete="email"
              />
              <Mail className="absolute right-3 top-4 text-muted-foreground" size={20} />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-secondary hover:bg-secondary/90 rounded-full text-secondary-foreground font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/auth" className="text-secondary hover:underline font-medium">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
