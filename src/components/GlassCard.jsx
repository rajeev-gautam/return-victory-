import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01, boxShadow: "0 0 25px rgba(59, 130, 246, 0.15)" }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-effect glow-card rounded-2xl p-6 transition-all hover:border-primary/30 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
