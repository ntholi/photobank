'use client';

import { content } from '@/db/schema';
import { Form } from '@/components/adease';
import { TextInput, Select, Stack } from '@mantine/core';
import LocationPicker from '@/app/components/LocationPicker';
import FileUpload from './FileUpload';
import { useState } from 'react';
import { createInsertSchema } from 'drizzle-zod';
import { useRouter } from 'next/navigation';
import { uploadContentFile } from '@/server/content/uploadActions';
import { notifications } from '@mantine/notifications';

type Content = typeof content.$inferInsert;
type FormContent = Omit<
  Content,
  | 's3Key'
  | 'thumbnailKey'
  | 'watermarkedKey'
  | 'fileSize'
  | 'id'
  | 'createdAt'
  | 'updatedAt'
>;

type Props = {
  onSubmit: (values: Content) => Promise<Content>;
  defaultValues?: Content;
  onSuccess?: (value: Content) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>
  ) => void;
  title?: string;
  initialLocationName?: string;
};

export default function ContentForm({
  onSubmit,
  defaultValues,
  title,
  initialLocationName,
}: Props) {
  const router = useRouter();
  const [locationName, setLocationName] = useState<string>(
    initialLocationName ?? ''
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFormSubmit = async (values: FormContent) => {
    if (selectedFile && !defaultValues) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResult = await uploadContentFile(formData);

        const contentData: Content = {
          ...values,
          fileName: uploadResult.fileName,
          s3Key: uploadResult.key,
          thumbnailKey: uploadResult.thumbnailKey,
          watermarkedKey: uploadResult.watermarkedKey,
          fileSize: uploadResult.fileSize,
          type: selectedFile.type.startsWith('image/') ? 'image' : 'video',
        };

        return await onSubmit(contentData);
      } catch (error) {
        notifications.show({
          title: 'Upload Error',
          message:
            error instanceof Error ? error.message : 'Failed to upload file',
          color: 'red',
        });
        throw error;
      } finally {
        setUploading(false);
      }
    } else {
      return await onSubmit(values as Content);
    }
  };

  return (
    <Form
      title={title}
      action={handleFormSubmit}
      queryKey={['content']}
      schema={
        createInsertSchema(content).omit({
          id: true,
          createdAt: true,
          updatedAt: true,
          s3Key: true,
          thumbnailKey: true,
          watermarkedKey: true,
          fileSize: true,
          type: true,
          status: true,
        }) as any
      }
      defaultValues={defaultValues}
      onSuccess={(result) => {
        const contentWithId = result as Content & { id: string };
        router.push(`/dashboard/content/${contentWithId.id}`);
      }}
    >
      {(form) => (
        <Stack gap='md'>
          {!defaultValues && (
            <FileUpload
              value={selectedFile}
              onChange={setSelectedFile}
              label='Content File'
              placeholder='Upload image or video'
              required
            />
          )}

          <TextInput
            label='File Name'
            {...form.getInputProps('fileName')}
            value={
              selectedFile?.name || form.getInputProps('fileName').value || ''
            }
            readOnly={!!selectedFile}
          />

          <input type='hidden' {...form.getInputProps('locationId')} />
          <LocationPicker
            label='Location'
            placeholder='Search locations'
            value={locationName}
            onChange={(v) => setLocationName(v)}
            onLocationSelect={(selected) => {
              form.setFieldValue('locationId', selected.id);
              setLocationName(selected.name);
            }}
          />
        </Stack>
      )}
    </Form>
  );
}
