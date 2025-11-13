/**
 * ManualActivityLog Component
 * 
 * Manual activity logging with design system components.
 * Requirements: 2.1, 2.2, 2.3, 8.5
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Clock, Trash2, ListPlus } from 'lucide-react';
import { Card } from '../../design-system/components/Card/Card';
import { Button } from '../../design-system/components/Button/Button';
import { Input } from '../../design-system/components/Input/Input';
import { Skeleton } from '../../design-system/components/Skeleton/Skeleton';

interface ManualActivity {
  id: string;
  title: string;
  category: string;
  duration_minutes: number;
  notes: string;
  completed_at: string;
}

export function ManualActivityLog() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ManualActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'physical',
    duration_minutes: 30,
    notes: '',
  });

  useEffect(() => {
    loadActivities();
  }, [user]);

  const loadActivities = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('manual_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(10);

    setActivities(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from('manual_activities').insert({
      user_id: user.id,
      title: formData.title,
      category: formData.category,
      duration_minutes: formData.duration_minutes,
      notes: formData.notes,
    });

    if (!error) {
      setFormData({
        title: '',
        category: 'physical',
        duration_minutes: 30,
        notes: '',
      });
      setShowForm(false);
      loadActivities();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('manual_activities').delete().eq('id', id);
    loadActivities();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      physical: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300',
      mental: 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300',
      nutritional: 'bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300',
      sleep: 'bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300',
    };
    return colors[category as keyof typeof colors] || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300';
  };

  if (loading) {
    return (
      <Card variant="elevated" padding="md">
        <div className="space-y-4">
          <Skeleton width="40%" height="24px" />
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
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center">
          <ListPlus className="w-6 h-6 text-primary-500 mr-2" aria-hidden="true" />
          Activity Log
        </h2>
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowForm(!showForm)}
          icon={<Plus className="w-4 h-4" />}
        >
          Log Activity
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg space-y-4">
          <Input
            label="Activity Title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Morning yoga"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="activity-category" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Category
              </label>
              <select
                id="activity-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-11 px-4 text-base rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:ring-opacity-20 focus:outline-none transition-all duration-150 ease-out"
              >
                <option value="physical">Physical</option>
                <option value="mental">Mental</option>
                <option value="nutritional">Nutritional</option>
                <option value="sleep">Sleep</option>
              </select>
            </div>

            <Input
              label="Duration (min)"
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>

          <div>
            <label htmlFor="activity-notes" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              id="activity-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:ring-opacity-20 focus:outline-none transition-all duration-150 ease-out placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              rows={2}
              placeholder="How did it go?"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="flex-1"
            >
              Save Activity
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            <p>No activities logged yet.</p>
            <p className="text-sm mt-2">Click "Log Activity" to record your wellness activities.</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">{activity.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(activity.category)}`}>
                    {activity.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    <span>{activity.duration_minutes} min</span>
                  </div>
                  <span>{new Date(activity.completed_at).toLocaleDateString()}</span>
                </div>
                {activity.notes && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">{activity.notes}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(activity.id)}
                className="ml-4 p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-950/30 rounded-lg transition"
                aria-label={`Delete ${activity.title}`}
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
