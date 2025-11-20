import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Card } from '../../design-system/components/Card/Card';

const data = [
    { name: 'Mon', steps: 4000, sleep: 6.5, mood: 7 },
    { name: 'Tue', steps: 3000, sleep: 7.0, mood: 6 },
    { name: 'Wed', steps: 2000, sleep: 6.0, mood: 5 },
    { name: 'Thu', steps: 2780, sleep: 7.5, mood: 8 },
    { name: 'Fri', steps: 1890, sleep: 5.5, mood: 4 },
    { name: 'Sat', steps: 2390, sleep: 8.0, mood: 9 },
    { name: 'Sun', steps: 3490, sleep: 7.5, mood: 8 },
];

export function WellnessCharts() {
    const [activeTab, setActiveTab] = useState<'steps' | 'sleep' | 'mood'>('steps');

    const config = {
        steps: { color: '#14b8a6', label: 'Steps', unit: '' },
        sleep: { color: '#8b5cf6', label: 'Sleep', unit: 'h' },
        mood: { color: '#f59e0b', label: 'Mood', unit: '/10' },
    };

    return (
        <Card variant="elevated" className="w-full h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Weekly Trends</h3>
                <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                    {(Object.keys(config) as Array<keyof typeof config>).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === tab
                                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                                }`}
                        >
                            {config[tab].label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`color${activeTab}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={config[activeTab].color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={config[activeTab].color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey={activeTab}
                            stroke={config[activeTab].color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#color${activeTab})`}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
