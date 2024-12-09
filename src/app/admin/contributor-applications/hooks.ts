import { useQuery } from '@tanstack/react-query';
import { getPendingContributorApplications } from './actions';

export function usePendingApplications() {
  return useQuery({
    queryKey: ['pending-applications'],
    queryFn: getPendingContributorApplications,
  });
}
