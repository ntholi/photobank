'use client';

import React from 'react';
import { Button } from '@heroui/button';
import { ButtonGroup } from '@heroui/button';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Chip } from '@heroui/chip';
import { IoMdSearch, IoMdClose, IoMdCheckmarkCircle } from 'react-icons/io';

interface NotificationFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  status: 'all' | 'unread' | 'read' | 'archived';
  onStatusChange: (status: 'all' | 'unread' | 'read' | 'archived') => void;
  type: string;
  onTypeChange: (type: string) => void;
  unreadCount: number;
  onMarkAllAsRead: () => void;
  isMarkingAllAsRead: boolean;
}

export default function NotificationFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  type,
  onTypeChange,
  unreadCount,
  onMarkAllAsRead,
  isMarkingAllAsRead,
}: NotificationFiltersProps) {
  const statusOptions = [
    { key: 'all', label: 'All notifications' },
    { key: 'unread', label: 'Unread' },
    { key: 'read', label: 'Read' },
    { key: 'archived', label: 'Archived' },
  ];

  const typeOptions = [
    { key: 'all', label: 'All types' },
    { key: 'content_published', label: 'Content Published' },
    { key: 'content_updated', label: 'Content Updated' },
    { key: 'content_rejected', label: 'Content Rejected' },
    { key: 'content_status_change', label: 'Status Changes' },
    { key: 'system', label: 'System' },
  ];

  const clearSearch = () => {
    onSearchChange('');
  };

  const hasActiveFilters = search || status !== 'all' || type !== 'all';

  const clearAllFilters = () => {
    onSearchChange('');
    onStatusChange('all');
    onTypeChange('all');
  };

  return (
    <div className='space-y-4'>
      {/* Header with action buttons */}
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='space-y-1'>
          <h1 className='text-foreground text-2xl font-bold'>Notifications</h1>
          <p className='text-default-600 text-sm'>
            Stay updated with your content and system activities
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {unreadCount > 0 && (
            <Chip color='danger' size='sm'>
              {unreadCount} unread
            </Chip>
          )}
          {unreadCount > 0 && (
            <Button
              color='primary'
              variant='flat'
              size='sm'
              onPress={onMarkAllAsRead}
              isLoading={isMarkingAllAsRead}
              startContent={!isMarkingAllAsRead && <IoMdCheckmarkCircle />}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className='flex flex-col items-start gap-4 lg:flex-row lg:items-end'>
        {/* Search */}
        <div className='min-w-0 flex-1'>
          <Input
            placeholder='Search notifications...'
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            startContent={<IoMdSearch className='text-default-400' />}
            endContent={
              search && (
                <Button
                  isIconOnly
                  size='sm'
                  variant='light'
                  onPress={clearSearch}
                  aria-label='Clear search'
                >
                  <IoMdClose />
                </Button>
              )
            }
            classNames={{
              base: 'w-full',
              input: 'text-sm',
            }}
          />
        </div>

        {/* Status Filter */}
        <div className='w-full sm:w-48'>
          <Select
            label='Status'
            placeholder='Select status'
            selectedKeys={[status]}
            onSelectionChange={(keys) => {
              const selectedStatus = Array.from(keys)[0] as string;
              onStatusChange(selectedStatus as any);
            }}
            size='sm'
          >
            {statusOptions.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Type Filter */}
        <div className='w-full sm:w-48'>
          <Select
            label='Type'
            placeholder='Select type'
            selectedKeys={[type]}
            onSelectionChange={(keys) => {
              const selectedType = Array.from(keys)[0] as string;
              onTypeChange(selectedType === 'all' ? '' : selectedType);
            }}
            size='sm'
          >
            {typeOptions.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant='flat'
            size='sm'
            onPress={clearAllFilters}
            startContent={<IoMdClose />}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-default-600 text-sm'>Active filters:</span>
          {search && (
            <Chip size='sm' variant='flat' onClose={() => onSearchChange('')}>
              Search: "{search}"
            </Chip>
          )}
          {status !== 'all' && (
            <Chip
              size='sm'
              variant='flat'
              onClose={() => onStatusChange('all')}
            >
              Status: {statusOptions.find((o) => o.key === status)?.label}
            </Chip>
          )}
          {type !== '' && (
            <Chip size='sm' variant='flat' onClose={() => onTypeChange('')}>
              Type: {typeOptions.find((o) => o.key === type)?.label}
            </Chip>
          )}
        </div>
      )}
    </div>
  );
}
