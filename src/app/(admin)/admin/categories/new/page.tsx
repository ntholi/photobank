import { CreateView, TextField } from '@/app/(admin)/admin-core';
import React from 'react';
import { createCategory } from '../actions';

export default function NewCategory() {
  return (
    <CreateView onCreate={createCategory}>
      <TextField label="Name" name="name" />
    </CreateView>
  );
}
