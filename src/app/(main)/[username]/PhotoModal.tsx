'use client';
import React from 'react';
import { Modal, ModalBody, ModalContent } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { TiLocation } from 'react-icons/ti';
import { FaCartArrowDown } from 'react-icons/fa';
import { profilePath } from '@/lib/constants';
import { PhotoWithData } from '@/lib/types';
import { Image } from '@nextui-org/image';

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  photo: PhotoWithData;
};
export default function PhotoModal({ photo, isOpen, onOpenChange }: Props) {
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
                    src={photo.url}
                    className="w-full h-[85vh] object-cover"
                    alt={photo.caption || ''}
                    radius="none"
                  />
                </div>
                <section className="md:col-span-2 h-full flex flex-col justify-between">
                  <div className="p-3">
                    <h1 className="text-xl text-gray-700 mb-0">
                      {photo.caption} {/* TODO: This should be a photo tag */}
                    </h1>
                    <div className="flex items-center justify-between space-x-6">
                      {photo.user && (
                        <p className="text-sm">
                          By{' '}
                          <Link
                            href={profilePath(photo.user)}
                            className="text-gray-400 hover:text-black"
                          >
                            @{photo.user?.username || ''}
                          </Link>
                        </p>
                      )}

                      <p className="flex items-center space-x-1 text-gray-500 text-sm pe-3">
                        <TiLocation /> <span>{photo.location?.name}</span>
                      </p>
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
                        startContent={<FaCartArrowDown />}
                        color="primary"
                        as={Link}
                        href={'/photos/' + photo.id}
                      >
                        Buy Photo
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
