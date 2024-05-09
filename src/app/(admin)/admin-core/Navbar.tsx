import { NavLink, NavLinkProps, Skeleton, Stack } from '@mantine/core';
import Link from 'next/link';
import React, { useContext } from 'react';
import { UrlObject } from 'url';
import { Resource } from './repository/repository';
import { FirestoreDataContext } from './RepositoryDataProvider';
import { useQueryState } from 'nuqs';

type Props<T extends Resource> = {
  navLinkProps: (
    item: T,
    index: number,
  ) => NavLinkProps & { href?: string | UrlObject };
};
export default function Navbar<T extends Resource>(props: Props<T>) {
  const { navLinkProps } = props;
  const { data, loading } = useContext(FirestoreDataContext);
  const [id, setId] = useQueryState('id');

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        data.map((item, index) => (
          <NavLink
            component='button'
            key={index}
            active={id === item.id}
            {...navLinkProps(item, index)}
            onClick={() => setId(item.id)}
          />
        ))
      )}
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
