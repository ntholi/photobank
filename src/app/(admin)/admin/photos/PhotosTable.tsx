import {
  Table,
  Image,
  TableTr,
  TableTd,
  TableThead,
  TableTh,
  TableTbody,
  Anchor,
} from '@mantine/core';
import { Photo } from '@prisma/client';
import { StatusDisplay } from './[id]/PhotoStatusUpdate';
import { thumbnail } from '@/lib/config/urls';
import Link from 'next/link';

export default function PhotosTable({ photos }: { photos: Photo[] }) {
  const rows = photos.map((it) => (
    <TableTr key={it.id}>
      <TableTd w={80}>
        <Link href={`/admin/photos/${it.id}`}>
          <Image
            src={thumbnail(it.fileName)}
            alt={it.caption || ''}
            width={50}
            height={50}
            fit="contain"
          />
        </Link>
      </TableTd>
      <TableTd>
        <Anchor component={Link} href={`/admin/photos/${it.id}`}>
          {it.id}
        </Anchor>
      </TableTd>
      <TableTd>{it.caption}</TableTd>
      <TableTd>
        <StatusDisplay status={it.status} size="xs" />
      </TableTd>
      <TableTd>{it.createdAt && it.createdAt.toLocaleString()}</TableTd>
    </TableTr>
  ));

  return (
    <Table striped withTableBorder highlightOnHover>
      <TableThead>
        <TableTr>
          <TableTh>Photo</TableTh>
          <TableTh>ID</TableTh>
          <TableTh>Caption</TableTh>
          <TableTh>Status</TableTh>
          <TableTh>Date Uploaded</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>{rows}</TableTbody>
    </Table>
  );
}
