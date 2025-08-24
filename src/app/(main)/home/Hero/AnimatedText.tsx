import React from 'react';
import { motion } from 'framer-motion';

const item = {
  hidden: {
    y: '100%',
    transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.85 },
  },
  visible: {
    y: 0,
    transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.75 },
  },
} as const;

type Props = {
  data?: string;
  className?: string;
};

export default function AnimatedText({ data, className }: Props) {
  return (
    <span
      style={{
        overflow: 'hidden',
        display: 'inline-block',
      }}
    >
      <motion.h1
        className={className}
        variants={item}
        key={data || 'animated-text'}
      >
        {data}
      </motion.h1>
    </span>
  );
}
