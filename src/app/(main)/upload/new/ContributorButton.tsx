'use client';

import { ContributorApplication } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { GoCheck, GoStop, GoUpload } from 'react-icons/go';
import { canUpload } from './utils';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';

type Props = {
  onOpen: () => void;
};

export default function ContributorButton({ onOpen }: Props) {
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<ContributorApplication | null>(
    null,
  );
  const [motivation, setMotivation] = useState('');
  const { isOpen, onOpen: openModel, onOpenChange } = useDisclosure();

  const { data: session } = useSession();

  useEffect(() => {
    async function fetchUser() {
      const { data } = await axios.get(
        `/api/users/contributors/applications?id=${session?.user?.id}`,
      );
      if (data.application) {
        setApplication(data.application);
      }
    }
    fetchUser();
  }, [session]);

  const becomeContributor = async () => {
    setLoading(true);
    try {
      console.log('sending request');
      const { data } = await axios.post(
        '/api/users/contributors/applications',
        {
          motivation,
        },
      );
      if (data.application) {
        setApplication(data.application);
      }
    } finally {
      setLoading(false);
    }
  };
  return canUpload(session?.user) ? (
    <Button
      onPress={onOpen}
      startContent={<GoUpload />}
      color='primary'
      className='mt-5'
    >
      Upload
    </Button>
  ) : (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Become a Contributor
              </ModalHeader>
              <ModalBody>
                <Textarea
                  placeholder='Why do you want to become a contributor?'
                  cols={10}
                  height={100}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button
                  color='primary'
                  isDisabled={!motivation}
                  isLoading={loading}
                  onPress={async () => {
                    await becomeContributor();
                    onClose();
                  }}
                >
                  Apply
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button
        color={getStatusColor(application?.status)}
        variant='light'
        onClick={openModel}
        isDisabled={!!application}
        startContent={<StatusIcon status={application?.status} />}
        isLoading={loading}
      >
        {statusMessage(application?.status)}
      </Button>
    </>
  );
}

function getStatusColor(status?: ContributorApplication['status']) {
  switch (status) {
    case 'approved':
      return 'success';
    case 'rejected':
      return 'danger';
    default:
      return 'primary';
  }
}

function statusMessage(status?: ContributorApplication['status']) {
  switch (status) {
    case 'pending':
      return 'Application Sent';
    case 'approved':
      return 'Application Approved';
    case 'rejected':
      return 'Contributor Application Rejected';
    default:
      return 'Become a Contributor';
  }
}

function StatusIcon({ status }: { status?: ContributorApplication['status'] }) {
  switch (status) {
    case 'pending':
      return <GoCheck />;
    case 'approved':
      return <GoCheck />;
    case 'rejected':
      return <GoStop />;
    default:
      return null;
  }
}
