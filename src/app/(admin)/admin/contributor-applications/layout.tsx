import prisma from '@/lib/prisma';
import { PropsWithChildren } from 'react';
import ListPage from '../../components/ListPage';
import { ApplicationStatus } from '@prisma/client';
import { IconCheck, IconCross, IconHourglass } from '@tabler/icons-react';

export default async function Layout({ children }: PropsWithChildren) {
  const list = await prisma.contributorApplication.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <ListPage
      path="admin/contributor-applications"
      nav={list.map((item) => ({
        label: item.user.name || item.user.email,
        href: `/admin/contributor-applications/${item.id}`,
        leftSection: <Status status={item.status} />,
      }))}
    >
      {children}
    </ListPage>
  );
}

function Status({ status }: { status: ApplicationStatus }) {
  switch (status) {
    case 'approved':
      return <IconCheck size={'1rem'} color="green" />;
    case 'rejected':
      return <IconCross size={'1rem'} color="red" />;
    default:
      return <IconHourglass size={'1rem'} color="gray" />;
  }
}
