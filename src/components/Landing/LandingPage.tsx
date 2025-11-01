import { Activity, Brain, Heart, Zap, TrendingUp, Users, ArrowRight, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-xl font-bold text-white">Lyfora</span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-teal-400/50 transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
                Your Wellness Journey
                <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Made Intelligent
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Meet Lyfora – the AI-powered wellness companion that understands you. Get personalized guidance, track your progress, and transform your health with technology that truly cares.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="px-8 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-teal-400/50 transition-all flex items-center justify-center gap-2"
                >
                  Start Your Journey <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-3 border border-gray-500 text-white font-semibold rounded-lg hover:border-teal-400 transition-colors">
                  Learn More
                </button>
              </div>
              <div className="mt-10 flex items-center gap-8 text-gray-400">
                <div>
                  <p className="text-2xl font-bold text-white">10k+</p>
                  <p className="text-sm">Active Users</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">98%</p>
                  <p className="text-sm">Satisfaction Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="text-sm">AI Support</p>
                </div>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 border border-slate-600">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 rounded-xl p-4 col-span-2">
                    <Activity className="w-8 h-8 text-teal-400 mb-2" />
                    <p className="text-white font-semibold">Daily Wellness Routine</p>
                    <p className="text-gray-400 text-sm">0 of 2 activities completed</p>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-4">
                    <Brain className="w-6 h-6 text-cyan-400 mb-2" />
                    <p className="text-white font-semibold text-sm">Mental Health</p>
                    <p className="text-gray-400 text-xs">85% Progress</p>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-4">
                    <Heart className="w-6 h-6 text-red-400 mb-2" />
                    <p className="text-white font-semibold text-sm">Physical</p>
                    <p className="text-gray-400 text-xs">72% Progress</p>
                  </div>
                  <div className="bg-slate-700 rounded-xl p-4 col-span-2">
                    <Zap className="w-6 h-6 text-amber-400 mb-2" />
                    <p className="text-white font-semibold text-sm">7-Day Streak 🔥</p>
                    <p className="text-gray-400 text-xs">Keep it going!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-400">Everything you need to transform your wellness</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 hover:border-teal-500 transition-colors group">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Wellness Assistant</h3>
              <p className="text-gray-400 mb-4">
                Chat with our intelligent wellness companion. Get personalized advice, motivation, and guidance tailored to your unique needs.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Real-time responses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Evidence-based advice
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  24/7 available
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 hover:border-teal-500 transition-colors group">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Activity Tracking</h3>
              <p className="text-gray-400 mb-4">
                Track daily wellness routines and log activities effortlessly. Monitor your progress with beautiful visualizations.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Customizable routines
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Progress visualization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Streak tracking
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 hover:border-teal-500 transition-colors group">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Progress Analytics</h3>
              <p className="text-gray-400 mb-4">
                Deep insights into your wellness journey. Understand patterns and celebrate your growth over time.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Weekly insights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Performance metrics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Goal tracking
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 hover:border-teal-500 transition-colors group">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Daily Check-Ins</h3>
              <p className="text-gray-400 mb-4">
                Simple daily wellness check-ins to track your mood, energy, and sleep quality.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Mood tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Energy levels
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Sleep quality
                </li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 hover:border-teal-500 transition-colors group">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Wellness Tips</h3>
              <p className="text-gray-400 mb-4">
                Curated wellness tips covering nutrition, fitness, mental health, and more delivered daily.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Daily tips
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Expert guidance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Science-backed
                </li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 hover:border-teal-500 transition-colors group">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Community Support</h3>
              <p className="text-gray-400 mb-4">
                Join thousands of wellness enthusiasts on their journey to better health and well-being.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Shared goals
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Motivation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Support network
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Why Choose Lyfora?</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Intelligence</h3>
                    <p className="text-gray-400">Advanced AI understands your unique wellness needs and provides personalized guidance.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Proven Results</h3>
                    <p className="text-gray-400">98% of our users report improved wellness habits within the first month.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
                    <p className="text-gray-400">Your health data is encrypted and never shared with third parties.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Always Available</h3>
                    <p className="text-gray-400">24/7 support from our AI assistant – your wellness companion is always there.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-teal-400">10k+</div>
                  <div>
                    <p className="text-white font-semibold">Active Users</p>
                    <p className="text-gray-400 text-sm">Trusting us daily</p>
                  </div>
                </div>
                <div className="h-px bg-slate-600"></div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-teal-400">98%</div>
                  <div>
                    <p className="text-white font-semibold">Satisfaction</p>
                    <p className="text-gray-400 text-sm">User satisfaction rate</p>
                  </div>
                </div>
                <div className="h-px bg-slate-600"></div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-teal-400">50M+</div>
                  <div>
                    <p className="text-white font-semibold">Wellness Tips</p>
                    <p className="text-gray-400 text-sm">Delivered to users</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-y border-slate-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Wellness?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who have already started their journey with Lyfora. Your better health starts today.
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-4 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-900 font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-teal-400/50 transition-all inline-flex items-center gap-2"
          >
            Get Started Free <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-gray-400 text-sm mt-4">No credit card required. Start free today.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-slate-900" />
                </div>
                <span className="text-lg font-bold text-white">Lyfora</span>
              </div>
              <p className="text-gray-400">Your AI-powered wellness companion.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Lyfora. All rights reserved. | Made with ❤️ for your wellness</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
