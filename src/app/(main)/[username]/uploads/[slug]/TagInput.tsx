import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import React from 'react';
import { Chip } from '@nextui-org/chip';

type Props = {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TagInput({ tags, setTags }: Props) {
  const [tag, setTag] = React.useState<string>('');

  const handleAddTag = () => {
    if (tag && !tags.includes(tag)) {
      const newTag = tag
        .trim()
        .split(' ')
        .map((it) => it[0].toUpperCase() + it.substring(1).toLowerCase())
        .join(' ');
      setTags((prev) => [...prev, newTag]);
      setTag('');
    }
  };

  return (
    <div>
      {tags.map((tag) => (
        <Chip
          key={tag}
          onClose={() => {
            setTags((prev) => prev.filter((t) => t !== tag));
          }}
          className="me-1"
        >
          {tag}
        </Chip>
      ))}
      <Input
        label="Tag"
        type="text"
        variant="bordered"
        className="mt-1"
        onValueChange={setTag}
        value={tag}
        endContent={<Button onClick={handleAddTag}>Add</Button>}
      />
    </div>
  );
}
