import NavbarComponent from '../base/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Virtual Tours',
  description:
    'Experience Lesotho through immersive 360° virtual tours. Explore the Mountain Kingdom from anywhere in the world.',
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
