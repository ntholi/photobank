import AdminNav from './components/AdminNav';

export default async function ProfileLayout({ children }: { children: any }) {
  return (
    <main className="flex">
      <div className="sm:float-right sm:w-[25vw]">
        <AdminNav />
      </div>
      <section className="w-screen px-10 ">{children}</section>
    </main>
  );
}
