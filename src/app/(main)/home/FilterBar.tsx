import React from 'react';
import axios from 'axios';
import { Button } from '@nextui-org/button';
import { Tag } from '@prisma/client';

type Props = {
  setTag: React.Dispatch<React.SetStateAction<Tag | null>>;
};

export default function FilterBar({ setTag }: Props) {
  const [items, setItems] = React.useState<Tag[]>([]);

  React.useEffect(() => {
    axios.get('/api/filters').then((res) => {
      if (res.data.filters) {
        setItems(res.data.filters);
      }
    });
  }, []);
  return (
    <nav className="flex mt-2 gap-x-2">
      {items.map((item) => (
        <Button
          key={`${item.name}+${item.id}`}
          color="default"
          size="md"
          onClick={() => setTag(item)}
        >
          {item.name}
        </Button>
      ))}
    </nav>
  );
}
