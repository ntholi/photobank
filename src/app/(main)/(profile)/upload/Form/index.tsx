'use client';
import { Button, cn, Progress, Textarea } from '@nextui-org/react';
import { Location } from '@prisma/client';
import { useState } from 'react';
import LocationInput from './LocationInput';

type Props = {
  progress: number | undefined;
  progressMessage?: string;
  disabled?: boolean;
  onSubmit: (location?: Location, caption?: string) => Promise<void>;
};

export default function PhotoUploadForm({
  progress,
  progressMessage,
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
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
        method='POST'
      >
        <LocationInput location={location} setLocation={setLocation} />
        <Textarea
          label='Caption'
          variant='bordered'
          placeholder='(Optional)'
          value={caption as string}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Progress
          className={cn(progress === undefined ? 'invisible' : 'visible')}
          isIndeterminate={progress === 0}
          value={progress}
          size='sm'
        />
        <Button
          color='primary'
          type='submit'
          className='w-full'
          disabled={disabled}
        >
          Save
        </Button>
      </form>
    </div>
  );
}
