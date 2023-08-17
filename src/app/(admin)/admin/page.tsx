import Link from 'next/link';
import { Button } from '@mantine/core';

export default function AdminPage() {
  return (
    <Button className="m-5" component={Link} href="#">
      Next link button
    </Button>
  );
}
