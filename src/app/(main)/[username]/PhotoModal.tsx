'use client';
import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalContent } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { TiLocation } from 'react-icons/ti';
import { IoMdOpen } from 'react-icons/io';
import { profilePath } from '@/lib/constants';
import { PhotoWithData } from '@/lib/types';
import { Image } from '@nextui-org/image';
import { watermarked } from '@/lib/config/urls';
import { User } from '@nextui-org/user';
import { FaBookmark } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import api from '@/lib/config/api';

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  photo: PhotoWithData;
};
export default function PhotoModal({ photo, isOpen, onOpenChange }: Props) {
  const [saving, setSaving] = React.useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSave = async () => {
    if (session) {
      setSaving(true);
      axios.post(api(`/photos/${photo.id}/save`)).finally(() => {
        setSaving(false);
      });
    } else {
      router.push('/signup');
    }
  };

  return (
    <Modal
      size={'5xl'}
      className="h-[85vh]"
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="p-0 md:pe-3">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="md:col-span-3">
                  <Image
                    src={watermarked(photo.fileName)}
                    className="w-full h-[85vh] object-cover"
                    alt={photo.caption || ''}
                    radius="none"
                  />
                </div>
                <section className="md:col-span-2 h-full flex flex-col justify-between">
                  <div className="p-3">
                    <div className="flex items-center justify-between space-x-6">
                      <User
                        name={photo.user.firstName + ' ' + photo.user.lastName}
                        description={
                          <div className="flex items-center space-x-1 text-gray-500 text-tiny pe-3">
                            <TiLocation /> <span>{photo.location?.name}</span>
                          </div>
                        }
                        avatarProps={{
                          src: photo.user.image || '/images/profile.png',
                        }}
                      />
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
                      <Button
                        color="danger"
                        variant="bordered"
                        startContent={<FaBookmark />}
                        onClick={handleSave}
                        isLoading={saving}
                      >
                        Save
                      </Button>
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
