'use client';
type Props = {
  url: string;
  name: string;
};

export default function VirtualTourTab({ url, name }: Props) {
  return (
    <div className='w-full'>
      <div className='border-default-200 bg-default-100 aspect-video w-full overflow-hidden rounded-lg border'>
        <iframe
          title={`${name} virtual tour`}
          src={url}
          allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking'
          allowFullScreen
          loading='lazy'
          className='h-full w-full'
        />
      </div>
    </div>
  );
}
