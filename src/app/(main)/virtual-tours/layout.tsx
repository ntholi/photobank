import NavbarComponent from '../base/Navbar';

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-background'>
      <NavbarComponent />
      <main>{children}</main>
    </div>
  );
}
