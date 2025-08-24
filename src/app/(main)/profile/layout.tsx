import NavbarComponent from '../base/Navbar';

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
