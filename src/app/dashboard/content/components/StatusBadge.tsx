import { ContentStatus } from '@/db/schema';
import { Badge } from '@mantine/core';

type Props = {
  status: ContentStatus;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'filled' | 'outline' | 'dot' | 'transparent';
};

function getStatusConfig(status: ContentStatus) {
  const configs = {
    draft: {
      color: 'gray',
      label: 'Draft',
    },
    pending: {
      color: 'yellow',
      label: 'Pending',
    },
    published: {
      color: 'green',
      label: 'Published',
    },
    rejected: {
      color: 'red',
      label: 'Rejected',
    },
    archived: {
      color: 'blue',
      label: 'Archived',
    },
  };

  return (
    configs[status] || {
      color: 'gray',
      label: status,
    }
  );
}

export function StatusBadge({ status, size = 'sm', variant = 'dot' }: Props) {
  const config = getStatusConfig(status);

  return (
    <Badge color={config.color} size={size} variant={variant}>
      {config.label}
    </Badge>
  );
}
