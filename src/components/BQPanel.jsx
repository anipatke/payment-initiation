import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

const shadowMap = {
  idle: 'none',
  active: '0 0 24px rgba(164,198,57,0.35), 0 0 8px rgba(164,198,57,0.2)',
  failed: '0 0 24px rgba(239,68,68,0.4), 0 0 8px rgba(239,68,68,0.25)',
};

export default function BQPanel({ node, isActive, isFailed, isExpanded, onToggle }) {
  const [showSchema, setShowSchema] = useState(false);
  const controls = useAnimation();
  const prevActiveRef = useRef(false);

  useEffect(() => {
    if (isFailed) {
      prevActiveRef.current = false;
      controls.start({ boxShadow: shadowMap.failed, opacity: 1, transition: { duration: 0.4, ease: 'easeInOut' } });
      return;
    }

    const justActivated = isActive && !prevActiveRef.current;
    prevActiveRef.current = isActive;

    if (!isActive) {
      controls.start({ boxShadow: shadowMap.idle, opacity: 1, transition: { duration: 0.4, ease: 'easeInOut' } });
    } else if (justActivated) {
      controls.start({
        boxShadow: shadowMap.active,
        opacity: [1, 0.6, 1, 0.7, 1],
        transition: {
          boxShadow: { duration: 0.4, ease: 'easeInOut' },
          opacity: { duration: 0.8, ease: 'easeInOut' },
        },
      });
    } else {
      controls.start({ boxShadow: shadowMap.active, opacity: 1, transition: { duration: 0.4, ease: 'easeInOut' } });
    }
  }, [isActive, isFailed]);

  const labelColor = isFailed ? 'text-red-400' : 'text-accent';

  return (
    <motion.div
      animate={controls}
      className="w-full rounded-sm border border-border bg-surface cursor-pointer select-none"
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className={`font-heading text-xs tracking-[0.22em] uppercase ${labelColor}`}>
            BQ — {node?.label?.toUpperCase()}
          </p>
          <p className="mt-1 font-body text-xs text-text/50 tracking-wider">
            {node?.role}
          </p>
          <p className="mt-1 font-body text-xs text-text/30 tracking-wider">
            {node?.apiPath}
          </p>
        </div>
        <motion.span
          className="font-body text-xs text-text/30 ml-4"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▾
        </motion.span>
      </div>

      {/* Drawer */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-t border-border px-6 py-4">
              {/* Fields */}
              <div className="grid grid-cols-1 gap-1">
                {node?.fields?.map((field) => (
                  <div key={field.name} className="flex items-baseline gap-2">
                    <span className={`font-body text-xs whitespace-nowrap ${isFailed ? 'text-red-400/70' : 'text-accent/70'}`}>
                      {field.name}
                    </span>
                    <span className="font-body text-xs text-text/30">
                      {field.type}
                    </span>
                  </div>
                ))}
              </div>

              {/* Schema inspector */}
              <div className="mt-4">
                <button
                  className="font-heading text-xs tracking-[0.18em] text-text/40 hover:text-accent transition-colors uppercase"
                  onClick={() => setShowSchema((s) => !s)}
                >
                  {showSchema ? '▲' : '▼'} UNDER THE HOOD
                </button>
                <AnimatePresence initial={false}>
                  {showSchema && (
                    <motion.div
                      key="schema"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <pre className="mt-3 rounded-sm border border-border-subtle bg-surface-2 p-4 font-body text-xs text-text/50 leading-5 overflow-x-auto">
                        {node?.schemaExcerpt}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
