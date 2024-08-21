'use client';
import { watermarked } from '@/lib/config/urls';
import { PhotoWithData } from '@/lib/types';
import {
  Button,
  cn,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  User,
} from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoMdClose, IoMdOpen } from 'react-icons/io';
import { SlOptions } from 'react-icons/sl';
import { TiLocation } from 'react-icons/ti';
import SaveButton from '../../photos/SaveButton';

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  photo: PhotoWithData;
};
export default function PhotoModal({ photo, isOpen, onOpenChange }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      {isOpen && (
        <Button
          variant='light'
          isIconOnly
          onClick={() => router.back()}
          className='absolute right-10 top-5 z-[100]'
        >
          <IoMdClose className='text-3xl font-bold text-white' />
        </Button>
      )}
      <Modal
        size={'5xl'}
        className='h-[85vh]'
        backdrop='blur'
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className='p-0 md:pe-3'>
                <div className='grid grid-cols-1 gap-3 md:grid-cols-5'>
                  <div className='md:col-span-3'>
                    <Image
                      src={watermarked(photo.fileName)}
                      className='h-[85vh] w-full object-cover md:w-[600px]'
                      alt={photo.caption || ''}
                      radius='none'
                    />
                  </div>
                  <section className='flex h-full flex-col justify-between md:col-span-2'>
                    <div className='p-3'>
                      <div className={'flex items-center justify-between'}>
                        <User
                          name={photo.user.name}
                          description={
                            photo.location && (
                              <div className='flex items-center space-x-1 pe-3 text-tiny text-gray-500'>
                                <TiLocation />{' '}
                                <span>{photo.location?.name}</span>
                              </div>
                            )
                          }
                          avatarProps={{
                            src: photo.user.image || '/images/profile.png',
                          }}
                        />
                        <Button
                          isIconOnly
                          size='sm'
                          aria-label='Options'
                          variant='light'
                        >
                          <SlOptions className='text-base' />
                        </Button>
                      </div>

                      <p className='mt-6 border bg-gray-50 p-2 text-sm text-gray-700'>
                        {photo.caption ? (
                          photo.caption
                        ) : (
                          <span className='italic'>(No Caption)</span>
                        )}
                      </p>
                    </div>
                    <footer>
                      <div className='flex items-center justify-between border-t border-gray-200 p-3 py-5'>
                        <Button
                          endContent={<IoMdOpen />}
                          color='primary'
                          as={Link}
                          href={'/photos/' + photo.id}
                        >
                          Open
                        </Button>
                        <SaveButton photoId={photo.id} />
                      </div>
                    </footer>
                  </section>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
