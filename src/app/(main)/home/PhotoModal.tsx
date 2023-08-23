'use client';
import React from 'react';
import { Modal, ModalBody, ModalContent } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Photo, User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { TiLocation } from 'react-icons/ti';
import { GoDownload } from 'react-icons/go';

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  photo: Photo & { user: User };
};
export default function PhotoModal({ photo, isOpen, onOpenChange }: Props) {
  const { user } = useSession().data || {};
  const router = useRouter();

  const handlePurchase = async () => {};

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
                <Image
                  src={photo.url}
                  width={1200}
                  height={1200}
                  className="w-full h-[85vh] object-cover md:col-span-3"
                  alt={photo.name}
                />
                <section className="md:col-span-2 h-full flex flex-col justify-between">
                  <div className="p-3">
                    <h1 className="text-xl text-gray-700 mb-0">{photo.name}</h1>
                    <div className="flex items-center justify-between space-x-6">
                      <p className="text-sm">
                        By{' '}
                        <Link
                          href={`/${photo.user.username}`}
                          className="text-gray-400 hover:text-black"
                        >
                          @{photo.user.username}
                        </Link>
                      </p>
                      <p className="flex items-center space-x-1 text-gray-500">
                        <TiLocation className="text-sm" />{' '}
                        <span>{photo.location}</span>
                      </p>
                    </div>

                    <p className="mt-6 text-sm text-gray-700 border bg-gray-50 p-2">
                      {photo.description}
                    </p>
                  </div>
                  <footer>
                    <div className="flex items-center justify-between p-3 border-t border-gray-200">
                      <Button
                        startContent={<GoDownload />}
                        color="primary"
                        variant="bordered"
                      >
                        Download
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
