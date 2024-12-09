'use client';

import { SearchField } from '@/components/adease';
import {
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  NavLink,
  Paper,
  ScrollArea,
} from '@mantine/core';
import { Icon, IconChevronRight, IconInfoCircle } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

type NavItem = {
  label: string;
  href: string;
  icon: Icon;
};

const items: NavItem[] = [
  {
    label: 'About Us',
    href: '/admin/content/about-us',
    icon: IconInfoCircle,
  },
  {
    label: 'Privacy Policy',
    href: '/admin/content/privacy-policy',
    icon: IconInfoCircle,
  },
];

export default function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <Grid columns={14} gutter={'xl'}>
      <GridCol span={4} pr={7}>
        <Paper withBorder h={'88vh'}>
          <Flex direction='column' h='100%'>
            <Flex p={'md'} justify='space-between' align={'center'} gap={'xs'}>
              <Group style={{ width: '100%', flex: 1 }}>
                <SearchField style={{ width: '100%' }} />
              </Group>
            </Flex>
            <Divider />
            <ScrollArea type='always' style={{ flex: 1 }} p={'sm'}>
              {items.map(({ icon: Icon, ...item }, index) => (
                <NavLink
                  key={index}
                  label={item.label}
                  href={item.href}
                  leftSection={<Icon size='1.1rem' />}
                  rightSection={<IconChevronRight size='1rem' />}
                  active={pathname === item.href}
                />
              ))}
            </ScrollArea>
          </Flex>
        </Paper>
      </GridCol>

      <GridCol span={10}>
        <Paper withBorder>
          <ScrollArea h='88vh' type='always'>
            {children}
          </ScrollArea>
        </Paper>
      </GridCol>
    </Grid>
  );
}
