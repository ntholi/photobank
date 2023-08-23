'use client';
import React from 'react';
import { Modal, ModalBody, ModalContent } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Photo, User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { TiLocation } from 'react-icons/ti';
import { FaBookmark, FaCartArrowDown } from 'react-icons/fa';
import axios from 'axios';
import api from '@/lib/config/api';

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  photo: Photo & { user: User };
};
export default function PhotoModal({ photo, isOpen, onOpenChange }: Props) {
  const { user } = useSession().data || {};
  const router = useRouter();
  const [purchasing, setPurchasing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const handlePurchase = async () => {
    if (user) {
      setPurchasing(true);
      axios.post(api(`/photos/${photo.id}/purchase`)).finally(() => {
        setPurchasing(false);
      });
    } else {
      router.push('/signin');
    }
  };

  const handleSave = async () => {
    if (user) {
      setSaving(true);
      axios.post(api(`/photos/${photo.id}/save`)).finally(() => {
        setSaving(false);
      });
    } else {
      router.push('/signin');
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
                    <div className="flex items-center justify-between p-3 py-5 border-t border-gray-200">
                      <Button
                        startContent={<FaCartArrowDown />}
                        onClick={handlePurchase}
                        isLoading={purchasing}
                        color="primary"
                      >
                        Buy Photo
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        aria-label="Bookmark"
                        onClick={handleSave}
                        isLoading={saving}
                      >
                        <FaBookmark />
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
