import { Tooltip } from '@heroui/tooltip';
import { HiBadgeCheck } from 'react-icons/hi';

type Role = 'user' | 'contributor' | 'moderator' | 'admin';

interface RoleBadgeProps {
  role: Role;
  size?: 'sm' | 'md' | 'lg';
}

const roleConfig = {
  user: {
    showBadge: false,
    color: 'text-gray-400',
    tooltip: 'User',
  },
  contributor: {
    showBadge: true,
    color: 'text-blue-500',
    tooltip: 'Contributor',
  },
  moderator: {
    showBadge: true,
    color: 'text-gray-600',
    tooltip: 'Moderator',
  },
  admin: {
    showBadge: true,
    color: 'text-yellow-500',
    tooltip: 'Admin',
  },
} as const;

const sizeConfig = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export default function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const config = roleConfig[role];
  const iconSize = sizeConfig[size];

  if (!config.showBadge) {
    return null;
  }

  return (
    <Tooltip content={config.tooltip} placement='top'>
      <HiBadgeCheck
        className={`${iconSize} ${config.color} ml-1 drop-shadow-sm`}
      />
    </Tooltip>
  );
}
