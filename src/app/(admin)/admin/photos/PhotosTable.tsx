'use client';
import { toDateTime } from '@/lib/utils';
import { Table } from '@mantine/core';
import { Photo } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PhotoStatusUpdate, { StatusDisplay } from './[id]/PhotoStatusUpdate';

export default function PhotosTable({ photos }: { photos: Photo[] }) {
  const router = useRouter();
  const rows = photos.map((it) => (
    <Table.Tr
      className="cursor-pointer"
      key={it.id}
      onClick={() => router.push(`/admin/photos/${it.id}`)}
    >
      <Table.Td>
        {/* <Image
          src={it.url}
          alt={it.name}
          width={100}
          height={100}
          className="w-11 h-11 rounded object-cover"
        /> */}
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
