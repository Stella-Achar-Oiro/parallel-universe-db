import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

/**
 * Toast - Vercel-style toast notification component
 * Minimal, clean success/error messages
 */
export default function Toast({ toasts, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-full max-w-sm" role="region" aria-label="Notifications">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-3 p-4 rounded-vercel shadow-vercel-md border backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-white/90 dark:bg-vercel-800/90 border-vercel-200/50 dark:border-vercel-700/50'
                : 'bg-white/90 dark:bg-vercel-800/90 border-red-200/50 dark:border-red-700/50'
            }`}
            role="alert"
          >
            <div className={`flex-shrink-0 ${
              toast.type === 'success' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-vercel-900 dark:text-vercel-50">
                {toast.title}
              </p>
              <p className="text-sm text-vercel-600 dark:text-vercel-400 mt-0.5">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => onClose(toast.id)}
              className="flex-shrink-0 p-1 rounded-md hover:bg-vercel-100 dark:hover:bg-vercel-700 text-vercel-600 dark:text-vercel-400 hover:text-vercel-900 dark:hover:text-vercel-100 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
