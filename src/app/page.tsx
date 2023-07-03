import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

async function fetchDatetime() {
  const res = await fetch('http://worldtimeapi.org/api/timezone/Africa/Maseru');
  const data = await res.json();
  return data;
}

export default async function Home() {
  const time = await fetchDatetime();
  return (
    <main className="flex h-screen items-center justify-center bg-gray-900">
      <div>
        <h1 className="text-center text-8xl text-gray-50">PhotBank</h1>
        <p className="mt-4 text-center text-xl uppercase text-gray-50">
          the time is {time.datetime}
        </p>
      </div>
    </main>
  );
}
