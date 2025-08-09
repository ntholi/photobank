import { useQueryState } from 'nuqs';

export function useViewSelect() {
  return useQueryState('view', {
    defaultValue: 'nav' as 'nav' | 'details',
    parse: (value): 'nav' | 'details' =>
      value === 'details' ? 'details' : 'nav',
  });
}
