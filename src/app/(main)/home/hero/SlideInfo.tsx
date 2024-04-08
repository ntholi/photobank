import { CurrentSlideData, PhotoWithData } from '@/lib/types';
import { Button, useDisclosure } from '@nextui-org/react';
import { motion } from 'framer-motion';
import PhotoModal from '../../[username]/PhotoModal';
import OtherInfo from './OtherInfo';

type Props = {
  transitionData: PhotoWithData;
  currentSlideData: CurrentSlideData;
};

function SlideInfo({ transitionData, currentSlideData }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <PhotoModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        photo={currentSlideData.data}
      />
      <motion.span layout className=" mb-2 h-1 w-5 rounded-full bg-white" />
      <OtherInfo
        data={transitionData ? transitionData : currentSlideData.data}
      />
      <motion.div layout className=" mt-5 flex items-center gap-3">
        <Button
          color="default"
          onClick={() => {
            // onOpen();
          }}
        >
          View Photo
        </Button>
      </motion.div>
    </>
  );
}

export default SlideInfo;
