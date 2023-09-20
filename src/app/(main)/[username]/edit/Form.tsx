'use client';
import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { User as UserComponent } from '@nextui-org/user';
import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type InputType = {
  username: string;
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
  const [bioLength, setBioLength] = useState(0);
  const router = useRouter();

  const onSubmit: SubmitHandler<InputType> = async (formData) => {
    try {
      setLoading(true);
      await axios.put(`/api/users/${user.id}`, formData);
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
      setBioLength(user.bio?.length || 0);
    }
  }, []);

  return (
    <form
      className="mt-8 md:m-8 space-y-3 md:w-[40vw]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <UserComponent
        name={user?.id}
        description={
          <Link href="#" size="sm" className={'text-xs'}>
            Change Profile Picture
          </Link>
        }
        avatarProps={{
          src: user?.image || '/images/profile.png',
          size: 'lg',
        }}
      />

      <Input
        type="text"
        variant="bordered"
        label="Username"
        defaultValue={user?.username || ''}
        errorMessage={errors.username?.message}
        {...register('username', { required: true })}
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
        description={`${bioLength}/160`}
        onValueChange={(e) => setBioLength(e.length)}
        errorMessage={errors.bio?.message}
        {...register('bio', { maxLength: 160 })}
      />
      <Input
        type="text"
        variant="bordered"
        label="Website or Social Profile"
        defaultValue={user?.website || ''}
        errorMessage={errors.website?.message}
        {...register('website', {
          pattern: {
            value:
              /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
            message: 'Please enter a valid URL',
          },
        })}
      />
      <footer className="flex gap-3 pt-5">
        <Button
          onClick={() => {
            router.back();
          }}
          variant="bordered"
          // color="danger"
          className="w-40"
          isDisabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="primary"
          className="w-40"
          isLoading={loading}
        >
          Save
        </Button>
      </footer>
    </form>
  );
}
