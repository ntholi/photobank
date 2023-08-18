import { AppShell, useMantineTheme } from '@mantine/core';

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const theme = useMantineTheme();

  return <AppShell>{children}</AppShell>;
}
