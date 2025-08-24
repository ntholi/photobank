import { Button } from '@heroui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedText from './AnimatedText';

type ContentData = {
  id: string;
  contentId: string;
  content: {
    id: string;
    fileName: string | null;
    description: string | null;
    s3Key: string;
    thumbnailKey: string;
    type: 'image' | 'video';
    user: {
      id: string;
      name: string | null;
    } | null;
    location: {
      id: string;
      name: string;
      address: string | null;
    } | null;
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
          data={data.content.location?.name || 'Lesotho'}
        />
        <AnimatedText
          className='my-1 text-4xl font-semibold md:my-3 md:text-8xl md:leading-[100px]'
          data={'Lehakoe'}
        />
        <AnimatedText
          className='text-[#D5D5D6]'
          data={`Photo by ${data.content.user?.name || 'Anonymous'}`}
        />
      </motion.div>
      <motion.div layout className='mt-5 flex items-center gap-3'>
        <Button
          as={Link}
          href={`/content/${data.id}`}
          variant='ghost'
          radius='full'
          className='border-1 text-white hover:text-black'
        >
          View Details
        </Button>
      </motion.div>
    </>
  );
}
