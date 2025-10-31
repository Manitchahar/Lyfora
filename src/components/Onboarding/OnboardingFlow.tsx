import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, Target, Clock, ArrowRight } from 'lucide-react';

interface OnboardingData {
  fullName: string;
  age: number;
  goals: string[];
  currentChallenges: string;
  preferredActivityTime: string;
}

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    age: 0,
    goals: [],
    currentChallenges: '',
    preferredActivityTime: 'morning',
  });

  const goalOptions = [
    { id: 'fitness', label: 'Physical Fitness', icon: '💪' },
    { id: 'mental_health', label: 'Mental Health', icon: '🧘' },
    { id: 'nutrition', label: 'Better Nutrition', icon: '🥗' },
    { id: 'sleep', label: 'Quality Sleep', icon: '😴' },
    { id: 'stress', label: 'Stress Management', icon: '🌿' },
  ];

  const timeOptions = [
    { id: 'morning', label: 'Morning', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon', icon: '☀️' },
    { id: 'evening', label: 'Evening', icon: '🌙' },
  ];

  const toggleGoal = (goalId: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);

    const { error } = await supabase.from('wellness_profiles').insert({
      user_id: user.id,
      full_name: data.fullName,
      age: data.age,
      goals: data.goals,
      current_challenges: data.currentChallenges,
      preferred_activity_time: data.preferredActivityTime,
    });

    setLoading(false);

    if (!error) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full mx-1 transition ${
                  s <= step ? 'bg-teal-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center">Step {step} of 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-teal-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
              Welcome to Lyfora
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Let's personalize your wellness journey
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => setData({ ...data, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={data.age || ''}
                onChange={(e) => setData({ ...data, age: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                placeholder="Your age"
                min="1"
                max="120"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!data.fullName || !data.age}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              Continue <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-teal-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
              What are your wellness goals?
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Select all that apply
            </p>

            <div className="grid grid-cols-1 gap-4">
              {goalOptions.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-4 border-2 rounded-lg transition ${
                    data.goals.includes(goal.id)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{goal.icon}</span>
                    <span className="text-lg font-medium text-gray-800">{goal.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Challenges (Optional)
              </label>
              <textarea
                value={data.currentChallenges}
                onChange={(e) => setData({ ...data, currentChallenges: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                rows={3}
                placeholder="Tell us about any health challenges you're facing..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={data.goals.length === 0}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Continue <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-teal-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
              When do you prefer to be active?
            </h2>
            <p className="text-gray-600 text-center mb-8">
              We'll schedule activities based on your preference
            </p>

            <div className="grid grid-cols-1 gap-4">
              {timeOptions.map((time) => (
                <button
                  key={time.id}
                  onClick={() => setData({ ...data, preferredActivityTime: time.id })}
                  className={`p-4 border-2 rounded-lg transition ${
                    data.preferredActivityTime === time.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{time.icon}</span>
                    <span className="text-lg font-medium text-gray-800">{time.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Completing...' : 'Complete Setup'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
