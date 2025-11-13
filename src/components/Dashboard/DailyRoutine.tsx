/**
 * DailyRoutine Component
 * 
 * Displays and manages the user's daily wellness routine with design system components.
 * Requirements: 2.1, 2.3, 8.5
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle2, Circle, Sparkles, Plus } from 'lucide-react';
import { Card } from '../../design-system/components/Card/Card';
import { Button } from '../../design-system/components/Button/Button';
import { Skeleton } from '../../design-system/components/Skeleton/Skeleton';

interface Activity {
  id: string;
  title: string;
  category: string;
  duration: number;
  description: string;
  completed: boolean;
}

interface DailyRoutineProps {
  onActivityComplete: () => void;
}

export function DailyRoutine({ onActivityComplete }: DailyRoutineProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [routineId, setRoutineId] = useState<string | null>(null);

  useEffect(() => {
    loadTodayRoutine();
  }, [user]);

  const loadTodayRoutine = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const { data: routine, error } = await supabase
      .from('daily_routines')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    if (error) {
      console.error('Error loading routine:', error);
      setLoading(false);
      return;
    }

    if (routine) {
      setRoutineId(routine.id);
      setActivities((routine.activities as Activity[]) || []);
    } else {
      await generateNewRoutine();
    }

    setLoading(false);
  };

  const generateNewRoutine = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('wellness_profiles')
      .select('goals')
      .eq('user_id', user.id)
      .maybeSingle();

    const goals = (profile?.goals as string[]) || [];
    const newActivities = generateActivitiesFromGoals(goals);

    const today = new Date().toISOString().split('T')[0];

    const { data: routine, error } = await supabase
      .from('daily_routines')
      .insert({
        user_id: user.id,
        date: today,
        activities: newActivities,
        completion_rate: 0,
      })
      .select()
      .single();

    if (!error && routine) {
      setRoutineId(routine.id);
      setActivities(newActivities);
    }
  };

  const generateActivitiesFromGoals = (goals: string[]): Activity[] => {
    const activityTemplates = {
      fitness: [
        { title: '15-minute morning stretch', category: 'physical', duration: 15, description: 'Start your day with gentle stretches to wake up your body' },
        { title: '20-minute walk or jog', category: 'physical', duration: 20, description: 'Get your heart pumping with light cardio' },
        { title: '10-minute strength exercises', category: 'physical', duration: 10, description: 'Build strength with bodyweight exercises' },
      ],
      mental_health: [
        { title: '5-minute meditation', category: 'mental', duration: 5, description: 'Calm your mind with focused breathing' },
        { title: 'Gratitude journaling', category: 'mental', duration: 10, description: 'Write down 3 things you\'re grateful for' },
        { title: 'Mindful breathing practice', category: 'mental', duration: 5, description: 'Practice box breathing: 4-4-4-4' },
      ],
      nutrition: [
        { title: 'Drink 8 glasses of water', category: 'nutritional', duration: 0, description: 'Stay hydrated throughout the day' },
        { title: 'Prepare a balanced meal', category: 'nutritional', duration: 30, description: 'Include protein, vegetables, and whole grains' },
        { title: 'Eat mindfully', category: 'nutritional', duration: 20, description: 'Focus on your meal without distractions' },
      ],
      sleep: [
        { title: 'Set a consistent bedtime', category: 'sleep', duration: 0, description: 'Aim for 7-9 hours of sleep' },
        { title: 'Evening wind-down routine', category: 'sleep', duration: 30, description: 'No screens 30 minutes before bed' },
      ],
      stress: [
        { title: 'Take a nature break', category: 'mental', duration: 15, description: 'Spend time outdoors to reduce stress' },
        { title: 'Progressive muscle relaxation', category: 'mental', duration: 10, description: 'Release tension in your body' },
      ],
    };

    const selectedActivities: Activity[] = [];
    const categoriesUsed = new Set<string>();

    goals.forEach((goal) => {
      const templates = activityTemplates[goal as keyof typeof activityTemplates] || [];
      if (templates.length > 0) {
        const randomActivity = templates[Math.floor(Math.random() * templates.length)];
        if (!categoriesUsed.has(randomActivity.category) && selectedActivities.length < 5) {
          selectedActivities.push({
            ...randomActivity,
            id: `${goal}-${Date.now()}-${Math.random()}`,
            completed: false,
          });
          categoriesUsed.add(randomActivity.category);
        }
      }
    });

    return selectedActivities.slice(0, 5);
  };

  const toggleActivity = async (activityId: string) => {
    if (!user || !routineId) return;

    const updatedActivities = activities.map((activity) =>
      activity.id === activityId ? { ...activity, completed: !activity.completed } : activity
    );

    setActivities(updatedActivities);

    const completedCount = updatedActivities.filter((a) => a.completed).length;
    const completionRate = (completedCount / updatedActivities.length) * 100;

    await supabase
      .from('daily_routines')
      .update({
        activities: updatedActivities,
        completion_rate: completionRate,
        updated_at: new Date().toISOString(),
      })
      .eq('id', routineId);

    const activity = updatedActivities.find((a) => a.id === activityId);
    if (activity?.completed) {
      await supabase.from('activity_completions').insert({
        user_id: user.id,
        routine_id: routineId,
        activity_id: activityId,
        activity_title: activity.title,
        activity_category: activity.category,
      });
    } else {
      await supabase
        .from('activity_completions')
        .delete()
        .eq('routine_id', routineId)
        .eq('activity_id', activityId);
    }

    onActivityComplete();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      physical: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      mental: 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      nutritional: 'bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      sleep: 'bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    };
    return colors[category as keyof typeof colors] || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
  };

  const completedCount = activities.filter((a) => a.completed).length;
  const totalCount = activities.length;

  if (loading) {
    return (
      <Card variant="elevated" padding="md">
        <div className="space-y-4">
          <Skeleton width="33%" height="24px" />
          <Skeleton height="80px" />
          <Skeleton height="80px" />
          <Skeleton height="80px" />
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center">
            <Sparkles className="w-6 h-6 text-primary-500 mr-2" aria-hidden="true" />
            Today's Wellness Routine
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {completedCount} of {totalCount} activities completed
          </p>
        </div>
        <Button
          variant="tertiary"
          size="md"
          onClick={generateNewRoutine}
          icon={<Plus className="w-4 h-4" />}
        >
          Regenerate
        </Button>
      </div>

      <div className="mb-6">
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
          <div
            className="bg-primary-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`border-2 rounded-lg p-4 transition cursor-pointer ${
              activity.completed 
                ? 'bg-primary-50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800' 
                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
            }`}
            onClick={() => toggleActivity(activity.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleActivity(activity.id);
              }
            }}
            aria-label={`${activity.completed ? 'Mark as incomplete' : 'Mark as complete'}: ${activity.title}`}
          >
            <div className="flex items-start">
              <div className="mt-1 mr-4">
                {activity.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-primary-500" aria-hidden="true" />
                ) : (
                  <Circle className="w-6 h-6 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`font-semibold text-neutral-900 dark:text-neutral-50 ${activity.completed ? 'line-through' : ''}`}>
                    {activity.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(activity.category)}`}>
                    {activity.category}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{activity.description}</p>
                {activity.duration > 0 && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">{activity.duration} minutes</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">No activities for today. Click Regenerate to create your routine!</p>
        </div>
      )}
    </Card>
  );
}
