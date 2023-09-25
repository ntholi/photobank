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
    <nav className="flex relative">
      <div className="absolute left-0 z-20 pe-2 bg-background/50 drop-shadow-2xl">
        <Button
          isIconOnly
          onClick={scrollLeft}
          size="sm"
          color="success"
          aria-label="Scroll Right"
          className="mt-2"
        >
          <FaChevronLeft />
        </Button>
      </div>
      <div className="flex overflow-x-scroll no-scrollbar" ref={scrollShadow}>
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
      </div>
      <Button
        isIconOnly
        onClick={scrollRight}
        variant="bordered"
        size="sm"
        aria-label="Scroll Right"
        className="mt-2 absolute right-0 z-10"
      >
        <FaChevronRight />
      </Button>
    </nav>
  );
}
