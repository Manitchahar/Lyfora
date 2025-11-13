import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, Target, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../design-system/components/Button/Button';
import { Input } from '../../design-system/components/Input/Input';
import { Card } from '../../design-system/components/Card/Card';

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

    try {
      // @ts-ignore - Supabase type inference issue with wellness_profiles table
      const { error } = await supabase.from('wellness_profiles').insert({
        user_id: user.id,
        full_name: data.fullName,
        age: data.age,
        goals: data.goals,
        current_challenges: data.currentChallenges || null,
        preferred_activity_time: data.preferredActivityTime,
      });

      if (error) {
        console.error('Error saving onboarding data:', error);
      } else {
        onComplete();
      }
    } catch (err) {
      console.error('Unexpected error during onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for smooth page transitions (Requirement 12.2)
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    duration: 0.3,
    ease: 'easeInOut' as const
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4 transition-colors duration-200">
      <Card 
        variant="elevated" 
        padding="lg" 
        className="w-full max-w-2xl"
      >
        {/* Progress indicator with smooth animations (Requirements 10.3, 12.2) */}
        <div className="mb-8">
          <div className="flex justify-between mb-4 gap-2">
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                  s <= step 
                    ? 'bg-primary-500' 
                    : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: s <= step ? 1 : 1 }}
                transition={{ duration: 0.3, delay: s * 0.1 }}
              />
            ))}
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
            Step {step} of 3
          </p>
        </div>

        {/* Animated step content (Requirement 12.2) */}
        <AnimatePresence mode="wait">

          {step === 1 && (
            <motion.div 
              key="step1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="space-y-6"
            >
              {/* Icon with consistent spacing (Requirement 10.3, 10.4) */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-950 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
              </div>

              {/* Typography with consistent scale (Requirement 10.4) */}
              <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 text-center mb-2">
                Welcome to Lyfora
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-center mb-8">
                Let's personalize your wellness journey
              </p>

              {/* Design system Input components (Requirements 2.2, 10.3) */}
              <Input
                label="Full Name"
                type="text"
                value={data.fullName}
                onChange={(e) => setData({ ...data, fullName: e.target.value })}
                placeholder="Your name"
                required
              />

              <Input
                label="Age"
                type="number"
                value={data.age || ''}
                onChange={(e) => setData({ ...data, age: parseInt(e.target.value) || 0 })}
                placeholder="Your age"
                required
                min={1}
                max={120}
              />

              {/* Design system Button with proper navigation (Requirements 2.1, 6.1) */}
              <Button
                onClick={() => setStep(2)}
                disabled={!data.fullName || !data.age}
                variant="primary"
                size="lg"
                className="w-full"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="space-y-6"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-950 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
              </div>

              <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 text-center mb-2">
                What are your wellness goals?
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-center mb-8">
                Select all that apply
              </p>

              {/* Goal selection with consistent spacing (Requirement 10.3) */}
              <div className="grid grid-cols-1 gap-4">
                {goalOptions.map((goal) => (
                  <motion.button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border-2 rounded-lg transition-all duration-150 ${
                      data.goals.includes(goal.id)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-4">{goal.icon}</span>
                      <span className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                        {goal.label}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Textarea styled consistently with design system */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Current Challenges (Optional)
                </label>
                <textarea
                  value={data.currentChallenges}
                  onChange={(e) => setData({ ...data, currentChallenges: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-150 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                  rows={3}
                  placeholder="Tell us about any health challenges you're facing..."
                />
              </div>

              {/* Navigation buttons with consistent spacing (Requirements 6.1, 10.3) */}
              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="ghost"
                  size="lg"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={data.goals.length === 0}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="space-y-6"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-950 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
              </div>

              <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 text-center mb-2">
                When do you prefer to be active?
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-center mb-8">
                We'll schedule activities based on your preference
              </p>

              {/* Time selection with consistent spacing (Requirement 10.3) */}
              <div className="grid grid-cols-1 gap-4">
                {timeOptions.map((time) => (
                  <motion.button
                    key={time.id}
                    onClick={() => setData({ ...data, preferredActivityTime: time.id })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border-2 rounded-lg transition-all duration-150 ${
                      data.preferredActivityTime === time.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl mr-4">{time.icon}</span>
                      <span className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                        {time.label}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Navigation buttons with loading state (Requirements 2.1, 6.1) */}
              <div className="flex gap-4">
                <Button
                  onClick={() => setStep(2)}
                  variant="ghost"
                  size="lg"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  loading={loading}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  Complete Setup
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
