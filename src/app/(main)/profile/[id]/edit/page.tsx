'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@heroui/input';

import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { updateUser } from '@/server/users/actions';
import { getUser } from '@/server/users/actions';
import { useParams } from 'next/navigation';

type ProfileFormData = {
  name: string;
  bio: string;
  website: string;
};

export default function EditProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const queryClient = useQueryClient();

  const [formData, setFormData] = React.useState<ProfileFormData>({
    name: '',
    bio: '',
    website: '',
  });

  const [errors, setErrors] = React.useState<Partial<ProfileFormData>>({});

  React.useEffect(() => {
    async function loadUser() {
      try {
        const user = await getUser(userId);
        if (user) {
          setFormData({
            name: user.name || '',
            bio: user.bio || '',
            website: user.website || '',
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }
    loadUser();
  }, [userId]);

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormData) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      router.push(`/profile/${userId}`);
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updateMutation.mutate(formData);
    }
  };

  const handleChange =
    (field: keyof ProfileFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  return (
    <div className='min-h-screen max-w-2xl mx-auto px-4 py-8'>
      <div className='mb-6'>
        <Button variant='light' onPress={() => router.back()} className='mb-4'>
          ← Back
        </Button>
        <h1 className='text-2xl font-medium'>Edit Profile</h1>
        <p className='text-default-600 mt-1'>Update your profile information</p>
      </div>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Input
                label='Name'
                value={formData.name}
                onChange={handleChange('name')}
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                placeholder='Your display name'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>Bio</label>
              <textarea
                value={formData.bio}
                onChange={handleChange('bio')}
                placeholder='Tell us about yourself...'
                rows={4}
                className='w-full px-3 py-2 border border-default-300 rounded-md bg-default-50 text-default-900 placeholder-default-500 focus:border-primary focus:ring-1 focus:ring-primary'
              />
            </div>

            <div>
              <Input
                label='Website'
                value={formData.website}
                onChange={handleChange('website')}
                isInvalid={!!errors.website}
                errorMessage={errors.website}
                placeholder='https://yourwebsite.com'
                type='url'
              />
            </div>

            <div className='flex gap-3 pt-4'>
              <Button
                type='submit'
                color='primary'
                isLoading={updateMutation.isPending}
                isDisabled={updateMutation.isPending}
                className='flex-1'
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type='button'
                variant='flat'
                onPress={() => router.back()}
                isDisabled={updateMutation.isPending}
              >
                Cancel
              </Button>
            </div>

            {updateMutation.isError && (
              <div className='text-red-500 text-sm mt-2'>
                Failed to update profile. Please try again.
              </div>
            )}
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
