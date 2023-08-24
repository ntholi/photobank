import React from 'react';
import { motion } from 'framer-motion';
import OtherInfo from './OtherInfo';
import { IoMdBookmark } from 'react-icons/io';
import { CurrentSlideData, Data, PhotoWithUser } from '@/lib/types';
import { Button } from '@nextui-org/button';
import { useDisclosure } from '@nextui-org/modal';
import PhotoModal from '../PhotoModal';

type Props = {
  transitionData: Data;
  currentSlideData: CurrentSlideData;
};

function SlideInfo({ transitionData, currentSlideData }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <PhotoModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        photo={{
          id: 1,
          name: currentSlideData.data.title,
          description: currentSlideData.data.description,
          url: currentSlideData.data.img,
          location: currentSlideData.data.location,
        }}
      />
      <motion.span layout className=" mb-2 h-1 w-5 rounded-full bg-white" />
      <OtherInfo
        data={transitionData ? transitionData : currentSlideData.data}
      />
      <motion.div layout className=" mt-5 flex items-center gap-3">
        <Button
          color="default"
          onClick={() => {
            onOpen();
          }}
        >
          View Photo
        </Button>
      </motion.div>
    </>
  );
}

export default SlideInfo;
