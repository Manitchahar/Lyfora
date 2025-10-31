import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle2, Circle, Sparkles, Plus } from 'lucide-react';

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
      physical: 'bg-blue-100 text-blue-700 border-blue-200',
      mental: 'bg-green-100 text-green-700 border-green-200',
      nutritional: 'bg-orange-100 text-orange-700 border-orange-200',
      sleep: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const completedCount = activities.filter((a) => a.completed).length;
  const totalCount = activities.length;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Sparkles className="w-6 h-6 text-teal-500 mr-2" />
            Today's Wellness Routine
          </h2>
          <p className="text-gray-600 mt-1">
            {completedCount} of {totalCount} activities completed
          </p>
        </div>
        <button
          onClick={generateNewRoutine}
          className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition"
        >
          <Plus className="w-4 h-4" />
          Regenerate
        </button>
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-teal-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`border-2 rounded-lg p-4 transition cursor-pointer ${
              activity.completed ? 'bg-teal-50 border-teal-200' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => toggleActivity(activity.id)}
          >
            <div className="flex items-start">
              <div className="mt-1 mr-4">
                {activity.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-teal-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`font-semibold text-gray-800 ${activity.completed ? 'line-through' : ''}`}>
                    {activity.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(activity.category)}`}>
                    {activity.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                {activity.duration > 0 && (
                  <p className="text-xs text-gray-500">{activity.duration} minutes</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No activities for today. Click Regenerate to create your routine!</p>
        </div>
      )}
    </div>
  );
}
