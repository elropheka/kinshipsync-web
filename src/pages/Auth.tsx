import { useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { Mail, Hash, User, Eye, EyeOff, MapPin } from 'lucide-react';
import { auth } from '@/services/firebaseConfig'; // Import Firebase auth instance
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile, 
} from 'firebase/auth';
import { firestore } from '@/services/firebaseConfig'; // Import Firestore instance
import { doc, setDoc, serverTimestamp, getDoc, FieldValue } from 'firebase/firestore'; // Import Firestore functions
import Logo from '@/assets/logo_l.png'; 
import GoogleIcon from '@/assets/google.png'; // Assuming you have a Google icon SVG file
import { useNavigate } from 'react-router-dom'; // For redirecting after auth
import { Link } from 'react-router-dom'; // For navigation links

// Type for writing to the 'profiles' Firestore collection
interface FirestoreProfileWriteData {
  userId: string;
  displayName: string;
  displayName_lowercase: string; // Added for search
  email: string;
  phoneNumber?: string;
  address?: {
    city?: string;
    // Add other address fields if necessary, matching FirestoreProfile in AuthContext
  };
  role: 'user' | 'admin' | 'vendor'; // Single role string
  isAdmin: boolean;
  isVendor: boolean;
  createdAt: FieldValue;
  updatedAt: FieldValue;
  // Add any other fields that are part of the 'profiles' document structure
  // e.g., bio, avatarUrl, etc., if they should be set on creation
  firstName?: string;
  firstName_lowercase?: string; // Added for search
  lastName?: string;
  lastName_lowercase?: string; // Added for search
  bio?: string;
  avatarUrl?: string | null;
}


