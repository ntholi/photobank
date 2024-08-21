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
import { IoMdOpen } from 'react-icons/io';
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
  const isOwner = session?.user?.id === photo.user.id;
  const router = useRouter();

  return (
    <Modal
      size={'5xl'}
      className="h-[85vh]"
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      closeButton={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="p-0 md:pe-3">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="md:col-span-3">
                  <Image
                    src={watermarked(photo.fileName)}
                    className="w-full md:w-[600px] h-[85vh] object-cover"
                    alt={photo.caption || ''}
                    radius="none"
                  />
                </div>
                <section className="md:col-span-2 h-full flex flex-col justify-between">
                  <div className="p-3">
                    <div
                      className={cn(
                        'flex items-center justify-between',
                        isOwner && 'mt-5',
                      )}
                    >
                      <User
                        name={photo.user.name}
                        description={
                          photo.location && (
                            <div className="flex items-center space-x-1 text-gray-500 text-tiny pe-3">
                              <TiLocation /> <span>{photo.location?.name}</span>
                            </div>
                          )
                        }
                        avatarProps={{
                          src: photo.user.image || '/images/profile.png',
                        }}
                      />
                      {isOwner && (
                        <Button
                          isIconOnly
                          size="sm"
                          aria-label="Options"
                          variant="light"
                        >
                          <SlOptions className="text-base" />
                        </Button>
                      )}
                    </div>

                    <p className="mt-6 text-sm text-gray-700 border bg-gray-50 p-2">
                      {photo.caption ? (
                        photo.caption
                      ) : (
                        <span className="italic">(No Caption)</span>
                      )}
                    </p>
                  </div>
                  <footer>
                    <div className="flex items-center justify-between p-3 py-5 border-t border-gray-200">
                      <Button
                        endContent={<IoMdOpen />}
                        color="primary"
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
  );
}
