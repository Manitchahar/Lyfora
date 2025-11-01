import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { LoginForm } from './components/Auth/LoginForm';
import { SignUpForm } from './components/Auth/SignUpForm';
import { OnboardingFlow } from './components/Onboarding/OnboardingFlow';
import { Dashboard } from './components/Dashboard/Dashboard';
import { LandingPage } from './components/Landing/LandingPage';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (user) {
      checkProfile();
    } else {
      setHasProfile(null);
    }
  }, [user]);

  const checkProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('wellness_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    setHasProfile(!!data);
  };

  if (authLoading || (user && hasProfile === null)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        {!showAuth ? (
          <LandingPage onGetStarted={() => setShowAuth(true)} />
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
            {authMode === 'login' ? (
              <LoginForm onToggleMode={() => setAuthMode('signup')} />
            ) : (
              <SignUpForm onToggleMode={() => setAuthMode('login')} />
            )}
          </div>
        )}
      </div>
    );
  }

  if (!hasProfile) {
    return <OnboardingFlow onComplete={() => setHasProfile(true)} />;
  }

  return <Dashboard />;
}

export default App;
