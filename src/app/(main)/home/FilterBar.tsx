import React from 'react';
import axios from 'axios';
import { Tag } from '@prisma/client';
import { Chip } from '@nextui-org/chip';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Button } from '@nextui-org/button';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

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

  const scrollLeft = () => {
    if (scrollShadow.current) {
      scrollShadow.current.scrollBy({
        top: 0,
        left: -100,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollShadow.current) {
      scrollShadow.current.scrollBy({
        top: 0,
        left: 100,
        behavior: 'smooth',
      });
    }
  };
  return (
    <nav className="flex">
      <Button
        isIconOnly
        onClick={scrollLeft}
        variant="bordered"
        size="sm"
        aria-label="Scroll Right"
        className="mt-2 me-1"
      >
        <FaChevronLeft />
      </Button>
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
                console.log({ item });
                console.log({ selected });
                setSelected(selected?.id === item.id ? null : item);
              }}
            >
              {item.name}
            </Chip>
          ))}
        </div>
      </ScrollShadow>
      <Button
        isIconOnly
        onClick={scrollRight}
        variant="bordered"
        size="sm"
        aria-label="Scroll Right"
        className="mt-2 ms-1 -me-1"
      >
        <FaChevronRight />
      </Button>
    </nav>
  );
}
