'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input, Textarea } from '@nextui-org/input';
import React from 'react';
import { Button } from '@nextui-org/button';
import axios from 'axios';

type InputType = {
  name: string;
  description: string;
  location: string;
};

export default function PhotoUploadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputType>();
  const [loading, setLoading] = React.useState(false);

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setLoading(true);
    try {
      axios.post('/api/photo', data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} method="POST">
        <div className="space-y-6">
          <Input
            label="Name"
            type="text"
            variant="bordered"
            {...register('name', { required: true })}
          />
          <Input
            label="Location"
            type="text"
            variant="bordered"
            {...register('location', { required: true })}
          />
          <Textarea
            label="Description"
            labelPlacement="outside"
            variant="bordered"
            placeholder="Describe your photo (one sentance story about your photo)"
            {...register('description')}
          />
          <Button type="submit" isLoading={loading} className="w-full">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
