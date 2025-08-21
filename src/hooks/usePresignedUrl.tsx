import { useQuery } from '@tanstack/react-query';
import { getContentPresignedUrl } from '@/server/content/actions';

export function usePresignedUrl(contentId: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ['presigned-url', contentId],
    queryFn: () => getContentPresignedUrl(contentId),
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
  });
}
