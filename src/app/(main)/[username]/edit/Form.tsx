'use client';
import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { User as UserComponent } from '@nextui-org/user';
import { User } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type InputType = {
  firstName: string;
  lastName: string;
  bio: string;
  website: string;
};

type Props = {
  user: User;
};

export default function Form({ user }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InputType>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<InputType> = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/users/${user.id}`, formData);
      console.log({ data });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('bio', user.bio || '');
      setValue('website', user.website || '');
    }
  }, []);

  return (
    <form
      className="mt-8 md:m-8 space-y-3 md:w-[40vw]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <UserComponent
        name={user?.username}
        description={
          <Link href="#" size="sm" className={'text-xs'}>
            Change Profile Picture
          </Link>
        }
        avatarProps={{
          src: user?.image || undefined,
          size: 'lg',
        }}
      />

      <Input
        type="text"
        variant="bordered"
        label="First Name"
        defaultValue={user?.firstName || ''}
        errorMessage={errors.firstName?.message}
        {...register('firstName', { required: true })}
      />
      <Input
        type="text"
        variant="bordered"
        label="Last Name"
        defaultValue={user?.lastName || ''}
        errorMessage={errors.lastName?.message}
        {...register('lastName', { required: true })}
      />
      <Textarea
        type="text"
        variant="bordered"
        label="Bio"
        defaultValue={user?.bio || ''}
        errorMessage={errors.bio?.message}
        {...(register('bio'), { maxLength: 160 })}
      />
      <Input
        type="text"
        variant="bordered"
        label="Website or Social Profile"
        defaultValue={user?.website || ''}
        errorMessage={errors.website?.message}
        {...register('website', {
          pattern: {
            value: /^(ftp|http|https):\/\/[^ "]+$/,
            message: 'Please enter a valid URL',
          },
        })}
      />
      <Button
        type="submit"
        className="w-full md:w-60"
        color="primary"
        isLoading={loading}
      >
        Save
      </Button>
    </form>
  );
}
