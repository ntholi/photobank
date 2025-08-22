import React from 'react';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ContentPage({ params }: Props) {
  const { id } = await params;
  return (
    <div>
      <h1>{id}</h1>
    </div>
  );
}
