// app/page.tsx
import { Button } from '@nextui-org/button';
import Gallery from './home/Gallery';

export default function Page() {
  return (
    <>
      <div className="h-[80vh] flex justify-center items-center">
        <h1 className="text-6xl">PhotoBank</h1>
      </div>
      <Gallery />
    </>
  );
}
