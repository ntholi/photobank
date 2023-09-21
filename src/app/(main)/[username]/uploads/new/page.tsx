'use client';
import { Image } from '@nextui-org/image';
import { Button } from '@nextui-org/button';
import { GoCheck, GoUpload } from 'react-icons/go';
import { useDisclosure } from '@nextui-org/modal';
import UploadModal from './UploadModal';
import { useSession } from 'next-auth/react';
import { ContributorApplication, Role } from '@prisma/client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { User } from 'next-auth';

type Props = { params: { username: string } };

export default function UploadPage({ params: { username } }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [application, setApplication] = useState<ContributorApplication | null>(
    null,
  );

  useEffect(() => {
    async function fetchUser() {
      const { data } = await axios.get(
        `/api/users/contributors/applications?username=${username}`,
      );
      if (data.application) {
        setApplication(data.application);
      }
    }
    fetchUser();
  }, [username]);

  if (!session?.user) return null;

  const becomeContributor = async () => {
    setLoading(true);
    try {
      console.log('sending request');
      const { data } = await axios.post('/api/users/contributors/applications');
      if (data.application) {
        setApplication(data.application);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UploadModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <section className="flex flex-col justify-center items-center w-full h-screen">
        <Image
          src="/images/photo_session.svg"
          alt="photo upload "
          width={400}
        />
        <h1 className="text-2xl font-semibold text-gray-700 mt-8">
          Upload Your Photo
        </h1>
        <p className="text-sm text-gray-500 sm:w-96 text-center my-4">
          {canUpload(session?.user)
            ? 'Please note that all photos are subject to review before they can be published on the photo bank'
            : 'You have to be a contributor to upload photos'}
        </p>
        {canUpload(session?.user) ? (
          <Button
            onPress={onOpen}
            startContent={<GoUpload />}
            color="primary"
            className="mt-5"
          >
            Upload
          </Button>
        ) : (
          <Button
            color="primary"
            variant="light"
            onClick={becomeContributor}
            isDisabled={!!application}
            startContent={application && <GoCheck />}
            isLoading={loading}
          >
            {application ? 'Application Sent' : 'Become a Contributor'}
          </Button>
        )}
      </section>
    </>
  );
}

function canUpload(user: User | undefined) {
  const validRoles: Role[] = ['contributor', 'moderator', 'admin'];
  return user?.role && validRoles.includes(user.role);
}
