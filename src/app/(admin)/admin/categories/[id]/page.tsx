import React from 'react';

type Props = {
  params: {
    id: string;
  };
};
export default function CategoryPage({ params: { id } }: Props) {
  return <div>{id}</div>;
}
