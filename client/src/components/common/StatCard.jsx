import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient = 'from-cyan-500/20 to-blue-500/10',
  borderColor = 'border-cyan-500/30',
  glowColor = 'rgba(6,182,212,0.3)',
  trend = null
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl glass-card p-6 border ${borderColor}`}
      style={{
        boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Background Glow */}
      <div
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-40"
        style={{ background: glowColor }}
      />

      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            {title}
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-display tracking-tight">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              {trend && (
                <span className={`font-semibold ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {trend > 0 ? `+${trend}%` : `${trend}%`}
                </span>
              )}
              <span>{subtitle}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center border border-white/10 shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
