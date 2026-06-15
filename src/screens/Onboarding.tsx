import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Target, Zap, Bell, User as UserIcon } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ToDuCharacter } from '../components/ToDuCharacter';
import { WorkStyle, Difficulty, NotificationPreference } from '../types';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const characterVariants = {
  initial: { opacity: 0, y: 50, scale: 0.5 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.3 } },
};

const WelcomePage: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { dispatch } = useApp();

  React.useEffect(() => {
    dispatch({ type: 'SET_CHARACTER_STATE', payload: 'happy' });
  }, [dispatch]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center text-center px-6"
    >
      <motion.div variants={characterVariants} initial="initial" animate="animate">
        <ToDuCharacter size="large" className="mb-8" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
      >
        Meet ToDu!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-sm"
      >
        Your personal AI accountability buddy. Together, we'll crush procrastination and build amazing habits!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        className="space-y-3 w-full max-w-xs"
      >
        <FeatureBadge icon="🎯" text="Set meaningful goals" />
        <FeatureBadge icon="💪" text="Stay accountable daily" />
        <FeatureBadge icon="🏆" text="Earn XP and rewards" />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        onClick={onNext}
        className="mt-10 w-full max-w-xs py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-blue-600/30 transition-all active:scale-95"
      >
        Let's Get Started!
      </motion.button>
    </motion.div>
  );
};

const GoalsPage: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { dispatch } = useApp();
  const [goal, setGoal] = useState('');

  React.useEffect(() => {
    dispatch({ type: 'SET_CHARACTER_STATE', payload: 'thinking' });
  }, [dispatch]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col px-6"
    >
      <motion.div variants={characterVariants} initial="initial" animate="animate" className="flex justify-center mb-6">
        <ToDuCharacter size="medium" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What's your goal?</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Let's set something meaningful. What do you want to achieve?
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        {[
          'Become more productive',
          'Build consistent habits',
          'Reduce procrastination',
          'Achieve work-life balance',
        ].map((presetGoal) => (
          <button
            key={presetGoal}
            onClick={() => setGoal(presetGoal)}
            className={`w-full p-4 rounded-2xl text-left transition-all ${
              goal === presetGoal
                ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
            }`}
          >
            <span className="text-gray-900 dark:text-white font-medium">{presetGoal}</span>
          </button>
        ))}

        <input
          type="text"
          placeholder="Or type your own goal..."
          value={!['Become more productive', 'Build consistent habits', 'Reduce procrastination', 'Achieve work-life balance'].includes(goal) ? goal : ''}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onNext}
        disabled={!goal}
        className="mt-auto mb-8 w-full py-4 bg-blue-600 disabled:bg-gray-300 text-white disabled:text-gray-500 rounded-2xl font-semibold text-lg shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:active:scale-100 disabled:shadow-none"
      >
        Continue
      </motion.button>
    </motion.div>
  );
};

const StylePage: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { dispatch } = useApp();
  const [workStyle, setWorkStyle] = useState<WorkStyle>('balanced');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  React.useEffect(() => {
    dispatch({ type: 'SET_CHARACTER_STATE', payload: 'idle' });
  }, [dispatch]);

  const workStyles: { id: WorkStyle; label: string; icon: string; desc: string }[] = [
    { id: 'focused', label: 'Focused', icon: '🎯', desc: 'Deep work, fewer distractions' },
    { id: 'balanced', label: 'Balanced', icon: '⚖️', desc: 'Mix of focus and flexibility' },
    { id: 'flexible', label: 'Flexible', icon: '🌊', desc: 'Go with the flow approach' },
  ];

  const difficulties: { id: Difficulty; label: string; xp: string }[] = [
    { id: 'easy', label: 'Easy Mode', xp: 'Less XP, easier goals' },
    { id: 'medium', label: 'Normal', xp: 'Standard XP, balanced goals' },
    { id: 'hard', label: 'Challenge Mode', xp: 'More XP, ambitious goals' },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col px-6"
    >
      <motion.div variants={characterVariants} initial="initial" animate="animate" className="flex justify-center mb-6">
        <ToDuCharacter size="medium" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Style</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Let me know how I can best support you!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Work Style
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {workStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setWorkStyle(style.id)}
              className={`p-3 rounded-2xl text-center transition-all ${
                workStyle === style.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                  : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent'
              }`}
            >
              <span className="text-2xl block mb-1">{style.icon}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white block">{style.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Challenge Level
        </h3>
        <div className="space-y-2">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => setDifficulty(diff.id)}
              className={`w-full p-4 rounded-2xl text-left transition-all ${
                difficulty === diff.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                  : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent'
              }`}
            >
              <span className="font-medium text-gray-900 dark:text-white">{diff.label}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 block">{diff.xp}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={onNext}
        className="mt-auto mb-8 w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-blue-600/30 transition-all active:scale-95"
      >
        Continue
      </motion.button>
    </motion.div>
  );
};

