import { Table, Image } from '@mantine/core';
import { Photo } from '@prisma/client';
import { StatusDisplay } from './[id]/PhotoStatusUpdate';
import { thumbnail } from '@/lib/config/urls';
import Link from 'next/link';

export default function PhotosTable({ photos }: { photos: Photo[] }) {
  const rows = photos.map((it) => (
    <Table.Tr key={it.id}>
      <Table.Td w={80}>
        <Link href={`/admin/photos/${it.id}`}>
          <Image
            src={thumbnail(it.fileName)}
            alt={it.caption || ''}
            fit="contain"
          />
        </Link>
      </Table.Td>
      <Table.Td>{it.id}</Table.Td>
      <Table.Td>{it.caption}</Table.Td>
      <Table.Td>
        <StatusDisplay status={it.status} size="xs" />
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
          <Table.Th>Caption</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Date Uploaded</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
