'use client';
import { Center, SegmentedControl, Text } from '@mantine/core';
import { ApplicationStatus, ContributorApplication } from '@prisma/client';
import {
  IconBan,
  IconCheck,
  IconCross,
  IconHourglass,
} from '@tabler/icons-react';
import React from 'react';
import { updateApplicationStatus } from '../actions';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';

type Props = {
  application: ContributorApplication;
};

export default function StatusUpdater({ application }: Props) {
  const [value, setValue] = React.useState(application.status);
  const router = useRouter();

  async function handleUpdate(status: ApplicationStatus) {
    setValue(status);
    await updateApplicationStatus(application.id, application.userId, status);
    router.refresh();
  }

  return (
    <SegmentedControl
      value={value}
      size="sm"
      onChange={(value) => {
        handleUpdate(value as ApplicationStatus);
      }}
      data={[
        {
          value: 'approved',
          label: (
            <Center style={{ gap: 10 }}>
              <IconCheck size={'0.95rem'} color="green" />
              <Text size="sm">Approve</Text>
            </Center>
          ),
        },
        {
          value: 'rejected',
          label: (
            <Center style={{ gap: 10 }}>
              <IconBan size={'0.95rem'} color="red" />
              <Text size="sm">Reject</Text>
            </Center>
          ),
        },
        {
          value: 'pending',
          label: (
            <Center style={{ gap: 10 }}>
              <IconHourglass size={'0.95rem'} color="gray" />
              <Text size="sm">Pending</Text>
            </Center>
          ),
        },
      ]}
    />
  );
}
