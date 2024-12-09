'use client';

import { PropsWithChildren } from 'react';
import { ListItem, ListLayout, NewLink } from '@/components/adease';
import { getAllContributorApplications } from './actions';
import { IconBan, IconHourglass } from '@tabler/icons-react';
import { IconCheck } from '@tabler/icons-react';
import { ApplicationStatus } from '@prisma/client';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ListLayout
      path={'/admin/contributor-applications'}
      queryKey={['contributor-applications']}
      getItems={getAllContributorApplications}
      actionIcons={[
        <NewLink key={'new-link'} href='/admin/contributor-applications/new' />,
      ]}
      renderItem={(it) => (
        <ListItem
          id={it.id}
          label={it.user.name || it.user.id}
          rightSection={<Status status={it.status} />}
        />
      )}
    >
      {children}
    </ListLayout>
  );
}

function Status({ status }: { status: ApplicationStatus }) {
  switch (status) {
    case 'approved':
      return <IconCheck size={'1rem'} color='green' />;
    case 'rejected':
      return <IconBan size={'1rem'} color='red' />;
    default:
      return <IconHourglass size={'1rem'} color='gray' />;
  }
}
