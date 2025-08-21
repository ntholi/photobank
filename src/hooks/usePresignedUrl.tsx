import { useQuery } from '@tanstack/react-query';

interface PresignedUrlResponse {
  url: string;
  expiresIn: number;
  fileName: string;
}

async function fetchPresignedUrl(
  contentId: string
): Promise<PresignedUrlResponse> {
  const response = await fetch(`/api/content/${contentId}/presigned-url`);

  if (!response.ok) {
    throw new Error('Failed to fetch presigned URL');
  }

  return response.json();
}

export function usePresignedUrl(contentId: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ['presigned-url', contentId],
    queryFn: () => fetchPresignedUrl(contentId),
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
  });
}
