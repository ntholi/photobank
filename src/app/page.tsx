// app/page.tsx
import { Button } from '@nextui-org/button';

export default function Page() {
  return (
    <div>
      <Button color="primary">Button</Button>
      {Array.from({ length: 100 }).map((_, i) => (
        <p key={i}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum numquam
          voluptatum minus laborum nulla placeat reiciendis eveniet omnis
          repudiandae praesentium asperiores sint maxime reprehenderit
          consequuntur, consequatur quas consectetur culpa provident.
        </p>
      ))}
    </div>
  );
}