const Auth = () => {
  const navigate = useNavigate(); // For redirecting after auth
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // Separate loading for Google

  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    password: '',
    acceptTerms: false,
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSignupData({
      ...signupData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);
      const user = userCredential.user;

      // 1. Update Firebase Auth profile
      await updateProfile(user, { displayName: signupData.fullName });

      // 2. Create user profile document in Firestore 'profiles' collection
      const profileDocRef = doc(firestore, "profiles", user.uid); // Changed "users" to "profiles"
      const newProfileData: FirestoreProfileWriteData = {
        userId: user.uid,
        displayName: signupData.fullName,
        displayName_lowercase: signupData.fullName.toLowerCase(),
        email: user.email || signupData.email,
        phoneNumber: signupData.phoneNumber || '',
        address: { 
          city: signupData.location || '',
        },
        role: 'user', // Set role as string
        isAdmin: false,
        isVendor: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Initialize other optional fields from FirestoreProfile if desired
        firstName: signupData.fullName.split(' ')[0] || '', // Basic split for first name
        firstName_lowercase: (signupData.fullName.split(' ')[0] || '').toLowerCase(),
        lastName: signupData.fullName.split(' ').slice(1).join(' ') || '', // Basic split for last name
        lastName_lowercase: (signupData.fullName.split(' ').slice(1).join(' ') || '').toLowerCase(),
        bio: '',
        avatarUrl: user.photoURL || null,
      };
      await setDoc(profileDocRef, newProfileData);

      console.log('Signup successful, Auth profile updated, Firestore profile in "profiles" created:', user);
      // Navigation will be handled by AuthContext listener in App.tsx
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      toast.error(errorMsg);
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      navigate('/'); // Redirect to home 
      console.log('Login successful:', userCredential.user);
      // Navigation will be handled by AuthContext listener in App.tsx
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      toast.error(errorMsg);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate('/'); // Redirect to home after successful Google sign-in
      console.log('Google Sign-In successful:', user);


      // Check if user profile already exists in Firestore 'profiles' collection, if not, create one
      const profileDocRef = doc(firestore, "profiles", user.uid); // Changed "users" to "profiles"
      const docSnap = await getDoc(profileDocRef);

      if (!docSnap.exists()) {
        const newGoogleProfileData: FirestoreProfileWriteData = {
          userId: user.uid,
          displayName: user.displayName || "Google User",
          displayName_lowercase: (user.displayName || "Google User").toLowerCase(),
          email: user.email || "",
          phoneNumber: user.phoneNumber || '', 
          address: { city: '' }, // Or try to derive from Google if possible, else default
          role: 'user', // Set role as string
          isAdmin: false,
          isVendor: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          // Initialize other optional fields
          firstName: user.displayName?.split(' ')[0] || '',
          firstName_lowercase: (user.displayName?.split(' ')[0] || '').toLowerCase(),
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          lastName_lowercase: (user.displayName?.split(' ').slice(1).join(' ') || '').toLowerCase(),
          bio: '',
          avatarUrl: user.photoURL || null,
        };
        await setDoc(profileDocRef, newGoogleProfileData);
        navigate('/'); // Redirect to home after creating profile
        console.log('New Firestore profile in "profiles" created for Google user:', user.uid);
      } else {
        navigate('/'); // Redirect to home if profile already exists
        console.log('Existing Firestore profile in "profiles" found for Google user:', user.uid);
        // Optionally, update existing profile with fresh data from Google if needed, e.g., displayName or avatarUrl
        // For example: await updateDoc(userDocRef, { displayName: user.displayName, updatedAt: serverTimestamp() });
      }
      // Navigation will be handled by AuthContext listener in App.tsx
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      toast.error(errorMsg);
      console.error('Google Sign-In error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen bg-muted w-full overflow-hidden md:h-screen">
      {/* Left side - Logo */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-r from-primary/10 to-primary/20">
        <Link to="/" className="text-4xl font-bold text-primary">
          <img src={Logo} alt="Kinship Logo" />
        </Link>
      </div>

      {/* Right side - Authentication */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center py-8 px-4 sm:px-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div className="">
            <h1 className="text-3xl font-bold text-foreground">
              {activeTab === 'signup' ? 'Create an Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {activeTab === 'signup'
                ? 'Sign up to unlock exclusive features and a seamless experience on Kinship'
                : 'Sign in to continue your seamless experience on Kinship'}
            </p>
          </div>


          {/* Tab buttons */}
          <div className="flex space-x-2 mb-6 rounded-full bg-gray-100 dark:bg-gray-800 h-16 p-1">
            <button
              onClick={() => setActiveTab('signup')}
              className={`rounded-full py-2 px-6 font-medium flex-1 transition-colors ${activeTab === 'signup' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              disabled={loading || googleLoading}
            >
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`rounded-full py-2 px-6 font-medium flex-1 transition-colors ${activeTab === 'login' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              disabled={loading || googleLoading}
            >
              Sign In
            </button>
          </div>

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <form key="signup-form" onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  value={signupData.fullName}
                  onChange={handleSignupChange}
                  className="w-full p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 pl-4 pr-10 bg-white text-foreground"
                  required
                />
                <User className="absolute right-3 top-4 text-muted-foreground" size={20} />
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="w-full p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 pl-4 pr-10 bg-white text-foreground"
                  required
                />
                <Mail className="absolute right-3 top-4 text-muted-foreground" size={20} />
              </div>

              <div className="relative">
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={signupData.phoneNumber}
                  onChange={handleSignupChange}
                  className="w-full p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 pl-4 pr-10 bg-white text-foreground"
                />
                <Hash className="absolute right-3 top-4 text-muted-foreground" size={20} />
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={signupData.location}
                  onChange={handleSignupChange}
                  className="w-full p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 pl-4 pr-10 bg-white text-foreground"
                  required
                />
                <MapPin className="absolute right-3 top-4 text-muted-foreground" size={20} />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className="w-full p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 pl-4 pr-10 bg-white text-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-4 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  id="acceptTerms"
                  checked={signupData.acceptTerms}
                  onChange={handleSignupChange}
                  className="h-4 w-4 text-primary focus:ring-primary/20 border-border rounded"
                  required
                />
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-muted-foreground">
                  Accept{' '}
                  <a href="#" className="text-primary hover:underline">
                    Terms & Conditions
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary hover:bg-primary/90 rounded-full text-primary-foreground font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={loading || googleLoading}
              >
                {loading ? 'SIGNING UP...' : 'SIGN UP'}
              </button>

              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-border absolute w-full"></div>
                <span className="bg-background px-4 text-sm text-muted-foreground relative">
                  or sign up with
                </span>
              </div>

              {/* Updated for Google Sign-In only */}
              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center py-3 px-4 border border-border rounded-full shadow-sm hover:shadow-md transition-all text-foreground font-medium disabled:opacity-50 w-full"
                  disabled={loading || googleLoading}
                >
                  <img src={GoogleIcon} alt="Google" className="w-5 h-5 mr-3" />
                  {googleLoading && activeTab === 'signup' ? 'Processing with Google...' : 'Sign up with Google'}
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-muted-foreground text-sm">
                  Already have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => setActiveTab('login')} 
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Sign In Form */}
          {activeTab === 'login' && (
            <form key="login-form" onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 pl-4 pr-10 bg-white text-foreground"
                  required
                />
                <Mail className="absolute right-3 top-4 text-muted-foreground" size={20} />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 pl-4 pr-10 bg-white text-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-4 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    checked={loginData.rememberMe}
                    onChange={handleLoginChange}
                    className="h-4 w-4 text-primary focus:ring-primary/20 border-border rounded bg-white"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary hover:bg-primary/90 rounded-full text-primary-foreground font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={loading || googleLoading}
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>

              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-border absolute w-full"></div>
                <span className="bg-background px-4 text-sm text-muted-foreground relative">
                  or sign in with
                </span>
              </div>

              {/* Updated for Google Sign-In only */}
              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center py-3 px-4 border border-border rounded-full shadow-sm hover:shadow-md transition-all text-foreground font-medium disabled:opacity-50 w-full"
                  disabled={loading || googleLoading}
                >
                  <img src={GoogleIcon} alt="Google" className="w-5 h-5 mr-3" />
                  {googleLoading && activeTab === 'login' ? 'Processing with Google...' : 'Sign in with Google'}
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-muted-foreground text-sm">
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => setActiveTab('signup')} 
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
