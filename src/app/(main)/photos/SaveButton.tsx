import api from '@/lib/config/api';
import { Button } from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useTransition } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa6';

type Props = {
  photoId: string;
};

export default function SaveButton({ photoId }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [pending, startTransaction] = useTransition();
  const [saved, setSaved] = useState(false);
  const [label, setLabel] = useState('Save');

  useEffect(() => {
    if (session) {
      axios.get(api(`/photos/saved/${photoId}`)).then((res) => {
        setSaved(res.data.isSaved);
      });
    }
  }, [photoId, session]);

  useEffect(() => {
    setLabel(saved ? 'Saved' : 'Save');
  }, [saved]);

  const handleSave = async () => {
    if (session) {
      startTransaction(async () => {
        await axios.post(api(`/photos/saved/`), {
          photoId,
          action: saved ? 'remove' : 'save',
        });
        setSaved((it) => !it);
      });
    } else {
      router.push('/signup');
    }
  };

  return (
    <Button
      color="danger"
      variant="bordered"
      className="w-32"
      startContent={saved ? <FaBookmark /> : <FaRegBookmark />}
      onClick={handleSave}
      onMouseOver={() => {
        if (saved) {
          setLabel('Remove');
        }
      }}
      onMouseOut={() => {
        setLabel(saved ? 'Saved' : 'Save');
      }}
      isLoading={pending}
    >
      {label}
    </Button>
  );
}
