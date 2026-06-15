import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Flame,
  Star,
  Clock,
  Target,
  TrendingUp,
  Award,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { getProgressToNextLevel, getLevelForXP, levels, mockAnalytics, mockBadges } from '../services/mockData';

const BadgeCard: React.FC<{ badge: typeof mockBadges[0]; isUnlocked: boolean }> = ({ badge, isUnlocked }) => (
  <motion.div
    whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
    className={`relative p-4 rounded-2xl ${
      isUnlocked
        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800'
        : 'bg-gray-100 dark:bg-gray-800 opacity-60'
    }`}
  >
    <div className="text-4xl mb-2">{badge.icon}</div>
    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{badge.name}</h4>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.description}</p>
    {badge.unlockedAt && (
      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
        Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
      </p>
    )}
    {!isUnlocked && (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 rounded-2xl">
        <span className="text-2xl">🔒</span>
      </div>
    )}
  </motion.div>
);

const HeatmapCell: React.FC<{ intensity: number; date: string }> = ({ intensity, date }) => {
  const colors = [
    'bg-gray-100 dark:bg-gray-800',
    'bg-green-200 dark:bg-green-900',
    'bg-green-300 dark:bg-green-800',
    'bg-green-400 dark:bg-green-700',
    'bg-green-500 dark:bg-green-600',
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.3 }}
      className={`w-8 h-8 rounded-md ${colors[intensity]} cursor-pointer transition-all`}
      title={`${date}: ${intensity * 2} tasks`}
    />
  );
};

const WeekBar: React.FC<{ day: string; tasks: number }> = ({ day, tasks }) => {
  const maxTasks = 10;
  const height = Math.min((tasks / maxTasks) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-10 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-end overflow-hidden">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg"
        />
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">{day}</span>
    </div>
  );
};

export const ProgressPage: React.FC = () => {
  const { state } = useApp();
  const { user } = state;
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'badges'>('overview');
  const [showLevelModal, setShowLevelModal] = useState(false);

  if (!user) return null;

  const currentLevel = getLevelForXP(user.xp);
  const levelProgress = getProgressToNextLevel(user.xp);
  const todayTasks = state.tasks.filter(
    (t) => t.completedAt && new Date(t.completedAt).toDateString() === new Date().toDateString()
  ).length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'badges', label: 'Badges', icon: Award },
  ];

  return (
    <div className="pb-24 px-4">
      <header className="pt-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progress</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track your journey</p>
      </header>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <motion.button
              onClick={() => setShowLevelModal(true)}
              className="w-full bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-3xl text-white shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold">{user.level}</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg">{currentLevel.title}</h3>
                  <p className="text-yellow-100 text-sm">{user.xp} XP total</p>
                  <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProgress}%` }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>
                <ChevronRight className="w-6 h-6" />
              </div>
            </motion.button>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Today's Progress</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{todayTasks}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tasks Done</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {state.focusTask ? 45 : 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Focus Min</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {todayTasks * 50}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">XP Earned</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{user.streak} Day Streak</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.streak > 0 ? "You're on fire!" : 'Start your streak today!'}
                    </p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[...Array(Math.min(user.streak, 7))].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center text-xs font-medium border-2 border-white dark:border-gray-800"
                    >
                      🔥
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Completed</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.totalTasksCompleted}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Focus</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.floor(user.totalFocusMinutes / 60)}h
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">This Week</h3>
              <div className="flex items-end gap-2">
                {mockAnalytics.weeklyTrend.map((data) => (
                  <WeekBar key={data.date} day={data.date} tasks={data.tasks} />
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Activity Heatmap</h3>
              <div className="grid grid-cols-7 gap-1">
                {mockAnalytics.heatmapData
                  .slice()
                  .reverse()
                  .map((data) => (
                    <HeatmapCell key={data.date} intensity={data.intensity} date={data.date} />
                  ))}
              </div>
              <div className="flex items-center gap-2 mt-3 justify-end">
                <span className="text-xs text-gray-400">Less</span>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded ${
                      i === 0 ? 'bg-gray-100 dark:bg-gray-800' :
                      i === 1 ? 'bg-green-200 dark:bg-green-900' :
                      i === 2 ? 'bg-green-300 dark:bg-green-800' :
                      i === 3 ? 'bg-green-400 dark:bg-green-700' :
                      'bg-green-500 dark:bg-green-600'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-400">More</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Completion Rate</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockAnalytics.completionRate}%
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Avg Focus Time</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockAnalytics.averageFocusTime}m
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Insights</h3>
              </div>
              <ul className="space-y-2">
                {mockAnalytics.aiInsights.map((insight, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Most Productive Day</div>
                <div className="font-semibold text-gray-900 dark:text-white">{mockAnalytics.strongestDay}</div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-2 gap-3">
              {mockBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} isUnlocked={!!badge.unlockedAt} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLevelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLevelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Level System</h2>
                <button
                  onClick={() => setShowLevelModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                {levels.map((level) => {
                  const isCurrent = user.level === level.level;
                  const isUnlocked = user.level >= level.level;

                  return (
                    <motion.div
                      key={level.level}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: level.level * 0.05 }}
                      className={`p-4 rounded-2xl ${
                        isCurrent
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : isUnlocked
                          ? 'bg-gray-100 dark:bg-gray-700'
                          : 'bg-gray-50 dark:bg-gray-800 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
                            isCurrent
                              ? 'bg-white/20'
                              : isUnlocked
                              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        >
                          {level.level}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{level.title}</span>
                            {isCurrent && <Star className="w-4 h-4" />}
                          </div>
                          <div className="text-xs opacity-70">{level.minXP} - {level.maxXP === Infinity ? '∞' : level.maxXP} XP</div>
                        </div>
                        {isUnlocked && !isCurrent && (
                          <div className="text-2xl">✓</div>
                        )}
                      </div>
                      <div className="mt-2 text-sm opacity-80">
                        Rewards: {level.rewards.join(', ')}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
