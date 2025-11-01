import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DailyRoutine } from './DailyRoutine';
import { DailyCheckIn } from './DailyCheckIn';
import { ProgressTracking } from './ProgressTracking';
import { ManualActivityLog } from './ManualActivityLog';
import { WellnessAssistant } from './WellnessAssistant';



import { LogOut, Sparkles } from 'lucide-react';

export function Dashboard() {
  const { signOut } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivityComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Lyfora</h1>
                <p className="text-sm text-gray-600">Your Wellness Companion</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600">
            Let's continue your wellness journey today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DailyRoutine onActivityComplete={handleActivityComplete} />
            <ProgressTracking key={refreshKey} />
            <ManualActivityLog />
          </div>

          <div className="space-y-6">
            <DailyCheckIn />

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Wellness Tips</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-900 mb-1">Stay Hydrated</h4>
                  <p className="text-sm text-blue-700">
                    Drink water throughout the day to maintain energy and focus.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h4 className="font-medium text-green-900 mb-1">Move Regularly</h4>
                  <p className="text-sm text-green-700">
                    Take short breaks to stretch or walk every hour.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <h4 className="font-medium text-purple-900 mb-1">Quality Sleep</h4>
                  <p className="text-sm text-purple-700">
                    Maintain a consistent sleep schedule for better rest.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WellnessAssistant />
    </div>
  );
}
