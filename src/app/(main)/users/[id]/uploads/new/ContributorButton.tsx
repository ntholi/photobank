'use client';

import { Button } from '@nextui-org/react';
import { ContributorApplication } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { GoCheck, GoStop, GoUpload } from 'react-icons/go';
import { canUpload } from './utils';

type Props = {
  userId: string;
  onOpen: () => void;
};

export default function ContributorButton({ userId, onOpen }: Props) {
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<ContributorApplication | null>(
    null,
  );
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchUser() {
      const { data } = await axios.get(
        `/api/users/contributors/applications?id=${userId}`,
      );
      if (data.application) {
        setApplication(data.application);
      }
    }
    fetchUser();
  }, [userId]);

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
      color={getStatusColor(application?.status)}
      variant="light"
      onClick={becomeContributor}
      isDisabled={!!application}
      startContent={<StatusIcon status={application?.status} />}
      isLoading={loading}
    >
      {statusMessage(application?.status)}
    </Button>
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
