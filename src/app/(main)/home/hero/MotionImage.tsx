import React, { ForwardedRef, forwardRef } from 'react';
import { motion } from 'framer-motion';

const ImageRef = forwardRef(
  (props: any, ref: ForwardedRef<HTMLImageElement>) => (
    <img {...props} ref={ref} />
  ),
);
ImageRef.displayName = 'Image';
const MotionImage = motion(ImageRef);

export default MotionImage;
