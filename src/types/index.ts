export type CharacterState = 'idle' | 'happy' | 'celebrate' | 'thinking' | 'sleeping' | 'worried';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'abandoned';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  xpReward: number;
  deadline?: Date;
  createdAt: Date;
  completedAt?: Date;
  estimatedMinutes?: number;
  actualMinutes?: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'todu';
  timestamp: Date;
  quickAction?: QuickActionType;
}

export type QuickActionType = 'started' | 'done' | 'need_help' | 'taking_break' | 'stuck';

export interface QuickAction {
  type: QuickActionType;
  label: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  totalTasksCompleted: number;
  totalFocusMinutes: number;
  joinedAt: Date;
  goal: string;
  workStyle: WorkStyle;
  difficulty: Difficulty;
  notificationPreference: NotificationPreference;
}

export type WorkStyle = 'focused' | 'balanced' | 'flexible';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type NotificationPreference = 'frequent' | 'moderate' | 'minimal';

export interface AvatarItem {
  id: string;
  name: string;
  category: 'outfit' | 'hat' | 'room' | 'effect';
  price: number;
  unlockLevel: number;
  image: string;
  owned: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  requirement: BadgeRequirement;
}

export interface BadgeRequirement {
  type: 'streak' | 'tasks_completed' | 'xp_earned' | 'days_active';
  value: number;
}

export interface DailyReview {
  date: Date;
  tasksCompleted: number;
  focusMinutes: number;
  xpEarned: number;
  reflection?: string;
  tomorrowPlan?: string;
}

export interface AnalyticsData {
  weeklyTrend: { date: string; tasks: number; xp: number }[];
  heatmapData: { date: string; intensity: number }[];
  completionRate: number;
  averageFocusTime: number;
  strongestDay: string;
  aiInsights: string[];
}

export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  rewards: string[];
}
