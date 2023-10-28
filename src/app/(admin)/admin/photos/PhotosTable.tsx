'use client';
import { toDateTime } from '@/lib/utils';
import { Table, Image } from '@mantine/core';
import { Photo } from '@prisma/client';
import { useRouter } from 'next/navigation';
import PhotoStatusUpdate, { StatusDisplay } from './[id]/PhotoStatusUpdate';
import { thumbnail } from '@/lib/config/urls';

export default function PhotosTable({ photos }: { photos: Photo[] }) {
  const router = useRouter();
  const rows = photos.map((it) => (
    <Table.Tr
      style={{ cursor: 'pointer' }}
      key={it.id}
      onClick={() => router.push(`/admin/photos/${it.id}`)}
    >
      <Table.Td w={80}>
        <Image
          src={thumbnail(it.fileName)}
          alt={it.caption || ''}
          fit="contain"
        />
      </Table.Td>
      <Table.Td>{it.id}</Table.Td>
      <Table.Td>{it.caption}</Table.Td>
      <Table.Td>
        <StatusDisplay status={it.status} />
      </Table.Td>
      <Table.Td>{it.createdAt && it.createdAt.toLocaleString()}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table striped withTableBorder highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Photo</Table.Th>
          <Table.Th>ID</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Date</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
