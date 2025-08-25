'use client';
import AboutDrawer from '../AboutDrawer';

export default function AboutTab({
  name,
  about,
}: {
  name: string;
  about?: string | null;
}) {
  if (!about) return null;
  return (
    <div className='border-t border-gray-200 pt-4'>
      <h2 className='mb-3 flex items-center space-x-2 text-xl font-semibold text-gray-900'>
        <span>About this location</span>
      </h2>
      <AboutDrawer rawHtml={about} title={`About ${name}`} />
    </div>
  );
}
