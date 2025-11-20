import { useState, useEffect } from 'react';
import { Sun, Moon, CloudSun, Sunrise } from 'lucide-react';
import { motion } from 'framer-motion';

interface DynamicGreetingProps {
  userName?: string;
}

export function DynamicGreeting({ userName = 'Friend' }: DynamicGreetingProps) {
  const [greeting, setGreeting] = useState('');
  const [Icon, setIcon] = useState(Sun);
  
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning');
        setIcon(Sunrise);
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good Afternoon');
        setIcon(Sun);
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good Evening');
        setIcon(CloudSun);
      } else {
        setGreeting('Good Night');
        setIcon(Moon);
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 mb-6">
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="p-3 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl shadow-lg text-white"
      >
        <Icon className="w-8 h-8" />
      </motion.div>
      
      <div className="flex flex-col">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
        >
          {greeting}
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight"
        >
          {userName}
        </motion.h1>
      </div>
    </div>
  );
}
