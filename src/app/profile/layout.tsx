import admin from '@/lib/config/firebase-admin';
import ProfileNav from './components/ProfileNav';

export default async function ProfileLayout({ children }: { children: any }) {
  return (
    <main className="flex">
      <ProfileNav />
      {children}
    </main>
  );
}
