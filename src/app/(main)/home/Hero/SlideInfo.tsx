import React from 'react';
import { motion } from 'framer-motion';
import { IoMdBookmark } from 'react-icons/io';
import AnimatedText from './AnimatedText';

type ContentData = {
  id: string;
  contentId: string;
  content: {
    id: string;
    fileName: string | null;
    s3Key: string;
    thumbnailKey: string;
    type: 'image' | 'video';
  };
};

type Props = {
  data: ContentData | null;
};

export default function SlideInfo({ data }: Props) {
  if (!data) {
    return (
      <>
        <motion.span layout className='mb-2 h-1 w-5 rounded-full bg-white' />
        <div className='flex flex-col'>
          <p className='spacing overflow-hidden text-[#D5D5D6]'>Loading...</p>
        </div>
      </>
    );
  }
  return (
    <>
      <motion.span layout className='mb-2 h-1 w-5 rounded-full bg-white' />
      <motion.div initial='hidden' animate='visible' className='flex flex-col'>
        <AnimatedText
          className='spacing overflow-hidden text-[#D5D5D6]'
          data={data.content.fileName || 'Lesotho'}
        />
        <AnimatedText
          className='my-1 text-4xl font-semibold md:my-3 md:text-8xl md:leading-[100px]'
          data={'Lehakoe'}
        />
        <AnimatedText
          className='text-xs text-[#D5D5D6]'
          data={`Beautiful ${data.content.type} from Lesotho`}
        />
      </motion.div>
      <motion.div layout className='mt-5 flex items-center gap-3'>
        <button className='flex h-[41px] w-[41px] items-center justify-center rounded-full bg-primary text-xs transition duration-300 ease-in-out hover:opacity-80'>
          <IoMdBookmark className='text-xl' />
        </button>
        <button className='w-fit rounded-full border-[1px] border-[#ffffff8f] px-6 py-3 text-[10px] font-thin transition duration-300 ease-in-out hover:bg-white hover:text-black'>
          VIEW CONTENT
        </button>
      </motion.div>
    </>
  );
}
