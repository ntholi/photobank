'use client';
import { profilePath } from '@/lib/constants';
import { Button, Textarea } from '@nextui-org/react';
import { Location, Photo } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LocationInput from './LocationInput';

type Props = {
  photo: Photo & { location: Location | null };
  disabled?: boolean;
};

export default function PhotoUploadForm({ photo, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const { user } = useSession().data || {};
  const router = useRouter();
  const [location, setLocation] = useState<Location>();
  const [caption, setCaption] = useState<string>();

  useEffect(() => {
    setLocation(photo.location || undefined);
    setCaption(photo.caption || '');
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('submitting');
    setLoading(true);
    console.log(location);
    try {
      await axios.put(`/api/photos/${photo.id}`, {
        location,
        caption,
      });
      router.push(profilePath(user));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} method='POST'>
        <LocationInput location={location} setLocation={setLocation} />
        <Textarea
          className='mt-6'
          label='Caption'
          variant='bordered'
          placeholder='(Optional)'
          value={caption as string}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Button
          color='primary'
          type='submit'
          isLoading={loading}
          className='mt-6 w-full'
          disabled={disabled}
        >
          Save
        </Button>
      </form>
    </div>
  );
}
