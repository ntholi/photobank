import React from 'react';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LocationPage({ params }: Props) {
  const { id } = await params;

  return <div>page</div>;
}
