import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/** Fade + rise on scroll into view */
export function ScrollReveal({ children, delay = 0, y = 40, className = '', once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Text line that slides up from behind a mask */
export function MaskLine({ children, text, className = '', delay = 0, once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-50px' });
  return (
    <span ref={ref} className="block">
      <motion.span
        className={`block ${className}`}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {text || children}
      </motion.span>
    </span>
  );
}

/** Splits text into words, each revealing with a stagger */
export function WordReveal({ text, className = '', delay = 0, once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-50px' });
  const words = text.split(' ');
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={inView ? { y: '0%' } : {}}
            transition={{ duration: 0.7, delay: delay + i * 0.06, ease: EASE }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

/** Section eyebrow label */
export function Eyebrow({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 text-gold text-xs font-mono tracking-[0.2em] uppercase ${className}`}>
      <span className="w-6 h-px bg-gold/50" />
      {children}
    </span>
  );
}
