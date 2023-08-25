import React, { ForwardedRef, forwardRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ImageRef = forwardRef(
  (props: any, ref: ForwardedRef<HTMLImageElement>) => (
    <Image {...props} ref={ref} />
  ),
);
ImageRef.displayName = 'Image';
const MotionImage = motion(ImageRef);

export default MotionImage;
