import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { X } from 'lucide-react';
import { ExecutionStat } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ExecutionStat[];
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  // Format data for Recharts
  const data = stats.slice(-10).map((s, i) => ({
    name: `Run ${i + 1}`,
    duration: s.duration,
    status: s.status,
    timestamp: new Date(s.timestamp).toLocaleTimeString()
  }));

  const averageTime = stats.length > 0
    ? (stats.reduce((acc, curr) => acc + curr.duration, 0) / stats.length).toFixed(2)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Session Statistics</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
            <p className="text-sm text-blue-600 dark:text-blue-400">Total Runs</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.length}</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/50">
            <p className="text-sm text-green-600 dark:text-green-400">Avg. Duration</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{averageTime} ms</p>
          </div>
        </div>

        <div className="h-64 w-full">
            {stats.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                   <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                   <YAxis stroke="#6b7280" fontSize={12} unit="ms" />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                     itemStyle={{ color: '#60a5fa' }}
                   />
                   <Bar dataKey="duration" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No execution data yet. Run some code!
                </div>
            )}
         
        </div>
      </div>
    </div>
  );
};

export default StatsModal;