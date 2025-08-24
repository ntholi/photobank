import React from 'react';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  return <div>ProfilePage {id}</div>;
}
