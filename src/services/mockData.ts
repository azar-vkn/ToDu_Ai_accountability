import { Task, ChatMessage, AvatarItem, Badge, DailyReview, AnalyticsData, LevelInfo, QuickAction } from '../types';

export const quickActions: QuickAction[] = [
  { type: 'started', label: "I'm starting!", icon: '🚀' },
  { type: 'done', label: 'Done!', icon: '✅' },
  { type: 'need_help', label: 'Need help', icon: '🆘' },
  { type: 'taking_break', label: 'Taking a break', icon: '☕' },
  { type: 'stuck', label: "I'm stuck", icon: '😅' },
];

export const levels: LevelInfo[] = [
  { level: 1, title: 'Beginner', minXP: 0, maxXP: 100, rewards: ['Basic todu character'] },
  { level: 5, title: 'Apprentice', minXP: 100, maxXP: 300, rewards: ['Blue outfit unlock'] },
  { level: 10, title: 'Explorer', minXP: 300, maxXP: 600, rewards: ['Explorer hat', 'New room theme'] },
  { level: 15, title: 'Achiever', minXP: 600, maxXP: 1000, rewards: ['Glowing effect'] },
  { level: 25, title: 'Hero', minXP: 1000, maxXP: 2000, rewards: ['Hero cape', 'Particle effects'] },
  { level: 50, title: 'Legend', minXP: 2000, maxXP: 5000, rewards: ['Golden character', 'Legendary room'] },
  { level: 100, title: 'Master', minXP: 5000, maxXP: Infinity, rewards: ['Master aura', 'All items free'] },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete morning routine',
    description: 'Exercise, meditate, and plan the day',
    status: 'completed',
    priority: 'high',
    xpReward: 50,
    deadline: new Date(),
    createdAt: new Date(Date.now() - 86400000),
    completedAt: new Date(),
    estimatedMinutes: 30,
    actualMinutes: 28,
  },
  {
    id: '2',
    title: 'Review project documentation',
    description: 'Go through the latest PRD and provide feedback',
    status: 'in_progress',
    priority: 'medium',
    xpReward: 75,
    deadline: new Date(Date.now() + 3600000),
    createdAt: new Date(Date.now() - 43200000),
    estimatedMinutes: 45,
  },
  {
    id: '3',
    title: 'Team standup meeting',
    status: 'pending',
    priority: 'medium',
    xpReward: 25,
    deadline: new Date(Date.now() + 7200000),
    createdAt: new Date(),
    estimatedMinutes: 15,
  },
  {
    id: '4',
    title: 'Deep work session - Feature X',
    description: 'Implement the new dashboard component',
    status: 'pending',
    priority: 'high',
    xpReward: 150,
    deadline: new Date(Date.now() + 14400000),
    createdAt: new Date(),
    estimatedMinutes: 120,
  },
  {
    id: '5',
    title: 'Read 20 pages of book',
    status: 'pending',
    priority: 'low',
    xpReward: 30,
    createdAt: new Date(),
    estimatedMinutes: 30,
  },
];

export const mockChatHistory: ChatMessage[] = [
  {
    id: '1',
    content: "Good morning! Ready to crush your goals today? 🎯",
    sender: 'todu',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    content: 'Just finished my morning routine!',
    sender: 'user',
    timestamp: new Date(Date.now() - 3300000),
    quickAction: 'done',
  },
  {
    id: '3',
    content: "Amazing work! That's +50 XP! You're already off to a great start. What's next on your list?",
    sender: 'todu',
    timestamp: new Date(Date.now() - 3290000),
  },
  {
    id: '4',
    content: "Starting the project documentation review now",
    sender: 'user',
    timestamp: new Date(Date.now() - 1800000),
    quickAction: 'started',
  },
  {
    id: '5',
    content: "Perfect! Focus mode activated. I'll check in on you in 25 minutes. You've got this! 💪",
    sender: 'todu',
    timestamp: new Date(Date.now() - 1790000),
  },
];

