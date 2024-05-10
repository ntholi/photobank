import { NavLink, NavLinkProps, Skeleton, Stack } from '@mantine/core';
import Link from 'next/link';
import React, { Suspense, useContext } from 'react';
import { UrlObject } from 'url';
import { FirestoreDataContext } from './RepositoryDataProvider';
// import { useQueryState } from 'nuqs';

type Props<T> = {
  navLinkProps: (
    item: T,
    index: number,
  ) => NavLinkProps & { href?: string | UrlObject };
  data: Promise<T[]>;
};
export default async function Navbar<T>(props: Props<T>) {
  const { navLinkProps, data } = props;
  // const [id, setId] = useQueryState('id');

  return (
    <Suspense fallback={<Loader />}>
      <Display data={data} navLinkProps={navLinkProps} />
    </Suspense>
  );
}

async function Display<T>({ data, navLinkProps }: Props<T>) {
  const items = await data;
  return (
    <>
      {items.map((item, index) => {
        return (
          <NavLink
            component="button"
            key={index}
            // active={id === item.id}
            {...navLinkProps(item, index)}
            // onClick={() => setId(item.id)}
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
