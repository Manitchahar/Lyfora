/**
 * LandingPage Component
 * 
 * Apple-inspired landing page with generous white space, smooth animations,
 * and design system components.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 9.3, 11.1, 11.4
 */

import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '../../design-system/components/Button/Button';
import { Card } from '../../design-system/components/Card/Card';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Ambient Background - Subtle gradient orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation - Requirements: 1.1 (generous white space) */}
      <nav className="relative z-50 px-6 py-8" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center" aria-hidden="true">
              <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              Lyfora
            </span>
          </div>
          <Button
            variant="secondary"
            size="md"
            onClick={onGetStarted}
            icon={<ArrowRight size={18} />}
            aria-label="Get started with Lyfora"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section - Requirements: 1.1 (generous white space), 1.4 (SF Pro Display typography), 14.8 */}
      <main id="main-content" role="main">
      <section className="relative z-10 px-6 pt-24 pb-32" aria-labelledby="hero-heading">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge - Requirements: 1.2 (soft shadows), 1.3 (smooth transitions) */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 mb-12 shadow-sm">
            <Sparkles className="w-4 h-4 text-teal-500" aria-hidden="true" />
            AI-Powered Wellness Companion
          </div>
          
          {/* Heading - Requirements: 1.4 (typography), 9.2 (font weight 600 for headings), 14.9 */}
          <h1 id="hero-heading" className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-8 leading-tight tracking-tight text-gray-900 dark:text-white">
            Wellness
            <span className="block bg-gradient-to-r from-teal-500 via-blue-500 to-teal-500 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>
          
          {/* Description - Requirements: 9.3 (line height 1.5 for body text) */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your health journey with intelligent guidance, 
            personalized routines, and insights that adapt to you.
          </p>
          
          {/* CTA Button - Requirements: 2.1 (Button component), 1.5 (hover feedback within 100ms) */}
          <Button
            variant="primary"
            size="lg"
            onClick={onGetStarted}
            icon={<ArrowRight size={20} />}
            className="shadow-lg hover:shadow-xl"
          >
            Start Your Journey
          </Button>
          
          {/* Stats - Requirements: 10.3 (16px spacing between related elements) */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mt-20 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">10k+</div>
              <div className="text-sm">Active Users</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-300 dark:bg-gray-700" />
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">98%</div>
              <div className="text-sm">Success Rate</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-300 dark:bg-gray-700" />
            <div className="text-center">
              <div className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">24/7</div>
              <div className="text-sm">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Requirements: 2.3 (Card component), 10.4 (32px spacing between sections) */}
      <section className="relative z-10 px-6 py-32" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          {/* Section Header - Requirements: 10.3 (16px spacing), 14.9 */}
          <div className="text-center mb-20">
            <h2 id="features-heading" className="text-4xl sm:text-5xl font-semibold mb-4 text-gray-900 dark:text-white tracking-tight">
              Built for You
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
              Three pillars of intelligent wellness
            </p>
          </div>
          
          {/* Feature Cards - Requirements: 2.3 (Card component), 11.1 (responsive breakpoints) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 - Requirements: 1.2 (soft shadows), 1.3 (smooth transitions 150-300ms) */}
            <Card variant="elevated" padding="lg" hoverable className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Sparkles className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                AI Guidance
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Personalized wellness recommendations that learn and adapt to your unique lifestyle and goals.
              </p>
            </Card>
            
            {/* Feature 2 */}
            <Card variant="elevated" padding="lg" hoverable className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Zap className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Smart Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Effortless progress monitoring with beautiful insights that celebrate your wellness journey.
              </p>
            </Card>
            
            {/* Feature 3 */}
            <Card variant="elevated" padding="lg" hoverable className="group sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <Shield className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Privacy First
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Your wellness data stays yours. Encrypted, secure, and never shared with third parties.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Requirements: 1.1 (generous white space) */}
      <section className="relative z-10 px-6 py-32" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="cta-heading" className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-6 text-gray-900 dark:text-white tracking-tight">
            Ready to
            <span className="block bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
              Transform?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands who've discovered a smarter way to wellness.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={onGetStarted}
            icon={<ArrowRight size={20} />}
            className="shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </Button>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-6">
            No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-gray-800 py-12 px-6" role="contentinfo">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center" aria-hidden="true">
              <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              Lyfora
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; 2025 Lyfora. Crafted with care for your wellness journey.
          </p>
        </div>
      </footer>
      </main>
    </div>
  );
}