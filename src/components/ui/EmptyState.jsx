import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './Button';

export const EmptyState = ({ icon, title, description, action, actionText, to }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16 px-8"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
      className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
    >
      <div className="w-12 h-12 text-slate-400 dark:text-slate-500">{icon}</div>
    </motion.div>
    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">{description}</p>
    {action && to && (
      <Link to={to}>
        <Button variant="primary" size="lg" icon={actionText}>
          {actionText}
        </Button>
      </Link>
    )}
    {action && !to && (
      <Button variant="primary" size="lg" onClick={action}>
        {actionText}
      </Button>
    )}
  </motion.div>
);
