import { useQuery } from '@tanstack/react-query';
import { getPendingContributorApplications } from './actions';

export function usePendingApplications() {
  return useQuery({
    queryKey: ['contributor-applications'],
    queryFn: getPendingContributorApplications,
  });
}
