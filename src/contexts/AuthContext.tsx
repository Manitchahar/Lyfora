import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSession = useCallback(async () => {
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      throw sessionError;
    }
    return data.session?.user ?? null;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const sessionUser = await loadSession();
        if (!isMounted) return;
        setUser(sessionUser);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setUser(null);
        setError(err as Error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (!isMounted) return;
        setUser(session?.user ?? null);
        setError(null);
      })();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadSession]);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    try {
      const sessionUser = await loadSession();
      setUser(sessionUser);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadSession]);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signUp, signIn, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
