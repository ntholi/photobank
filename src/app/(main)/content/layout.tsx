import HomeNavbar from '../base/HomeNavbar';
import NavbarComponent from '../base/Navbar';

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-background'>
      <NavbarComponent />
      <main className='pt-16'>{children}</main>
    </div>
  );
}
