import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getRecentNotifications,
} from '@/server/notifications/actions';
import { notifications } from '@/db/schema';

type Notification = typeof notifications.$inferSelect;

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: string) =>
    [...notificationKeys.lists(), { filters }] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
  unreadCount: () => [...notificationKeys.all, 'unreadCount'] as const,
  recent: () => [...notificationKeys.all, 'recent'] as const,
};

export function useNotifications(
  page: number = 1,
  size: number = 10,
  options: {
    search?: string;
    status?: 'unread' | 'read' | 'archived';
    type?: string;
  } = {},
) {
  return useQuery({
    queryKey: notificationKeys.list(JSON.stringify({ page, size, ...options })),
    queryFn: () => getUserNotifications(page, size, options),
  });
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationsCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useRecentNotifications(limit: number = 5) {
  return useQuery({
    queryKey: notificationKeys.recent(),
    queryFn: () => getRecentNotifications(limit),
    refetchInterval: 30000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalidate and refetch notifications queries
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Invalidate and refetch notifications queries
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}

export function useOptimisticMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (notificationId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueriesData({
        queryKey: notificationKeys.all,
      });

      // Optimistically update to the new value
      queryClient.setQueriesData(
        { queryKey: notificationKeys.lists() },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data?.map((notification: Notification) =>
              notification.id === notificationId
                ? { ...notification, status: 'read', readAt: new Date() }
                : notification,
            ),
          };
        },
      );

      // Update unread count
      queryClient.setQueryData(notificationKeys.unreadCount(), (old: number) =>
        Math.max(0, (old || 0) - 1),
      );

      return { previousNotifications };
    },
    onError: (err, notificationId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
