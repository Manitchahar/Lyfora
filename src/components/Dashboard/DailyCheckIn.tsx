/**
 * DailyCheckIn Component
 * 
 * Daily wellness check-in form with design system components.
 * Requirements: 2.1, 2.2, 8.5
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, Zap, Moon, MessageSquare } from 'lucide-react';
import { Card } from '../../design-system/components/Card/Card';
import { Button } from '../../design-system/components/Button/Button';
import { Input } from '../../design-system/components/Input/Input';
import { Skeleton } from '../../design-system/components/Skeleton/Skeleton';

interface CheckInData {
  mood: number;
  energy: number;
  sleepQuality: number;
  sleepHours: number;
  notes: string;
}

export function DailyCheckIn() {
  const { user } = useAuth();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CheckInData>({
    mood: 3,
    energy: 3,
    sleepQuality: 3,
    sleepHours: 7,
    notes: '',
  });

  useEffect(() => {
    checkTodayCheckIn();
  }, [user]);

  const checkTodayCheckIn = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const { data: checkin } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    if (checkin) {
      setHasCheckedIn(true);
      setData({
        mood: checkin.mood || 3,
        energy: checkin.energy || 3,
        sleepQuality: checkin.sleep_quality || 3,
        sleepHours: checkin.sleep_hours || 7,
        notes: checkin.notes || '',
      });
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase.from('daily_checkins').upsert({
      user_id: user.id,
      date: today,
      mood: data.mood,
      energy: data.energy,
      sleep_quality: data.sleepQuality,
      sleep_hours: data.sleepHours,
      notes: data.notes,
    });

    if (!error) {
      setHasCheckedIn(true);
    }
  };

  const RatingScale = ({ label, value, onChange, icon: Icon }: { label: string; value: number; onChange: (value: number) => void; icon: React.ElementType }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            disabled={hasCheckedIn}
            className={`flex-1 py-3 rounded-lg border-2 transition font-medium ${
              value === rating
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300'
                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-600 dark:text-neutral-400'
            } ${hasCheckedIn ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label={`Rating ${rating}`}
          >
            {rating}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card variant="elevated" padding="md">
        <div className="space-y-6">
          <Skeleton width="40%" height="24px" />
          <div className="space-y-4">
            <Skeleton height="80px" />
            <Skeleton height="80px" />
            <Skeleton height="80px" />
            <Skeleton height="48px" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">Daily Check-In</h2>
        {hasCheckedIn && (
          <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">✓ Completed Today</span>
        )}
      </div>

      <div className="space-y-6">
        <RatingScale
          label="How's your mood?"
          value={data.mood}
          onChange={(v) => setData({ ...data, mood: v })}
          icon={Heart}
        />

        <RatingScale
          label="Energy level?"
          value={data.energy}
          onChange={(v) => setData({ ...data, energy: v })}
          icon={Zap}
        />

        <RatingScale
          label="Sleep quality?"
          value={data.sleepQuality}
          onChange={(v) => setData({ ...data, sleepQuality: v })}
          icon={Moon}
        />

        <Input
          label="Hours of sleep"
          type="number"
          value={data.sleepHours}
          onChange={(e) => setData({ ...data, sleepHours: parseFloat(e.target.value) || 0 })}
          disabled={hasCheckedIn}
          min="0"
          max="24"
          step="0.5"
        />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
            <label htmlFor="checkin-notes" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Notes (Optional)</label>
          </div>
          <textarea
            id="checkin-notes"
            value={data.notes}
            onChange={(e) => setData({ ...data, notes: e.target.value })}
            disabled={hasCheckedIn}
            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:ring-opacity-20 outline-none transition-all duration-150 ease-out placeholder:text-neutral-400 dark:placeholder:text-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50 dark:disabled:bg-neutral-900"
            rows={3}
            placeholder="How are you feeling today?"
            aria-label="Check-in notes"
          />
        </div>

        {!hasCheckedIn && (
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            className="w-full"
          >
            Complete Check-In
          </Button>
        )}
      </div>
    </Card>
  );
}
