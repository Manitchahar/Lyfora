import { forwardRef } from 'react';
import { Persona } from '../../lib/personas';

interface PersonaCardProps {
  persona: Persona;
  onClick: () => void;
}

// Color mapping for persona icon backgrounds
const colorMap: Record<string, string> = {
  blue: 'bg-blue-100',
  red: 'bg-red-100',
  cyan: 'bg-cyan-100',
  orange: 'bg-orange-100',
  green: 'bg-green-100',
  purple: 'bg-purple-100',
};

const PersonaCard = forwardRef<HTMLDivElement, PersonaCardProps>(
  ({ persona, onClick }, ref) => {
    const iconBgColor = colorMap[persona.color] || 'bg-gray-100';

    return (
      <div
        ref={ref}
        id={`persona-card-${persona.id}`}
        onClick={onClick}
        className="w-[260px] sm:w-[280px] h-[340px] sm:h-[360px] bg-white rounded-2xl shadow-sm border border-black/[0.06] p-5 sm:p-6 cursor-pointer transition-all duration-300 ease-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex flex-col touch-manipulation"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        aria-label={`Chat with ${persona.name}, ${persona.title}`}
      >
      {/* Icon Circle */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 ${iconBgColor} rounded-full flex items-center justify-center text-2xl sm:text-3xl transition-transform duration-200 ease-out`}>
          {persona.icon}
        </div>
      </div>

      {/* Title (uppercase label) */}
      <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium mb-2 text-center">
        {persona.title}
      </div>

      {/* Name */}
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight mb-2 sm:mb-3 text-center leading-tight">
        {persona.name}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-600 leading-[1.6] mb-4 sm:mb-6 text-center flex-grow">
        {persona.description}
      </p>

      {/* Specialty Tags */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mb-4 sm:mb-6">
        {persona.specialties.map((specialty, index) => (
          <span
            key={index}
            className="px-2.5 sm:px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full transition-colors duration-200 ease-out"
          >
            {specialty}
          </span>
        ))}
      </div>

      {/* Minimal Chat Button */}
      <div className="text-center">
        <span className="text-sm text-gray-900 font-medium transition-opacity duration-200 ease-out">
          Chat
        </span>
      </div>
    </div>
    );
  }
);

PersonaCard.displayName = 'PersonaCard';

export default PersonaCard;
