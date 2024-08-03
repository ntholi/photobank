import api from '@/lib/config/api';
import { Button } from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { FaBookmark } from 'react-icons/fa6';

type Props = {
  photoId: string;
};

export default function SaveButton({ photoId }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [pending, startTransaction] = useTransition();

  const handleSave = async () => {
    if (session) {
      startTransaction(async () => {
        await axios.post(api(`/photos/saved/`), { photoId });
      });
    } else {
      router.push('/signup');
    }
  };

  return (
    <Button
      color="danger"
      variant="bordered"
      startContent={<FaBookmark />}
      onClick={handleSave}
      isLoading={pending}
    >
      Save
    </Button>
  );
}
