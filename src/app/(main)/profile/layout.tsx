import NavbarComponent from '../base/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description:
    'User profiles on Lehakoe Photobank. View uploads, saved content, and connect with photographers in Lesotho.',
};

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarComponent />
      <main>{children}</main>
    </>
  );
}
