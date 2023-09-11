import React from 'react';
import axios from 'axios';
import { Tag } from '@prisma/client';
import { Chip } from '@nextui-org/chip';

type Props = {
  setSelected: React.Dispatch<React.SetStateAction<Tag | null>>;
  selected: Tag | null;
};

export default function FilterBar({ selected, setSelected }: Props) {
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
        <Chip
          key={`${item.name}+${item.id}`}
          className={'px-4 py-4 cursor-pointer'}
          color={selected?.id === item.id ? 'primary' : 'default'}
          onClick={() => {
            console.log({ item });
            console.log({ selected });
            setSelected(selected?.id === item.id ? null : item);
          }}
        >
          {item.name}
        </Chip>
      ))}
    </nav>
  );
}
