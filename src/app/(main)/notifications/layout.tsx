import NavbarComponent from '../base/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications',
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
