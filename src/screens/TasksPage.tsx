import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  Clock,
  Zap,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  MoreVertical,
  Play,
  Pause,
  Flag,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Task, TaskStatus, TaskPriority } from '../types';

const TaskCard: React.FC<{
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onStartFocus: (task: Task) => void;
}> = ({ task, onEdit, onDelete, onStatusChange, onStartFocus }) => {
  const [showMenu, setShowMenu] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    high: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    urgent: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  const statusIcons = {
    pending: Circle,
    in_progress: Pause,
    completed: CheckCircle2,
    abandoned: X,
  };

  const StatusIcon = statusIcons[task.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden ${
        task.status === 'completed' ? 'opacity-60' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => {
              if (task.status === 'pending') {
                onStatusChange(task.id, 'in_progress');
              } else if (task.status === 'in_progress') {
                onStatusChange(task.id, 'completed');
              }
            }}
            className="mt-1"
          >
            <motion.div whileTap={{ scale: 0.9 }}>
              <StatusIcon
                className={`w-6 h-6 ${
                  task.status === 'completed'
                    ? 'text-green-500'
                    : task.status === 'in_progress'
                    ? 'text-blue-500'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              />
            </motion.div>
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium text-gray-900 dark:text-white ${
                task.status === 'completed' ? 'line-through' : ''
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</p>
            )}

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${priorityColors[task.priority]}`}>
                <Flag className="w-3 h-3" />
                {task.priority}
              </span>

              {task.estimatedMinutes && (
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {task.estimatedMinutes} min
                </span>
              )}

              <span className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {task.xpReward} XP
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 min-w-[120px]"
                >
                  {task.status !== 'completed' && (
                    <>
                      <button
                        onClick={() => {
                          onEdit(task);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onStartFocus(task);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Start Focus
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      onDelete(task.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {task.status === 'in_progress' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '50%' }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {task.actualMinutes || 0}/{task.estimatedMinutes || '?'} min
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onStatusChange(task.id, 'completed')}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg text-sm font-medium"
              >
                Complete
              </button>
              <button
                onClick={() => onStatusChange(task.id, 'pending')}
                className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
              >
                Pause
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const TaskForm: React.FC<{
  task?: Task;
  onSave: (task: Partial<Task>) => void;
  onClose: () => void;
}> = ({ task, onSave, onClose }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(task?.estimatedMinutes?.toString() || '');
  const [xpReward, setXpReward] = useState(task?.xpReward?.toString() || '50');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...task,
      id: task?.id || Date.now().toString(),
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : undefined,
      xpReward: parseInt(xpReward) || 50,
      status: task?.status || 'pending',
      createdAt: task?.createdAt || new Date(),
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-3xl p-6 pb-safe"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`p-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    priority === p
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-transparent'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Est. Minutes
              </label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                placeholder="30"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">XP Reward</label>
              <input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(e.target.value)}
                placeholder="50"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full py-4 bg-blue-600 disabled:bg-gray-300 text-white disabled:text-gray-500 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:active:scale-100 disabled:shadow-none"
          >
            {task ? 'Save Changes' : 'Create Task'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const TasksPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const filteredTasks = state.tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleSave = (task: Partial<Task>) => {
    if (task.id && state.tasks.find((t) => t.id === task.id)) {
      dispatch({ type: 'UPDATE_TASK', payload: task as Task });
      dispatch({ type: 'SET_CHARACTER_STATE', payload: 'happy' });
    } else {
      dispatch({ type: 'ADD_TASK', payload: task as Task });
      dispatch({ type: 'SET_CHARACTER_STATE', payload: 'celebrate' });
    }
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    const task = state.tasks.find((t) => t.id === id);
    if (task) {
      const updatedTask = { ...task, status };
      if (status === 'completed') {
        updatedTask.completedAt = new Date();
        dispatch({ type: 'UPDATE_USER_XP', payload: task.xpReward });
        dispatch({ type: 'SET_CHARACTER_STATE', payload: 'celebrate' });
      }
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    }
  };

  const handleStartFocus = (task: Task) => {
    dispatch({ type: 'SET_FOCUS_TASK', payload: task });
    dispatch({ type: 'SET_SCREEN', payload: 'chat' });
    dispatch({ type: 'SET_CHARACTER_STATE', payload: 'thinking' });
  };

  return (
    <div className="pb-24 px-4">
      <div className="flex items-center justify-between pt-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {state.tasks.filter((t) => t.status !== 'completed').length} tasks remaining
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {(['all', 'pending', 'in_progress', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {sortedTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'all' ? 'Create your first task to get started!' : 'Filter to see other tasks'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setEditingTask(t);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onStartFocus={handleStartFocus}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <TaskForm
            task={editingTask}
            onSave={handleSave}
            onClose={() => {
              setShowForm(false);
              setEditingTask(undefined);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
