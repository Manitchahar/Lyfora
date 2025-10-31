import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, Calendar, Flame, Target } from 'lucide-react';

interface Stats {
  currentStreak: number;
  totalActivities: number;
  weeklyCompletion: number;
  monthlyCompletion: number;
  weeklyData: { date: string; completion: number }[];
}

export function ProgressTracking() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    currentStreak: 0,
    totalActivities: 0,
    weeklyCompletion: 0,
    monthlyCompletion: 0,
    weeklyData: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');

  useEffect(() => {
    loadStats();
  }, [user, timeRange]);

  const loadStats = async () => {
    if (!user) return;

    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const { data: routines } = await supabase
      .from('daily_routines')
      .select('date, completion_rate')
      .eq('user_id', user.id)
      .gte('date', startDateStr)
      .order('date', { ascending: true });

    const { data: activities } = await supabase
      .from('activity_completions')
      .select('completed_at')
      .eq('user_id', user.id);

    let streak = 0;
    let checkDate = new Date();
    const dateMap = new Map(routines?.map(r => [r.date, r.completion_rate]) || []);

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const completionRate = dateMap.get(dateStr) || 0;

      if (completionRate > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }

      if (streak > 100) break;
    }

    const weeklyData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const completion = dateMap.get(dateStr) || 0;
      weeklyData.push({ date: dateStr, completion });
    }

    const avgCompletion = routines && routines.length > 0
      ? routines.reduce((sum, r) => sum + r.completion_rate, 0) / routines.length
      : 0;

    setStats({
      currentStreak: streak,
      totalActivities: activities?.length || 0,
      weeklyCompletion: days === 7 ? avgCompletion : stats.weeklyCompletion,
      monthlyCompletion: days === 30 ? avgCompletion : stats.monthlyCompletion,
      weeklyData,
    });

    setLoading(false);
  };

  const StatCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  const maxCompletion = Math.max(...stats.weeklyData.map(d => d.completion), 1);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <TrendingUp className="w-6 h-6 text-teal-500 mr-2" />
            Your Progress
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('7')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                timeRange === '7'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                timeRange === '30'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Flame}
            label="Current Streak"
            value={`${stats.currentStreak} days`}
            color="bg-orange-500"
          />
          <StatCard
            icon={Target}
            label="Completed Activities"
            value={stats.totalActivities}
            color="bg-teal-500"
          />
          <StatCard
            icon={Calendar}
            label="Weekly Completion"
            value={`${Math.round(timeRange === '7' ? stats.weeklyCompletion : stats.monthlyCompletion)}%`}
            color="bg-blue-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Per Day"
            value={`${(stats.totalActivities / 30).toFixed(1)}`}
            color="bg-green-500"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Completion</h3>
          <div className="flex items-end gap-2 h-40">
            {stats.weeklyData.map((day, index) => {
              const height = (day.completion / maxCompletion) * 100;
              const date = new Date(day.date);
              const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 w-full bg-teal-500 rounded-t transition-all"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{dayLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {stats.currentStreak >= 3 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🔥</div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Amazing {stats.currentStreak}-Day Streak!
              </h3>
              <p className="text-gray-600">
                You're building great wellness habits. Keep it up!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
