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
    <main className="flex h-screen justify-center items-center bg-gray-900">
      <div>
        <h1 className="text-8xl text-gray-50 text-center">PhotBank</h1>
        <p className="text-xl text-gray-50 text-center mt-4 uppercase">
          the time is {time.datetime}
        </p>
      </div>
    </main>
  );
}
