'use client';

import React, { useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useUnreadNotificationsCount,
  useMarkAllNotificationsAsRead,
} from '@/hooks/useNotifications';
import NotificationFilters from './NotificationFilters';
import NotificationsList from './NotificationsList';
import NotificationTester from './NotificationTester';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'unread' | 'read' | 'archived'>(
    'all',
  );
  const [type, setType] = useState('');
  const [showTester, setShowTester] = useState(false);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(search, 300);

  // Get unread count for header
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();

  // Mark all as read mutation
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  // Reset page when filters change
  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback(
    (newStatus: 'all' | 'unread' | 'read' | 'archived') => {
      setStatus(newStatus);
      setPage(1);
    },
    [],
  );

  const handleTypeChange = useCallback((newType: string) => {
    setType(newType);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    // Smooth scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  return (
    <div className='container mx-auto max-w-4xl space-y-6 p-6'>
      {/* Filters Section */}
      <NotificationFilters
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        type={type}
        onTypeChange={handleTypeChange}
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllAsRead}
        isMarkingAllAsRead={markAllAsReadMutation.isPending}
      />

      {/* Development Tester */}
      {process.env.NODE_ENV === 'development' && (
        <div className='flex justify-end'>
          <button
            onClick={() => setShowTester(!showTester)}
            className='text-default-500 hover:text-default-700 text-xs underline'
          >
            {showTester ? 'Hide' : 'Show'} Notification Tester
          </button>
        </div>
      )}

      {showTester && process.env.NODE_ENV === 'development' && (
        <div className='flex justify-center'>
          <NotificationTester />
        </div>
      )}

      {/* Notifications List */}
      <NotificationsList
        page={page}
        onPageChange={handlePageChange}
        search={debouncedSearch}
        status={status}
        type={type}
      />
    </div>
  );
}
