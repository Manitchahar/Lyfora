/**
 * ProgressTracking Component
 * 
 * Displays user progress statistics and activity completion charts with design system components.
 * Requirements: 2.3, 8.5, 17.3
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, Calendar, Flame, Target } from 'lucide-react';
import { Card } from '../../design-system/components/Card/Card';
import { Button } from '../../design-system/components/Button/Button';
import { Skeleton } from '../../design-system/components/Skeleton/Skeleton';

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

  // Memoize loadStats to prevent unnecessary recreations (Requirement 17.3)
  const loadStats = useCallback(async () => {
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

    // Type assertion for Supabase data
    type RoutineData = { date: string; completion_rate: number };
    const typedRoutines = (routines || []) as RoutineData[];

    let streak = 0;
    const checkDate = new Date();
    const dateMap = new Map(typedRoutines.map(r => [r.date, r.completion_rate]));

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

    const avgCompletion = typedRoutines.length > 0
      ? typedRoutines.reduce((sum, r) => sum + r.completion_rate, 0) / typedRoutines.length
      : 0;

    setStats({
      currentStreak: streak,
      totalActivities: activities?.length || 0,
      weeklyCompletion: days === 7 ? avgCompletion : stats.weeklyCompletion,
      monthlyCompletion: days === 30 ? avgCompletion : stats.monthlyCompletion,
      weeklyData,
    });

    setLoading(false);
  }, [user, timeRange]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Memoize StatCard component to prevent unnecessary re-renders (Requirement 17.3)
  const StatCard = useCallback(({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) => (
    <Card variant="elevated" padding="md" className="flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-6 h-6 text-white" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{value}</p>
      </div>
    </Card>
  ), []);

  // Memoize expensive computation of max completion (Requirement 17.3)
  const maxCompletion = useMemo(
    () => Math.max(...stats.weeklyData.map(d => d.completion), 1),
    [stats.weeklyData]
  );

  if (loading) {
    return (
      <Card variant="elevated" padding="md">
        <div className="space-y-6">
          <Skeleton width="33%" height="24px" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton height="96px" />
            <Skeleton height="96px" />
            <Skeleton height="96px" />
            <Skeleton height="96px" />
          </div>
          <div className="space-y-4">
            <Skeleton width="40%" height="20px" />
            <Skeleton height="160px" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center">
            <TrendingUp className="w-6 h-6 text-primary-500 mr-2" aria-hidden="true" />
            Your Progress
          </h2>
          <div className="flex gap-2">
            <Button
              variant={timeRange === '7' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('7')}
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === '30' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('30')}
            >
              30 Days
            </Button>
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
            color="bg-primary-500"
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
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">Activity Completion</h3>
          <div className="flex items-end gap-2 h-40">
            {stats.weeklyData.map((day, index) => {
              const height = (day.completion / maxCompletion) * 100;
              const date = new Date(day.date);
              const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-t relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 w-full bg-primary-500 rounded-t transition-all"
                      style={{ height: `${height}%` }}
                      role="progressbar"
                      aria-valuenow={day.completion}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${dayLabel}: ${Math.round(day.completion)}% completion`}
                    />
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{dayLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {stats.currentStreak >= 3 && (
        <Card variant="filled" padding="md" className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 border-2 border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-3">
            <div className="text-4xl" role="img" aria-label="Fire emoji">🔥</div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                Amazing {stats.currentStreak}-Day Streak!
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                You're building great wellness habits. Keep it up!
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
