'use client';

import { Button } from '@nextui-org/react';
import { ContributorApplication } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { GoCheck, GoUpload } from 'react-icons/go';
import { canUpload } from './utils';

type Props = {
  username: string;
  onOpen: () => void;
};

export default function ContributorButton({ username, onOpen }: Props) {
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<ContributorApplication | null>(
    null,
  );
  const { data: session } = useSession();

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
  return canUpload(session?.user) ? (
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
      {application?.status == 'approved'
        ? 'Application Sent'
        : 'Become a Contributor'}
    </Button>
  );
}
