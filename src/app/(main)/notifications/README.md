# Notifications System

A comprehensive notifications system for the Lehakoe photobank application.

## Features

### 🔔 NotificationsButton Component

- Real-time notification badge with unread count
- Dropdown with recent notifications (last 5)
- Mark individual notifications as read
- Mark all notifications as read
- Beautiful dropdown with user avatars, icons, and timestamps
- Auto-refresh every 30 seconds
- Navigate directly to related content

### 📱 Comprehensive Notifications Page

- Full-featured notifications page at `/notifications`
- Advanced filtering by status (all, unread, read, archived)
- Filter by notification type (content updates, publications, etc.)
- Search functionality across titles and content
- Pagination with smooth scrolling
- Real-time updates with optimistic UI
- Responsive design with HeroUI components

### 🔧 Backend Infrastructure

- **Repository Layer**: Enhanced with user-specific methods
  - `getUserNotifications()` - Paginated user notifications
  - `getUnreadCount()` - Real-time unread count
  - `markAsRead()` - Mark single notification as read
  - `markAllAsRead()` - Mark all user notifications as read
  - `getRecentNotifications()` - Get latest notifications
- **Service Layer**: Authenticated business logic
  - All methods wrapped with `withAuth()`
  - User session validation
  - Role-based access control

- **Actions Layer**: Server actions for client integration
  - `getUserNotifications()` - Get paginated notifications
  - `getUnreadNotificationsCount()` - Get unread count
  - `markNotificationAsRead()` - Mark as read
  - `markAllNotificationsAsRead()` - Mark all as read
  - `getRecentNotifications()` - Get recent notifications

### ⚡ TanStack Query Integration

- **Hooks**: Custom hooks for all notification operations
  - `useNotifications()` - Paginated notifications with filters
  - `useUnreadNotificationsCount()` - Real-time unread count
  - `useRecentNotifications()` - Recent notifications for dropdown
  - `useOptimisticMarkAsRead()` - Optimistic UI updates
  - `useMarkAllNotificationsAsRead()` - Bulk mark as read

- **Query Keys**: Structured query invalidation
- **Optimistic Updates**: Instant UI feedback
- **Auto-refresh**: Background polling for real-time updates

## Components Structure

```
src/app/(main)/notifications/
├── page.tsx                    # Main notifications page
├── NotificationItem.tsx        # Individual notification card
├── NotificationsList.tsx       # Paginated list with loading states
├── NotificationFilters.tsx     # Search and filter controls
└── NotificationTester.tsx      # Development testing component

src/app/components/
└── NotificationsButton.tsx     # Navbar notification button

src/hooks/
└── useNotifications.tsx        # TanStack Query hooks
```

## Database Schema

```sql
notifications (
  id: varchar(21) PRIMARY KEY
  recipient_user_id: varchar(21) -> users.id
  type: notification_type_enum
  status: notification_status_enum DEFAULT 'unread'
  title: text
  body: text
  payload: jsonb
  created_at: timestamp DEFAULT now()
  read_at: timestamp
  updated_at: timestamp
)
```

### Notification Types

- `content_published` - Content approved and published
- `content_updated` - Content modified by moderators
- `content_rejected` - Content rejected with feedback
- `content_status_change` - General status changes
- `system` - System-wide announcements

### Notification Status

- `unread` - New, unread notification
- `read` - User has viewed the notification
- `archived` - Hidden from main view

## Integration

### Navbar Integration

The `NotificationsButton` is integrated into both:

- **HomeNavbar** (transparent overlay on homepage)
- **Navbar** (standard site navigation)

### Styling

- **Zone A (main)**: Uses HeroUI components exclusively
- Responsive design with mobile-first approach
- Dark/light mode compatible
- Accessible with proper ARIA labels

### Real-time Updates

- Automatic refresh every 30 seconds
- Optimistic UI updates for instant feedback
- Query invalidation on user actions
- Background polling for unread count

## Usage Examples

### Creating Notifications (Server-side)

```typescript
// In content service when content is updated
await notificationsService.create({
  recipientUserId: contentOwnerId,
  type: 'content_updated',
  title: 'Your content was updated',
  body: `Fields changed: ${changedFields.join(', ')}`,
  payload: { contentId, changedFields },
});
```

### Using in Components

```typescript
// Get notifications with filters
const { data, isLoading } = useNotifications(1, 10, {
  status: 'unread',
  search: 'content',
});

// Mark as read with optimistic updates
const markAsReadMutation = useOptimisticMarkAsRead();
markAsReadMutation.mutate(notificationId);
```

## Development

### Testing

A `NotificationTester` component is available in development mode to create test notifications of various types.

### Error Handling

- Comprehensive error boundaries
- Retry mechanisms for failed requests
- Graceful fallbacks for network issues

### Performance

- Debounced search (300ms)
- Pagination for large notification lists
- Optimized query invalidation
- Background polling with smart intervals

## Future Enhancements

- [ ] Push notifications for real-time alerts
- [ ] Email digest for important notifications
- [ ] Notification preferences per user
- [ ] Bulk actions (archive, delete)
- [ ] Rich notification templates
- [ ] Notification analytics and metrics
