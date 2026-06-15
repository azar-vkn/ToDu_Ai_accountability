import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Sparkles, User } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ChatMessage, QuickActionType } from '../types';
import { quickActions } from '../services/mockData';
import { ToDuCharacter } from '../components/ToDuCharacter';

const aiResponses: Record<QuickActionType, string[]> = {
  started: ["Awesome! Let's crush this! I'm timing you now.", "Let's go! Focus mode activated.", "You've got this! I'll be here when you need me."],
  done: ["Incredible! That's another task down!", "You're on fire! XP earned!", "Amazing work! Keep this momentum going!"],
  need_help: ["I'm here for you! What's the challenge?", "Let's figure this out together! Tell me more.", "No worries - even heroes need help sometimes. What's up?"],
  taking_break: ["Good idea! Rest is important. Take 10 minutes.", "Recharge time! I'll remind you to come back.", "Smart move. A well-rested mind is a productive mind."],
  stuck: ["Let's break it down. What's the smallest next step?", "Sometimes stepping back helps. What would make this easier?", "You've got options! Let's brainstorm together."],
};

const getMessageForAction = (type: QuickActionType): string => {
  const responses = aiResponses[type];
  return responses[Math.floor(Math.random() * responses.length)];
};

const MessageBubble: React.FC<{ message: ChatMessage; isUser: boolean }> = ({ message, isUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <ToDuCharacter size="small" />
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isUser ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const ChatPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory]);

  useEffect(() => {
    dispatch({ type: 'SET_CHARACTER_STATE', payload: 'happy' });
  }, [dispatch]);

  const handleSendMessage = (content: string, quickAction?: QuickActionType) => {
    if (!content.trim() && !quickAction) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim() || quickActions.find((a) => a.type === quickAction)?.label || '',
      sender: 'user',
      timestamp: new Date(),
      quickAction,
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });

    setTimeout(() => {
      let responseContent = '';
      if (quickAction) {
        responseContent = getMessageForAction(quickAction);
        dispatch({ type: 'SET_CHARACTER_STATE', payload: quickAction === 'done' ? 'celebrate' : 'happy' });
      } else {
        responseContent = generateAIResponse(content);
        dispatch({ type: 'SET_CHARACTER_STATE', payload: 'thinking' });
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: 'todu',
        timestamp: new Date(),
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMessage });
    }, 500 + Math.random() * 500);

    setInput('');
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('tired') || lowerInput.includes('exhausted')) {
      return "It sounds like you might need a break! Even the most productive people need rest. Why not take 15 minutes to recharge?";
    }
    if (lowerInput.includes('stuck') || lowerInput.includes("can't")) {
      return "Let's tackle this together! Try breaking the task into smaller pieces. What's ONE tiny thing you could do right now?";
    }
    if (lowerInput.includes('happy') || lowerInput.includes('great')) {
      return "I love that energy! Keep riding that wave. What's the next challenge you want to take on?";
    }
    if (lowerInput.includes('task') || lowerInput.includes('todo')) {
      return "Let's look at your tasks! Remember, you don't have to do everything at once. What feels most important right now?";
    }
    if (lowerInput.includes('procrastinating') || lowerInput.includes('distracted')) {
      return "Hey, awareness is the first step! Let's try the 5-minute rule: commit to just 5 minutes on that task. You might find yourself in flow!";
    }

    const defaultResponses = [
      "I'm here to help! Tell me more about what you're working on.",
      "That's interesting! How can I support you best right now?",
      "Got it! Remember, progress over perfection. What's the next small step?",
      "I'm with you! Let me know if you need a nudge or some encouragement.",
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <ToDuCharacter size="small" />
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">ToDu</h2>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {state.chatHistory.map((message) => (
            <MessageBubble key={message.id} message={message} isUser={message.sender === 'user'} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickActions.map((action) => (
            <motion.button
              key={action.type}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSendMessage('', action.type)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium whitespace-nowrap"
            >
              <span>{action.icon}</span>
              {action.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-colors ${
              isListening
                ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </motion.button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 pr-12"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-blue-600 disabled:bg-gray-300 text-white disabled:text-gray-500 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {state.focusTask && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Currently focusing on:
              </span>
            </div>
            <p className="text-sm text-gray-900 dark:text-white mt-1">{state.focusTask.title}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
