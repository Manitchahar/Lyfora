import { motion } from 'framer-motion';

interface RingProps {
    radius: number;
    stroke: number;
    progress: number;
    color: string;
    delay?: number;
}

const Ring = ({ radius, stroke, progress, color, delay = 0 }: RingProps) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg
                height={radius * 2}
                width={radius * 2}
                className="rotate-[-90deg] absolute"
            >
                <circle
                    stroke={color}
                    strokeWidth={stroke}
                    strokeOpacity="0.2"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <motion.circle
                    stroke={color}
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, delay, ease: "easeOut" }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
        </div>
    );
};

interface ActivityRingsProps {
    move: number; // Percentage 0-100
    exercise: number; // Percentage 0-100
    stand: number; // Percentage 0-100
}

export function ActivityRings({ move, exercise, stand }: ActivityRingsProps) {
    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Move Ring (Outer) */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Ring radius={96} stroke={12} progress={move} color="#FA2D48" delay={0.2} />
            </div>

            {/* Exercise Ring (Middle) */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Ring radius={76} stroke={12} progress={exercise} color="#A4FF00" delay={0.4} />
            </div>

            {/* Stand Ring (Inner) */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Ring radius={56} stroke={12} progress={stand} color="#00F0FF" delay={0.6} />
            </div>

            {/* Icons or Center Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col"
                >
                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {Math.round((move + exercise + stand) / 3)}%
                    </span>
                    <span className="text-xs font-medium text-neutral-500 uppercase">Daily Goal</span>
                </motion.div>
            </div>
        </div>
    );
}
