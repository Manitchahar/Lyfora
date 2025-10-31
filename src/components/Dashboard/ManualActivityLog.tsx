import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Clock, Trash2, ListPlus } from 'lucide-react';

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
      physical: 'bg-blue-100 text-blue-700',
      mental: 'bg-green-100 text-green-700',
      nutritional: 'bg-orange-100 text-orange-700',
      sleep: 'bg-purple-100 text-purple-700',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

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
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <ListPlus className="w-6 h-6 text-teal-500 mr-2" />
          Activity Log
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Log Activity
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              placeholder="e.g., Morning yoga"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="physical">Physical</option>
                <option value="mental">Mental</option>
                <option value="nutritional">Nutritional</option>
                <option value="sleep">Sleep</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              rows={2}
              placeholder="How did it go?"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Save Activity
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No activities logged yet.</p>
            <p className="text-sm mt-2">Click "Log Activity" to record your wellness activities.</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(activity.category)}`}>
                    {activity.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{activity.duration_minutes} min</span>
                  </div>
                  <span>{new Date(activity.completed_at).toLocaleDateString()}</span>
                </div>
                {activity.notes && (
                  <p className="text-sm text-gray-600 mt-2">{activity.notes}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(activity.id)}
                className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
