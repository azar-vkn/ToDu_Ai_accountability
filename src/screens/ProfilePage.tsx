import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Moon,
  Sun,
  ChevronRight,
  Edit3,
  LogOut,
  HelpCircle,
  Shield,
  Info,
  X,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ToDuCharacter } from '../components/ToDuCharacter';
import { getProgressToNextLevel, getLevelForXP } from '../services/mockData';

const SettingRow: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}> = ({ icon: Icon, label, description, action, onClick, danger }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
      danger
        ? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
    }`}
  >
    <div
      className={`p-2 rounded-xl ${
        danger
          ? 'bg-red-100 dark:bg-red-900/30'
          : 'bg-blue-100 dark:bg-blue-900/30'
      }`}
    >
      <Icon
        className={`w-5 h-5 ${
          danger
            ? 'text-red-600 dark:text-red-400'
            : 'text-blue-600 dark:text-blue-400'
        }`}
      />
    </div>
    <div className="flex-1 text-left">
      <div className={`font-medium ${danger ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
        {label}
      </div>
      {description && (
        <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
      )}
    </div>
    {action || <ChevronRight className="w-5 h-5 text-gray-400" />}
  </motion.button>
);

export const ProfilePage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const avatars = ['🧑‍💻', '👩‍🎨', '🧑‍🚀', '👩‍🔬', '🧑‍🍳', '👩‍🎤', '🧑‍🎓', '👩‍💼'];
  const [selectedAvatar, setSelectedAvatar] = useState(state.user?.avatar || avatars[0]);

  if (!state.user) return null;

  const currentLevel = getLevelForXP(state.user.xp);
  const levelProgress = getProgressToNextLevel(state.user.xp);

  const handleSaveProfile = () => {
    const updatedUser = { ...state.user!, avatar: selectedAvatar };
    dispatch({ type: 'COMPLETE_ONBOARDING', payload: updatedUser });
    setShowEditModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('todu_state');
    window.location.reload();
  };

  return (
    <div className="pb-24 px-4">
      <header className="pt-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 mb-6 text-white shadow-lg"
      >
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative"
          >
            <span className="text-5xl">{state.user.avatar}</span>
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-md"
            >
              <Edit3 className="w-3 h-3 text-gray-600" />
            </button>
          </motion.div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{state.user.name}</h2>
            <div className="flex items-center gap-2 text-blue-100">
              <span className="text-sm">{currentLevel.title}</span>
              <span>•</span>
              <span className="text-sm">Level {state.user.level}</span>
            </div>
          </div>
          <ToDuCharacter size="small" />
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-100">XP Progress</span>
            <span className="text-sm font-medium">{state.user.xp} XP</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold">{state.user.totalTasksCompleted}</div>
            <div className="text-xs text-blue-100">Tasks Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{state.user.streak}</div>
            <div className="text-xs text-blue-100">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.floor(state.user.totalFocusMinutes / 60)}</div>
            <div className="text-xs text-blue-100">Focus Hours</div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2 mb-2">
          Settings
        </h3>

        <SettingRow
          icon={state.darkMode ? Moon : Sun}
          label="Dark Mode"
          description={state.darkMode ? 'Currently enabled' : 'Currently disabled'}
          action={
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className={`w-12 h-7 rounded-full p-1 transition-all ${
                state.darkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <motion.div
                animate={{ x: state.darkMode ? 20 : 0 }}
                className="w-5 h-5 bg-white rounded-full shadow-sm"
              />
            </motion.button>
          }
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
        />

        <SettingRow
          icon={Bell}
          label="Notifications"
          description={state.user.notificationPreference}
          onClick={() => alert('Notification settings coming soon!')}
        />

        <SettingRow
          icon={Shield}
          label="Privacy & Security"
          onClick={() => alert('Privacy settings coming soon!')}
        />

        <SettingRow
          icon={HelpCircle}
          label="Help & Support"
          onClick={() => alert('Help center coming soon!')}
        />

        <SettingRow
          icon={Info}
          label="About ToDu"
          onClick={() => alert('ToDu v1.0 - Your AI Accountability Buddy!')}
        />

        <div className="pt-4">
          <SettingRow
            icon={LogOut}
            label="Log Out"
            onClick={() => setShowLogoutConfirm(true)}
            danger
          />
        </div>
      </div>

      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                  Choose Avatar
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`p-3 rounded-2xl text-3xl transition-all ${
                        selectedAvatar === avatar
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                          : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-sm w-full"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Log Out?
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  You'll need to sign in again to access your progress.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold"
                >
                  Yes, Log Out
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
