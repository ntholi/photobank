import React, { useState, useEffect } from 'react';
import { Repository, Resource } from './repository/repository';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

type DefaultState<T extends Resource> = {
  data: T[];
  loading: boolean;
};

const defaultState = {
  data: [],
  loading: true,
};

export const FirestoreDataContext =
  React.createContext<DefaultState<any>>(defaultState);

type Props<T extends Resource> = {
  repository: Repository<T>;
  children: React.ReactNode;
};

function RepositoryDataProvider<T extends Resource>({
  repository,
  children,
}: Props<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter] = useQueryState('filter', parseAsArrayOf(parseAsString));

  useEffect(() => {
    const filterBy = filter
      ? { field: filter[0], value: filter[1] }
      : undefined;

    const unsubscribe = repository.listen((items) => {
      setData(items);
      setLoading(false);
    }, filterBy);

    return () => unsubscribe();
  }, [repository, filter]);

  return (
    <FirestoreDataContext.Provider value={{ data, loading }}>
      {children}
    </FirestoreDataContext.Provider>
  );
}

export default RepositoryDataProvider;
