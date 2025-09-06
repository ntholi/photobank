import NavbarComponent from '../base/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content',
  description:
    'Explore stunning photography and content from across Lesotho. Discover the beauty of the Mountain Kingdom through high-quality images.',
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
