'use client';

import LocationPicker from '@/app/components/LocationPicker';
import { Form } from '@/components/adease';
import { content } from '@/db/schema';
import { uploadContentFile } from '@/server/content/uploadActions';
import type { ContentLabel as RecognitionContentLabel } from '@/lib/recognition';
import { Stack, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { createInsertSchema } from 'drizzle-zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ExistingContentDisplay from '../components/ExistingContentDisplay';
import FileUpload from '../components/FileUpload';
import TagInput from './TagInput';

type Content = typeof content.$inferInsert;
type FormContent = Omit<Content, 'id' | 'createdAt' | 'updatedAt'> & {
  locationData?: {
    placeId: string;
    name: string;
    address?: string | null;
    latitude: number;
    longitude: number;
  };
  contentLabels?: RecognitionContentLabel[];
  selectedTags?: Array<{ tag: string; confidence: number }>;
};

type Props = {
  onSubmit: (values: FormContent) => Promise<Content>;
  defaultValues?: Content & {
    tags?: Array<{
      tag: {
        name: string;
        id: string;
      };
    }>;
  };
  onSuccess?: (value: Content) => void;
  onError?: (
    error: Error | React.SyntheticEvent<HTMLDivElement, Event>,
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
    initialLocationName ?? '',
  );
  const [locationData, setLocationData] = useState<
    | {
        placeId: string;
        name: string;
        address?: string | null;
        latitude: number;
        longitude: number;
      }
    | undefined
  >();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    defaultValues?.tags?.map((contentTag) => contentTag.tag.name) || [],
  );

  const handleFormSubmit = async (values: FormContent) => {
    if (selectedFile && !defaultValues) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadOptions =
          selectedTags.length > 0 ? { manualTags: selectedTags } : {};

        const uploadResult = await uploadContentFile(formData, uploadOptions);

        const contentData: FormContent = {
          ...values,
          fileName: uploadResult.fileName,
          s3Key: uploadResult.key,
          thumbnailKey: uploadResult.thumbnailKey,
          watermarkedKey: uploadResult.watermarkedKey,
          fileSize: uploadResult.fileSize,
          type: selectedFile.type.startsWith('image/') ? 'image' : 'video',
          locationData: locationData,
          contentLabels: uploadResult.contentLabels,
          selectedTags:
            selectedTags.length > 0
              ? selectedTags.map((tag) => ({ tag, confidence: 100 }))
              : uploadResult.selectedTags,
        };

        const createdContent = await onSubmit(contentData);

        return createdContent;
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
      const formContentData: FormContent = {
        ...values,
        locationData: locationData,
        selectedTags: selectedTags.map((tag) => ({ tag, confidence: 100 })),
      };
      const updatedContent = await onSubmit(formContentData);

      return updatedContent;
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
          fileName: true,
          type: true,
          status: true,
          locationId: true,
          userId: true,
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
          {defaultValues ? (
            <ExistingContentDisplay content={defaultValues as any} />
          ) : (
            <FileUpload
              value={selectedFile}
              onChange={setSelectedFile}
              label='Content File'
              placeholder='Upload image or video'
              required
            />
          )}

          <LocationPicker
            label='Location'
            placeholder='Search locations'
            value={locationName}
            onChange={(v) => setLocationName(v)}
            onLocationSelect={(selected) => {
              setLocationData(selected);
              setLocationName(selected.name);
            }}
          />

          <Textarea
            {...form.getInputProps('description')}
            label='Description'
            placeholder='Enter description'
            minRows={3}
            autosize
          />

          <TagInput
            value={selectedTags}
            onChange={setSelectedTags}
            label='Tags'
            placeholder='Select or type tags'
          />
        </Stack>
      )}
    </Form>
  );
}
