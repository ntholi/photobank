import { CreateView } from '@/app/(admin)/admin-core';
import React from 'react';
import { createCategory } from '../actions';
import { TextInput } from '@mantine/core';

export default function NewCategory() {
  return <h1>New Category</h1>;
  return (
    <CreateView onSubmit={createCategory}>
      <TextInput label="Name" placeholder="Category name" name="name" />
    </CreateView>
  );
}