export const mockAvatarItems: AvatarItem[] = [
  { id: '1', name: 'Blue Outfit', category: 'outfit', price: 100, unlockLevel: 5, image: '🎭', owned: true },
  { id: '2', name: 'Explorer Hat', category: 'hat', price: 200, unlockLevel: 10, image: '🎩', owned: true },
  { id: '3', name: 'Hero Cape', category: 'outfit', price: 500, unlockLevel: 25, image: '🦸', owned: false },
  { id: '4', name: 'Night Mode Room', category: 'room', price: 300, unlockLevel: 15, image: '🌙', owned: false },
  { id: '5', name: 'Golden Crown', category: 'hat', price: 800, unlockLevel: 35, image: '👑', owned: false },
  { id: '6', name: 'Glow Effect', category: 'effect', price: 150, unlockLevel: 12, image: '✨', owned: true },
  { id: '7', name: 'Fire Particles', category: 'effect', price: 400, unlockLevel: 20, image: '🔥', owned: false },
  { id: '8', name: 'Space Room', category: 'room', price: 600, unlockLevel: 30, image: '🚀', owned: false },
];

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first task',
    icon: '👣',
    unlockedAt: new Date(Date.now() - 86400000 * 5),
    requirement: { type: 'tasks_completed', value: 1 },
  },
  {
    id: '2',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    unlockedAt: new Date(Date.now() - 86400000 * 2),
    requirement: { type: 'streak', value: 7 },
  },
  {
    id: '3',
    name: 'Century Club',
    description: 'Complete 100 tasks',
    icon: '💯',
    requirement: { type: 'tasks_completed', value: 100 },
  },
  {
    id: '4',
    name: 'XP Hunter',
    description: 'Earn 1000 XP',
    icon: '⚡',
    requirement: { type: 'xp_earned', value: 1000 },
  },
  {
    id: '5',
    name: 'Month Master',
    description: 'Stay active for 30 days',
    icon: '📅',
    requirement: { type: 'days_active', value: 30 },
  },
];

export const mockDailyReview: DailyReview = {
  date: new Date(),
  tasksCompleted: 5,
  focusMinutes: 180,
  xpEarned: 250,
  reflection: 'Great productive day! Managed to finish all priority tasks.',
  tomorrowPlan: 'Focus on the new feature implementation and team sync.',
};

export const mockAnalytics: AnalyticsData = {
  weeklyTrend: [
    { date: 'Mon', tasks: 4, xp: 120 },
    { date: 'Tue', tasks: 6, xp: 180 },
    { date: 'Wed', tasks: 3, xp: 90 },
    { date: 'Thu', tasks: 8, xp: 240 },
    { date: 'Fri', tasks: 5, xp: 150 },
    { date: 'Sat', tasks: 2, xp: 60 },
    { date: 'Sun', tasks: 4, xp: 120 },
  ],
  heatmapData: Array.from({ length: 28 }, (_, i) => ({
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    intensity: Math.floor(Math.random() * 5),
  })),
  completionRate: 78,
  averageFocusTime: 145,
  strongestDay: 'Thursday',
  aiInsights: [
    'Your productivity peaks on Thursday afternoons',
    'Morning tasks have 92% completion rate',
    'Adding deadlines increases your completion rate by 40%',
  ],
};

export const getLevelForXP = (xp: number): LevelInfo => {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXP) {
      return levels[i];
    }
  }
  return levels[0];
};

export const getXPToNextLevel = (xp: number): number => {
  const currentLevel = getLevelForXP(xp);
  if (currentLevel.maxXP === Infinity) return 0;
  return currentLevel.maxXP - xp;
};

export const getProgressToNextLevel = (xp: number): number => {
  const currentLevel = getLevelForXP(xp);
  if (currentLevel.maxXP === Infinity) return 100;
  const progress = ((xp - currentLevel.minXP) / (currentLevel.maxXP - currentLevel.minXP)) * 100;
  return Math.min(100, progress);
};

export const mockUser = {
  id: '1',
  name: 'Alex',
  avatar: '🧑‍💻',
  level: 8,
  xp: 450,
  streak: 12,
  totalTasksCompleted: 45,
  totalFocusMinutes: 1200,
  joinedAt: new Date(Date.now() - 86400000 * 30),
  goal: 'Become more productive and consistent',
  workStyle: 'balanced' as const,
  difficulty: 'medium' as const,
  notificationPreference: 'moderate' as const,
};
