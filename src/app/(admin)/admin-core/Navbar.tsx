import { NavLink, NavLinkProps, Skeleton, Stack } from '@mantine/core';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';
import { UrlObject } from 'url';

interface WithId {
  id: number | string;
}

type Props<T extends WithId> = {
  navLinkProps: (
    item: T,
    index: number,
  ) => NavLinkProps & { href: string | UrlObject };
  data: Promise<T[]>;
};
export default async function Navbar<T extends WithId>(props: Props<T>) {
  const { navLinkProps, data } = props;

  return (
    <Suspense fallback={<Loader />}>
      <Display data={data} navLinkProps={navLinkProps} />
    </Suspense>
  );
}

async function Display<T extends WithId>({ data, navLinkProps }: Props<T>) {
  const headersList = headers();
  const fullUrl = headersList.get('referer') || '';
  const items = await data;

  return (
    <>
      {items.map((item, index) => {
        return (
          <NavLink
            component={Link}
            key={index}
            active={fullUrl.endsWith(String(item.id))}
            {...navLinkProps(item, index)}
          />
        );
      })}
    </>
  );
}

function Loader() {
  return (
    <Stack>
      {[...Array(7)].map((_, i) => (
        <Skeleton key={i} h={41} />
      ))}
    </Stack>
  );
}
