import { Filter } from '@/lib/types';
import React from 'react';
import { Chip } from '@nextui-org/chip';
import axios from 'axios';
import { Button } from '@nextui-org/button';

export default function FilterBar() {
  const [items, setItems] = React.useState<Filter[]>([]);

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
          key={`${item.name}+${item.type}`}
          color="default"
          size="md"
          onClick={() => console.log('clicked')}
        >
          {item.name}
        </Button>
      ))}
    </nav>
  );
}
