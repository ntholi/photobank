import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main className="flex h-screen justify-center items-center bg-gray-900">
      <div>
        <h1 className="text-8xl text-gray-50 text-center">PhotBank</h1>
        <p className="text-xl text-gray-50 text-center mt-4 uppercase">
          {JSON.stringify(session)}
        </p>
      </div>
    </main>
  );
}
