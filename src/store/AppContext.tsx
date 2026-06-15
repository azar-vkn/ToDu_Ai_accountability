import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task, User, CharacterState, ChatMessage, DailyReview } from '../types';
import { mockTasks, mockChatHistory, getLevelForXP, mockUser } from '../services/mockData';

type Screen = 'home' | 'tasks' | 'chat' | 'progress' | 'profile';
type OnboardingStep = 'welcome' | 'goals' | 'style' | 'profile' | 'complete';

interface AppState {
  user: User | null;
  tasks: Task[];
  chatHistory: ChatMessage[];
  currentScreen: Screen;
  characterState: CharacterState;
  isOnboarded: boolean;
  onboardingStep: OnboardingStep;
  darkMode: boolean;
  dailyReview: DailyReview | null;
  focusTask: Task | null;
  isFocusMode: boolean;
}

type Action =
  | { type: 'SET_SCREEN'; payload: Screen }
  | { type: 'SET_CHARACTER_STATE'; payload: CharacterState }
  | { type: 'SET_ONBOARDING_STEP'; payload: OnboardingStep }
  | { type: 'COMPLETE_ONBOARDING'; payload: User }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'UPDATE_USER_XP'; payload: number }
  | { type: 'SET_FOCUS_TASK'; payload: Task | null }
  | { type: 'TOGGLE_FOCUS_MODE' }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'UPDATE_DAILY_REVIEW'; payload: Partial<DailyReview> };

const initialState: AppState = {
  user: null,
  tasks: [],
  chatHistory: [],
  currentScreen: 'home',
  characterState: 'idle',
  isOnboarded: false,
  onboardingStep: 'welcome',
  darkMode: false,
  dailyReview: null,
  focusTask: null,
  isFocusMode: false,
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.payload };
    case 'SET_CHARACTER_STATE':
      return { ...state, characterState: action.payload };
    case 'SET_ONBOARDING_STEP':
      return { ...state, onboardingStep: action.payload };
    case 'COMPLETE_ONBOARDING':
      return { ...state, user: action.payload, isOnboarded: true };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'UPDATE_USER_XP': {
      if (!state.user) return state;
      const newXP = state.user.xp + action.payload;
      const newLevel = getLevelForXP(newXP).level;
      return {
        ...state,
        user: {
          ...state.user,
          xp: newXP,
          level: newLevel,
        },
      };
    }
    case 'SET_FOCUS_TASK':
      return { ...state, focusTask: action.payload };
    case 'TOGGLE_FOCUS_MODE':
      return { ...state, isFocusMode: !state.isFocusMode };
    case 'COMPLETE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, status: 'completed' as const, completedAt: new Date() } : t
        ),
        user: state.user
          ? {
              ...state.user,
              totalTasksCompleted: state.user.totalTasksCompleted + 1,
            }
          : null,
      };
    }
    case 'UPDATE_DAILY_REVIEW':
      if (!state.dailyReview) return state;
      return { ...state, dailyReview: { ...state.dailyReview, ...action.payload } };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem('todu_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.isOnboarded) {
          dispatch({ type: 'COMPLETE_ONBOARDING', payload: parsed.user });
          parsed.tasks.forEach((task: Task) => dispatch({ type: 'ADD_TASK', payload: task }));
        }
      } catch {
        console.error('Failed to parse saved state');
      }
    } else {
      mockTasks.forEach((task) => dispatch({ type: 'ADD_TASK', payload: task }));
      mockChatHistory.forEach((msg) => dispatch({ type: 'ADD_CHAT_MESSAGE', payload: msg }));
      dispatch({ type: 'COMPLETE_ONBOARDING', payload: mockUser });
    }
  }, []);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem(
        'todu_state',
        JSON.stringify({ isOnboarded: state.isOnboarded, user: state.user, tasks: state.tasks })
      );
    }
  }, [state.user, state.isOnboarded, state.tasks]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
