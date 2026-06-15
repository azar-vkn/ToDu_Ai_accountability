import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Lock, Check, X, Sparkles, Coins } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ToDuCharacter } from '../components/ToDuCharacter';
import { mockAvatarItems, getLevelForXP } from '../services/mockData';
import { AvatarItem } from '../types';

const StoreItemCard: React.FC<{
  item: AvatarItem;
  userLevel: number;
  onPurchase: (item: AvatarItem) => void;
  onPreview: (item: AvatarItem) => void;
}> = ({ item, userLevel, onPurchase, onPreview }) => {
  const isLocked = userLevel < item.unlockLevel;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !isLocked && onPreview(item)}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm ${
        isLocked ? 'opacity-60' : ''
      }`}
    >
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-5xl">
        {item.image}
        {isLocked && (
          <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        )}
        {item.owned && (
          <div className="absolute top-2 right-2 bg-green-500 p-1.5 rounded-full">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="p-3">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.name}</h4>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.price}</span>
          </div>
          {isLocked ? (
            <span className="text-xs text-gray-500 dark:text-gray-400">Lvl {item.unlockLevel}+</span>
          ) : item.owned ? (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Owned</span>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onPurchase(item);
              }}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium"
            >
              Buy
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const StorePage: React.FC = () => {
  const { state } = useApp();
  const [activeCategory, setActiveCategory] = useState<AvatarItem['category'] | 'all'>('all');
  const [previewItem, setPreviewItem] = useState<AvatarItem | null>(null);

  if (!state.user) return null;

  const currentLevel = getLevelForXP(state.user.xp);

  const categories: { id: AvatarItem['category'] | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '✨' },
    { id: 'outfit', label: 'Outfits', icon: '👕' },
    { id: 'hat', label: 'Hats', icon: '🎩' },
    { id: 'room', label: 'Rooms', icon: '🏠' },
    { id: 'effect', label: 'Effects', icon: '💫' },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? mockAvatarItems
      : mockAvatarItems.filter((item) => item.category === activeCategory);

  const handlePurchase = (item: AvatarItem) => {
    alert(`Purchased ${item.name} for ${item.price} coins! (Demo)`);
  };

  return (
    <div className="pb-24 px-4">
      <header className="pt-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customize your ToDu</p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-2 rounded-xl">
            <Coins className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="font-bold text-gray-900 dark:text-white">{state.user.xp * 2}</span>
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-6 mb-6 flex items-center justify-center relative"
      >
        <div className="relative">
          <ToDuCharacter size="large" />
          {previewItem && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2 text-2xl"
            >
              {previewItem.image}
            </motion.div>
          )}
        </div>
        {previewItem && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setPreviewItem(null)}
            className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </motion.button>
        )}
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span className="font-medium text-gray-900 dark:text-white">Level {state.user.level}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">• {currentLevel.title}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Unlock more items as you level up!
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredItems.map((item) => (
          <StoreItemCard
            key={item.id}
            item={item}
            userLevel={state.user!.level}
            onPurchase={handlePurchase}
            onPreview={setPreviewItem}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-2xl border border-yellow-200 dark:border-yellow-800"
      >
        <div className="flex items-center gap-2 mb-2">
          <ShoppingCart className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <span className="font-semibold text-gray-900 dark:text-white">Earn Coins</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Complete tasks, maintain streaks, and level up to earn coins for your ToDu!
        </p>
      </motion.div>
    </div>
  );
};
