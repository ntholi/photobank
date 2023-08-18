'use client';
import { Badge, Table } from '@mantine/core';
import { Photo, PhotoStatus } from '@prisma/client';
import Image from 'next/image';

export default function PhotosTable({ photos }: { photos: Photo[] }) {
  const rows = photos.map((it) => (
    <Table.Tr key={it.name}>
      <Table.Td>
        <Image
          src={it.url}
          alt={it.name}
          width={50}
          height={50}
          className="rounded object-cover"
        />
      </Table.Td>
      <Table.Td>{it.id}</Table.Td>
      <Table.Td>{it.name}</Table.Td>
      <Table.Td>{asBadge(it.status)}</Table.Td>
      <Table.Td>{it.createdAt.toString()}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table striped withTableBorder>
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

const asBadge = (status: PhotoStatus) => {
  let color: string;
  switch (status) {
    case 'pending':
      color = 'orange';
      break;
    case 'approved':
      color = 'green';
      break;
    case 'rejected':
      color = 'red';
      break;
  }
  return <Badge color={color}>{status}</Badge>;
};
