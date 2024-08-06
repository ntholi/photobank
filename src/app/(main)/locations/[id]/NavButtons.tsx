'use client';
import { Button } from '@nextui-org/react';
import { useQueryState } from 'nuqs';
import React from 'react';
import { FaImage } from 'react-icons/fa6';
import { GrThreeD } from 'react-icons/gr';

export default function NavButtons() {
  const [tab, setTab] = useQueryState('tab');

  function handleButtonClick(tab: string) {
    setTab(tab);
    smoothScrollToBody();
  }

  function smoothScrollToBody() {
    const element = document.getElementById('body');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <nav className="absolute bottom-16 flex gap-5">
      <Button
        startContent={<FaImage />}
        radius="full"
        color="primary"
        variant="bordered"
        className="border-1 border-white px-8 text-white"
        onPress={() => handleButtonClick('photos')}
      >
        Images
      </Button>
      <Button
        startContent={<GrThreeD />}
        radius="full"
        color="primary"
        variant="bordered"
        className="border-1 border-white px-8 text-white"
        onPress={() => handleButtonClick('tour')}
      >
        Virtual Tour
      </Button>
    </nav>
  );
}
