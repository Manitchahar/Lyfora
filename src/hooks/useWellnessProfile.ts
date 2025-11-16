/**
 * useWellnessProfile Hook
 *
 * Centralizes wellness profile lookups so routes can consistently determine
 * whether the authenticated user has completed onboarding.
 */

import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useWellnessProfile(userId?: string | null) {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!userId) {
      setHasProfile(null);
      return null;
    }

    const { data, error } = await supabase
      .from('wellness_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const profileExists = Boolean(data);
    setHasProfile(profileExists);
    return profileExists;
  }, [userId]);

  return {
    hasProfile,
    refreshProfile,
  };
}
