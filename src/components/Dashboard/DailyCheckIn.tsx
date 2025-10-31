import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, Zap, Moon, MessageSquare } from 'lucide-react';

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
        <Icon className="w-5 h-5 text-gray-600" />
        <label className="text-sm font-medium text-gray-700">{label}</label>
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
                ? 'border-teal-500 bg-teal-50 text-teal-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            } ${hasCheckedIn ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {rating}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Daily Check-In</h2>
        {hasCheckedIn && (
          <span className="text-sm text-teal-600 font-medium">✓ Completed Today</span>
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

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Hours of sleep</label>
          <input
            type="number"
            value={data.sleepHours}
            onChange={(e) => setData({ ...data, sleepHours: parseFloat(e.target.value) || 0 })}
            disabled={hasCheckedIn}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition disabled:opacity-60"
            min="0"
            max="24"
            step="0.5"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
          </div>
          <textarea
            value={data.notes}
            onChange={(e) => setData({ ...data, notes: e.target.value })}
            disabled={hasCheckedIn}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition disabled:opacity-60"
            rows={3}
            placeholder="How are you feeling today?"
          />
        </div>

        {!hasCheckedIn && (
          <button
            onClick={handleSubmit}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition"
          >
            Complete Check-In
          </button>
        )}
      </div>
    </div>
  );
}
