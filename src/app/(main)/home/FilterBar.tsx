import { Chip, ScrollShadow } from '@nextui-org/react';
import { Tag } from '@prisma/client';
import axios from 'axios';
import React from 'react';

type Props = {
  setSelected: React.Dispatch<React.SetStateAction<Tag | null>>;
  selected: Tag | null;
};

export default function FilterBar({ selected, setSelected }: Props) {
  const [items, setItems] = React.useState<Tag[]>([]);
  const scrollShadow = React.useRef<any>(null);

  React.useEffect(() => {
    axios.get('/api/filters').then((res) => {
      if (res.data.filters) {
        setItems(res.data.filters);
      }
    });
  }, []);

  return (
    <nav className="flex">
      <ScrollShadow
        orientation="horizontal"
        hideScrollBar
        offset={10}
        ref={scrollShadow}
      >
        <div className="flex mt-2 gap-x-2">
          {items.map((item) => (
            <Chip
              key={`${item.name}+${item.id}`}
              className={'px-4 py-4 cursor-pointer'}
              color={selected?.id === item.id ? 'primary' : 'default'}
              onClick={() => {
                setSelected(selected?.id === item.id ? null : item);
              }}
            >
              {item.name}
            </Chip>
          ))}
        </div>
      </ScrollShadow>
    </nav>
  );
}
