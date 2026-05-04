import { motion } from 'framer-motion';

const IDLE = '#1A1A1A';
const ACTIVE = '#A4C639';
const FAILED = '#ef4444';

export default function ConnectionLine({ isActive = false, isFailed = false }) {
  const color = isFailed ? FAILED : isActive ? ACTIVE : IDLE;

  return (
    <div className="flex justify-center h-12">
      <svg width="2" height="48" style={{ overflow: 'visible' }}>
        <line x1="1" y1="0" x2="1" y2="48" stroke={IDLE} strokeWidth="1" />
        {(isActive || isFailed) && (
          <motion.line
            x1="1" y1="0" x2="1" y2="48"
            stroke={color}
            strokeWidth="2"
            strokeDasharray={isActive ? '6 6' : undefined}
            animate={isActive ? { strokeDashoffset: [0, -12] } : {}}
            transition={isActive ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
          />
        )}
      </svg>
    </div>
  );
}
