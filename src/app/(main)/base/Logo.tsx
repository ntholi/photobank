import { Image } from '@nextui-org/react';

type Props = {
  size?: number | string;
  className?: string;
};
export default function Logo({ size = 45, className }: Props) {
  return (
    <Image
      src="/images/logo.jpg"
      alt="logo"
      className={className}
      height={size}
      width={size}
      radius="none"
    />
  );
}
