import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './store/AppContext';
import { BottomNav } from './components/BottomNav';
import { ToDuCharacter } from './components/ToDuCharacter';
import { Dashboard } from './screens/Dashboard';
import { TasksPage } from './screens/TasksPage';
import { ChatPage } from './screens/ChatPage';
import { ProgressPage } from './screens/ProgressPage';
import { ProfilePage } from './screens/ProfilePage';

const ScreenRouter: React.FC = () => {
  const { state } = useApp();

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.currentScreen}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
        className="flex-1 overflow-y-auto"
      >
        {state.currentScreen === 'home' && <Dashboard />}
        {state.currentScreen === 'tasks' && <TasksPage />}
        {state.currentScreen === 'chat' && <ChatPage />}
        {state.currentScreen === 'progress' && <ProgressPage />}
        {state.currentScreen === 'profile' && <ProfilePage />}
      </motion.div>
    </AnimatePresence>
  );
};

const FloatingToDu: React.FC = () => {
  const { state, dispatch } = useApp();

  if (state.currentScreen === 'chat') return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
      className="fixed bottom-20 right-4 z-40"
    >
      <button
        onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'chat' })}
        className="relative group"
      >
        <ToDuCharacter size="small" />
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
      </button>
    </motion.div>
  );
};

const AppContent: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ScreenRouter />
      <FloatingToDu />
      <BottomNav />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
