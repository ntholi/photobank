import { Image } from '@nextui-org/image';

type Props = {
  size?: number | string;
};
export default function Logo({ size = 45 }: Props) {
  return (
    <Image
      src="/images/logo.jpg"
      alt="logo"
      height={size}
      width={size}
      radius="none"
    />
  );
}
