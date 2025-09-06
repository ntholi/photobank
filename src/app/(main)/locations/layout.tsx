import NavbarComponent from '../base/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Locations',
  description:
    'Discover beautiful locations across Lesotho. Explore the Mountain Kingdom through our interactive map and location-based content.',
};

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='bg-background min-h-screen'>
      <NavbarComponent />
      <main>{children}</main>
    </div>
  );
}
