import { motion } from 'framer-motion';

export const FadeIn = ({ children, delay = 0, className = '', direction, distance = 30 }) => {
  const dirs = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };
  const initial = dirs[direction] || { y: distance };

  return (
    <motion.div
      initial={{ opacity: 0, ...initial }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: delay * 0.001, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideIn = ({ children, direction = 'left', delay = 0, className = '' }) => (
  <FadeIn delay={delay} className={className} direction={direction}>
    {children}
  </FadeIn>
);

export const ScaleIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: delay * 0.001, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, className = '', staggerDelay = 0.08 }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-50px' }}
    variants={{ visible: { transition: { staggerChildren: staggerDelay } }, hidden: {} }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 25, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
  </motion.div>
);

export const HoverScale = ({ children, className = '', scale = 1.03 }) => (
  <motion.div
    whileHover={{ scale, boxShadow: '0 15px 30px -5px rgba(0,0,0,0.1)' }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`cursor-pointer ${className}`}
  >
    {children}
  </motion.div>
);

export const AnimatedCounter = ({ value, duration = 1.5 }) => (
  <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {value}
    </motion.span>
  </motion.span>
);

export const FloatingElement = ({ children, className = '', duration = 3 }) => (
  <motion.div
    animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const PulseGlow = ({ children, className = '' }) => (
  <motion.div
    animate={{ boxShadow: ['0 0 0 0 rgba(16,185,129,0.4)', '0 0 0 15px rgba(16,185,129,0)'] }}
    transition={{ duration: 2, repeat: Infinity }}
    className={`rounded-xl ${className}`}
  >
    {children}
  </motion.div>
);

export const RotateIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, rotateY: -90, scale: 0.5 }}
    whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: delay * 0.001, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const BounceIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.3 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: delay * 0.001 }}
    className={className}
  >
    {children}
  </motion.div>
);
