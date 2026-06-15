import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../store/AppContext';
import { CharacterState } from '../types';

interface ToDuCharacterProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const idleAnimation = {
  y: [0, -5, 0],
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
};

const sleepAnimation = {
  scale: [1, 1.05, 1],
  opacity: [1, 0.8, 1],
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
};

const celebrateAnimation = {
  scale: [1, 1.2, 1, 1.2, 1],
  rotate: [0, -10, 10, -10, 0],
  transition: { duration: 0.6, ease: 'easeInOut' },
};

const worriedAnimation = {
  x: [0, -2, 2, 0],
  transition: { duration: 0.3, repeat: 3 },
};

const thinkingAnimation = {
  rotate: [-5, 5, -5],
  transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
};

const happyAnimation = {
  scale: [1, 1.1, 1],
  transition: { duration: 0.5, ease: 'easeOut' },
};

const characterVariants = {
  idle: idleAnimation,
  happy: happyAnimation,
  celebrate: celebrateAnimation,
  thinking: thinkingAnimation,
  worried: worriedAnimation,
  sleeping: sleepAnimation,
};

const eyeVariants = {
  happy: { scaleY: 1 },
  celebrate: { scaleY: 0.1 },
  thinking: { scaleY: 0.8 },
  worried: { scaleY: 1.2, y: -2 },
  sleeping: { scaleY: 0.1 },
  idle: { scaleY: 1 },
};

const speechBubbles: Record<string, string[]> = {
  idle: ["Let's get moving!", "What's next?", "Ready when you are!"],
  happy: ["Great job!", "You're doing amazing!", "Keep it up!"],
  celebrate: ["WOOHOO!", "You did it!", "Amazing!"],
  thinking: ["Hmm...", "Let me think...", "Processing..."],
  worried: ["Everything okay?", "Need help?", "I'm here for you!"],
  sleeping: ["zzz...", "*snore*", "Rest mode..."],
};

export const ToDuCharacter: React.FC<ToDuCharacterProps> = ({ size = 'medium', className = '' }) => {
  const { state } = useApp();
  const [showBubble, setShowBubble] = React.useState(false);
  const [currentBubble, setCurrentBubble] = React.useState('');

  useEffect(() => {
    const bubbles = speechBubbles[state.characterState] || speechBubbles.idle;
    const randomBubble = bubbles[Math.floor(Math.random() * bubbles.length)];
    setCurrentBubble(randomBubble);
    setShowBubble(true);
    const timer = setTimeout(() => setShowBubble(false), 3000);
    return () => clearTimeout(timer);
  }, [state.characterState]);

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
  };

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-2 rounded-2xl shadow-lg text-xs font-medium whitespace-nowrap z-50"
          >
            {currentBubble}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={characterVariants[state.characterState]}
        className={`${sizeClasses[size]} relative cursor-pointer`}
        onClick={() => setShowBubble(true)}
      >
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <motion.ellipse
            cx="50"
            cy="55"
            rx="35"
            ry="38"
            fill="url(#bodyGradient)"
            animate={{ ry: state.characterState === 'sleeping' ? 35 : 38 }}
          />

          <ellipse cx="50" cy="50" rx="30" ry="32" fill="#FFE4C4" />

          <motion.ellipse
            cx="38"
            cy="45"
            rx="5"
            ry="6"
            fill="#333"
            animate={eyeVariants[state.characterState]}
          />
          <motion.ellipse
            cx="62"
            cy="45"
            rx="5"
            ry="6"
            fill="#333"
            animate={eyeVariants[state.characterState]}
          />

          {state.characterState !== 'sleeping' && (
            <>
              <circle cx="40" cy="43" r="2" fill="#fff" />
              <circle cx="64" cy="43" r="2" fill="#fff" />
            </>
          )}

          <ellipse cx="28" cy="55" rx="6" ry="3" fill="#FFB6C1" opacity="0.6" />
          <ellipse cx="72" cy="55" rx="6" ry="3" fill="#FFB6C1" opacity="0.6" />

          <motion.path
            d={getMouthPath(state.characterState)}
            fill="none"
            stroke="#333"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
          />

          {state.user && state.user.level >= 10 && (
            <circle cx="15" cy="30" r="8" fill="#FFD700" opacity="0.8" />
          )}

          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </motion.svg>

        <AnimatePresence>
          {state.characterState === 'sleeping' && (
            <>
              <motion.span
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-4 right-0 text-lg font-bold text-blue-400"
              >
                z
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -30 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: 0.3, repeat: Infinity }}
                className="absolute -top-8 right-2 text-xl font-bold text-blue-500"
              >
                z
              </motion.span>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {state.characterState === 'celebrate' && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [1, 0],
                    scale: [0, 1],
                    x: [0, (i % 2 === 0 ? 30 : -30)],
                    y: [0, -30 - i * 10],
                  }}
                  transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
                  className="absolute top-0 left-1/2 text-lg"
                  style={{ transform: `rotate(${i * 60}deg)` }}
                >
                  ✨
                </motion.span>
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

function getMouthPath(state: CharacterState): string {
  switch (state) {
    case 'happy':
      return 'M 40 62 Q 50 72, 60 62';
    case 'celebrate':
      return 'M 38 60 Q 50 75, 62 60';
    case 'thinking':
      return 'M 42 62 L 58 62';
    case 'worried':
      return 'M 38 66 Q 50 60, 62 66';
    case 'sleeping':
      return 'M 42 62 Q 50 65, 58 62';
    default:
      return 'M 42 62 Q 50 68, 58 62';
  }
}
