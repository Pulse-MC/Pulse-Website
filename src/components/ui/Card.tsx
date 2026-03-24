import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glowOnHover?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function Card({ children, className = '', glowOnHover = true, size = 'medium' }: CardProps) {
  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={glowOnHover ? { scale: 1.02 } : {}}
      className={`
        bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10
        ${glowOnHover ? 'hover:border-[#ff2929]/50 hover:shadow-lg hover:shadow-[#ff2929]/20' : ''}
        ${sizeClasses[size]}
        ${className}
        transition-all duration-300
      `}
    >
      {children}
    </motion.div>
  );
}
