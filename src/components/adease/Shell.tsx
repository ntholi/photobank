'use client';

import {
  AppShell,
  ActionIcon,
  Burger,
  Divider,
  Group,
  ScrollArea,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { PropsWithChildren } from 'react';
import { IconMoon, IconSun } from '@tabler/icons-react';

type ShellComposition = {
  Header: React.FC<PropsWithChildren>;
  Navigation: React.FC<PropsWithChildren>;
  Body: React.FC<PropsWithChildren>;
  User: React.FC<PropsWithChildren>;
  Footer: React.FC<PropsWithChildren>;
};

const Shell: React.FC<PropsWithChildren> & ShellComposition = ({
  children,
}) => {
  const [opened, { toggle, close }] = useDisclosure();
  const colorScheme = useComputedColorScheme('dark');
  const { setColorScheme } = useMantineColorScheme();

  const Header = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === Shell.Header,
  );
  const navigation = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === Shell.Navigation,
  );
  const body = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === Shell.Body,
  );

  const user = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === Shell.User,
  );

  const footer = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === Shell.Footer,
  );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
      padding='md'
      footer={{ height: footer ? 40 : 0 }}
    >
      <AppShell.Header>
        <Group h='100%' px='md' justify='space-between'>
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom='md'
              size='sm'
            />
            {Header}
          </Group>
          <ActionIcon variant='default' size='lg'>
            {colorScheme === 'dark' ? (
              <IconSun onClick={() => setColorScheme('light')} />
            ) : (
              <IconMoon onClick={() => setColorScheme('dark')} />
            )}
          </ActionIcon>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <AppShell.Section grow component={ScrollArea} onClick={close} p={'sm'}>
          {navigation}
        </AppShell.Section>
        <AppShell.Section p={'sm'}>
          <Divider />
          {user}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main bg={colorScheme === 'dark' ? 'dark.8' : 'gray.0'}>
        {body}
      </AppShell.Main>
      {footer && <AppShell.Footer>{footer}</AppShell.Footer>}
    </AppShell>
  );
};

Shell.Header = function ShellHeader({ children }: PropsWithChildren) {
  return <>{children}</>;
};

Shell.Navigation = function ShellNavigation({ children }: PropsWithChildren) {
  return <>{children}</>;
};

Shell.Body = function ShellBody({ children }: PropsWithChildren) {
  return <>{children}</>;
};

Shell.User = function ShellUser({ children }: PropsWithChildren) {
  return <>{children}</>;
};

Shell.Footer = function ShellFooter({ children }: PropsWithChildren) {
  return <>{children}</>;
};

export default Shell;
