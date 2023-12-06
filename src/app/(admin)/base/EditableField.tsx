'use client';

import { ActionIcon, Group, Text, TextInput } from '@mantine/core';
import { IconDeviceFloppy, IconEdit } from '@tabler/icons-react';
import { useState, useTransition } from 'react';

type Props = {
  label: string;
  id: any;
  value?: any;
  action: (id: string, value: any) => Promise<void>;
};

export default function EditableField({ id, label, value, action }: Props) {
  const [editOn, setEditOn] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = async () => {
    startTransition(async () => {
      console.log('start');
      await action(id, newValue);
      console.log('end');
      setEditOn(false);
    });
  };

  return (
    <div>
      <Text c="dimmed" fw="bold" fs="sm">
        {label}
      </Text>
      {editOn ? (
        <Group>
          <TextInput
            value={newValue}
            onChange={(event) => setNewValue(event.currentTarget.value)}
          />
          <ActionIcon variant="default" size="lg" onClick={handleUpdate}>
            <IconDeviceFloppy size="1.1rem" />
          </ActionIcon>
        </Group>
      ) : (
        <Group>
          <Text fs="sm">{value}</Text>
          <ActionIcon variant="subtle" onClick={() => setEditOn(true)}>
            <IconEdit size="0.9rem" />
          </ActionIcon>
        </Group>
      )}
    </div>
  );
}
