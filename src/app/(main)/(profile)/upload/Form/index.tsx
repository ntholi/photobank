'use client';
import { Button, Textarea } from '@nextui-org/react';
import { Location } from '@prisma/client';
import { useState } from 'react';
import LocationInput from './LocationInput';

type Props = {
  loading?: boolean;
  disabled?: boolean;
  onSubmit: (location?: Location, caption?: string) => Promise<void>;
};

export default function PhotoUploadForm({
  loading,
  disabled,
  onSubmit,
}: Props) {
  const [location, setLocation] = useState<Location>();
  const [caption, setCaption] = useState<string>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(location, caption);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} method='POST'>
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
