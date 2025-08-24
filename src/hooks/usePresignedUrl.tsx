import { useQuery } from '@tanstack/react-query';
import { getPresignedUrl } from '@/server/content/actions';

export function usePresignedUrl(s3Key: string, enabled: boolean = false) {
  const query = useQuery({
    queryKey: ['presigned-url', s3Key],
    queryFn: () => getPresignedUrl(s3Key),
    enabled: enabled && Boolean(s3Key),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
  });

  return {
    ...query,
    url: query.data,
  };
}
