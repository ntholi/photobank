'use client';
import { Button, cn, Progress, Textarea } from '@nextui-org/react';
import { Location } from '@prisma/client';
import { useState } from 'react';
import LocationInput from './LocationInput';

type Props = {
  progress: number | undefined;
  isSaving?: boolean;
  onSubmit: (location?: Location, description?: string) => Promise<void>;
};

export default function PhotoUploadForm({
  progress,
  isSaving,
  onSubmit,
}: Props) {
  const [location, setLocation] = useState<Location>();
  const [description, setCaption] = useState<string>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(location, description);
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
          label='Description'
          variant='bordered'
          placeholder='(Optional)'
          value={description as string}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Progress
          className={cn(progress === undefined ? 'invisible' : 'visible')}
          color='success'
          isIndeterminate={progress === 0}
          showValueLabel
          value={progress}
          size='sm'
        />
        <Button
          color='primary'
          type='submit'
          className='w-full'
          isLoading={isSaving}
          isDisabled={progress !== undefined}
        >
          Save
        </Button>
      </form>
    </div>
  );
}
