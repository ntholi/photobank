import { Badge, BadgeProps } from '@mantine/core';

type Props = {
  contentType: string;
} & BadgeProps;

export function ContentTypeBadge({ contentType, ...rest }: Props) {
  const badgeProps = {
    image: { color: 'cyan', label: 'Image' },
    video: { color: 'indigo', label: 'Video' },
  };

  const props = badgeProps[contentType as keyof typeof badgeProps] || {
    color: 'gray',
    label: contentType,
  };

  return (
    <Badge color={props.color} variant='light' size='xs' {...rest}>
      {props.label}
    </Badge>
  );
}
