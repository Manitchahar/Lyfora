import { PERSONAS, Persona } from '../../lib/personas';
import PersonaCard from './PersonaCard';

interface PersonaGalleryProps {
  onPersonaSelect: (persona: Persona) => void;
}

export default function PersonaGallery({ onPersonaSelect }: PersonaGalleryProps) {
  return (
    <section className="w-full py-8 sm:py-12 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight leading-tight">
          Meet Your Expert Coaches
        </h2>
        <p className="text-base sm:text-lg text-gray-600 leading-[1.6]">
          Get personalized guidance from AI-powered wellness experts
        </p>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative max-w-7xl mx-auto">
        {/* Left Fade Gradient - Desktop Only */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10 hidden md:block" />
        
        {/* Scrollable Cards Container with Touch Support */}
        <div 
          className="overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-2"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="flex gap-4 sm:gap-6">
            {PERSONAS.map((persona) => (
              <div 
                key={persona.id} 
                className="snap-center snap-always flex-shrink-0 first:ml-2 last:mr-2"
              >
                <PersonaCard
                  persona={persona}
                  onClick={() => onPersonaSelect(persona)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Fade Gradient - Desktop Only */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none z-10 hidden md:block" />
      </div>
    </section>
  );
}
