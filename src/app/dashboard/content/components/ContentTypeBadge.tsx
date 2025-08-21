import { Badge, BadgeProps } from '@mantine/core';

type Props = {
  contentType: string;
} & BadgeProps;

export function ContentTypeBadge({ contentType, ...rest }: Props) {
  const badgeProps = {
    image: { color: 'teal', label: 'Image' },
    video: { color: 'green', label: 'Video' },
  };

  const props = badgeProps[contentType as keyof typeof badgeProps] || {
    color: 'gray',
    label: contentType,
  };

  return (
    <Badge
      color={props.color}
      size='sm'
      radius='sm'
      variant='light'
      pos='absolute'
      {...rest}
    >
      {props.label}
    </Badge>
  );
}
