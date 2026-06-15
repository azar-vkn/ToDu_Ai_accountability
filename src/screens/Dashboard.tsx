import React from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Play,
  MessageCircle,
  Target,
  Flame,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ToDuCharacter } from '../components/ToDuCharacter';
import { getProgressToNextLevel, getLevelForXP } from '../services/mockData';

const ProgressRing: React.FC<{ progress: number; size?: number }> = ({ progress, size = 80 }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

const QuickActionCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  color: string;
  onClick: () => void;
}> = ({ icon: Icon, label, color, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-2xl ${color} text-white shadow-lg`}
  >
    <Icon className="w-6 h-6 mb-1" />
    <span className="text-xs font-medium">{label}</span>
  </motion.button>
);

const StatCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string | number;
  suffix?: string;
  color: string;
}> = ({ icon: Icon, label, value, suffix, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm"
  >
    <div className="flex items-center gap-2 mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
      {suffix && <span className="text-sm text-gray-500 dark:text-gray-400">{suffix}</span>}
    </div>
  </motion.div>
);

export const Dashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const { user, tasks } = state;

  if (!user) return null;

  const completedToday = tasks.filter(
    (t) => t.status === 'completed' && t.completedAt && new Date(t.completedAt).toDateString() === new Date().toDateString()
  ).length;

  const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress');
  const todayProgress = tasks.length > 0 ? (completedToday / tasks.length) * 100 : 0;
  const levelProgress = getProgressToNextLevel(user.xp);
  const currentLevel = getLevelForXP(user.xp);

  return (
    <div className="pb-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pt-6 mb-6"
      >
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hey, {user.name}!
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{user.avatar}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl p-6 mb-6 shadow-lg shadow-blue-600/30"
      >
        <div className="flex items-center gap-4">
          <ProgressRing progress={todayProgress} size={70} />
          <div className="flex-1">
            <p className="text-blue-100 text-sm mb-1">Today's Progress</p>
            <h2 className="text-white text-xl font-bold mb-2">
              {completedToday} of {tasks.length} tasks
            </h2>
            <p className="text-blue-100 text-sm">Keep going! You're doing great!</p>
          </div>
          <ToDuCharacter size="small" className="-mr-2" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <StatCard icon={Flame} label="Streak" value={user.streak} suffix="days" color="bg-orange-500" />
        <StatCard icon={Sparkles} label="XP" value={user.xp} color="bg-purple-500" />
        <StatCard icon={Target} label="Completed" value={user.totalTasksCompleted} color="bg-green-500" />
        <StatCard icon={Clock} label="Focus Time" value={Math.floor(user.totalFocusMinutes / 60)} suffix="hrs" color="bg-blue-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
              {user.level}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{currentLevel.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getProgressToNextLevel(user.xp)}% to next level
              </p>
            </div>
          </div>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-4 mb-6 border border-purple-100 dark:border-purple-800"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">ToDu says:</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your strongest time is in the morning! You complete 85% of tasks before noon. Maybe tackle
              that high-priority task now?
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <QuickActionCard
            icon={Plus}
            label="Add Task"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'tasks' })}
          />
          <QuickActionCard
            icon={Play}
            label="Focus"
            color="bg-gradient-to-br from-green-500 to-green-600"
            onClick={() => {
              const nextTask = pendingTasks[0];
              if (nextTask) {
                dispatch({ type: 'SET_FOCUS_TASK', payload: nextTask });
                dispatch({ type: 'SET_CHARACTER_STATE', payload: 'thinking' });
              }
            }}
          />
          <QuickActionCard
            icon={MessageCircle}
            label="Check In"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'chat' })}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Upcoming Tasks
          </h3>
          <button
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'tasks' })}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {pendingTasks.slice(0, 3).map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex items-center gap-4"
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  task.priority === 'high'
                    ? 'bg-red-500'
                    : task.priority === 'medium'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {task.estimatedMinutes ? `${task.estimatedMinutes} min` : 'No estimate'} • {task.xpReward} XP
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                  {task.status === 'in_progress' ? 'In Progress' : 'Pending'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
