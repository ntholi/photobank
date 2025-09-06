'use client';
import AboutDrawer from '../AboutDrawer';
import { locations, content as contentSchema } from '@/db/schema';

type Location = typeof locations.$inferSelect;
type Content = typeof contentSchema.$inferSelect;

type Props = {
  location: Location & {
    coverContent: Content | null;
    about: string | null;
    virtualTourUrl?: string | null;
  };
};

export default function AboutTab({ location }: Props) {
  if (!location.about) return null;
  return (
    <div className='border-divider border-t pt-4'>
      <h2 className='text-foreground mb-3 flex items-center space-x-2 text-xl font-semibold'>
        <span>About this location</span>
      </h2>
      <AboutDrawer rawHtml={location.about} title={`About ${location.name}`} />
    </div>
  );
}