const ProfilePage: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [notifications, setNotifications] = useState<NotificationPreference>('moderate');

  React.useEffect(() => {
    dispatch({ type: 'SET_CHARACTER_STATE', payload: 'happy' });
  }, [dispatch]);

  const avatars = ['🧑‍💻', '👩‍🎨', '🧑‍🚀', '👩‍🔬', '🧑‍🍳', '👩‍🎤', '🧑‍🎓', '👩‍💼'];

  const completeOnboarding = () => {
    const user = {
      id: Date.now().toString(),
      name: name || 'Friend',
      avatar: selectedAvatar,
      level: 1,
      xp: 0,
      streak: 0,
      totalTasksCompleted: 0,
      totalFocusMinutes: 0,
      joinedAt: new Date(),
      goal: '',
      workStyle: 'balanced' as WorkStyle,
      difficulty: 'medium' as Difficulty,
      notificationPreference: notifications,
    };
    dispatch({ type: 'COMPLETE_ONBOARDING', payload: user });
    onComplete();
  };

  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col px-6"
    >
      <motion.div variants={characterVariants} initial="initial" animate="animate" className="flex justify-center mb-6">
        <ToDuCharacter size="medium" className="mr-4" />
        <span className="text-4xl self-center">{selectedAvatar}</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center gap-2 mb-2">
          <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Profile</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Almost there! Let's personalize your experience.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Choose Avatar
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {avatars.map((avatar) => (
            <button
              key={avatar}
              onClick={() => setSelectedAvatar(avatar)}
              className={`p-3 rounded-2xl text-3xl transition-all ${
                selectedAvatar === avatar
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                  : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent'
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Your Name
        </h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What should I call you?"
          className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Notifications
          </h3>
        </div>
        <div className="space-y-2">
          {[
            { id: 'frequent', label: 'Frequent', desc: 'Lots of reminders' },
            { id: 'moderate', label: 'Moderate', desc: 'Key moments only' },
            { id: 'minimal', label: 'Minimal', desc: 'Just the essentials' },
          ].map((notif) => (
            <button
              key={notif.id}
              onClick={() => setNotifications(notif.id as NotificationPreference)}
              className={`w-full p-4 rounded-2xl text-left transition-all ${
                notifications === notif.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                  : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent'
              }`}
            >
              <span className="font-medium text-gray-900 dark:text-white">{notif.label}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 block">{notif.desc}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={completeOnboarding}
        className="mt-auto mb-8 w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        Start Journey <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

const FeatureBadge: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-xl"
  >
    <span className="text-xl">{icon}</span>
    <span className="text-gray-700 dark:text-gray-300 font-medium">{text}</span>
  </motion.div>
);

export const Onboarding: React.FC = () => {
  const { dispatch } = useApp();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
      const steps = ['welcome', 'goals', 'style', 'profile'] as const;
      dispatch({ type: 'SET_ONBOARDING_STEP', payload: steps[step + 1] });
    }
  };

  const handleComplete = () => {
    dispatch({ type: 'SET_SCREEN', payload: 'home' });
  };

  const pages = [
    <WelcomePage key="welcome" onNext={handleNext} />,
    <GoalsPage key="goals" onNext={handleNext} />,
    <StylePage key="style" onNext={handleNext} />,
    <ProfilePage key="profile" onComplete={handleComplete} />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto py-12">
        <AnimatePresence mode="wait">{pages[step]}</AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 pb-8">
        {pages.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === step
                ? 'w-8 bg-blue-600 dark:bg-blue-400'
                : i < step
                ? 'bg-blue-300 dark:bg-blue-700'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
