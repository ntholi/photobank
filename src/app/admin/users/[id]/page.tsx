import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import { getUser, deleteUser } from '@/server/users/actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserDetails({ params }: Props) {
  const { id } = await params;
  const user = await getUser(Number(id));
  
  if (!user) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader 
        title={'User'} 
        queryKey={['users']}
        handleDelete={async () => {
          'use server';
          await deleteUser(Number(id));
        }}
      />
      <DetailsViewBody>
        <FieldView label='Name'>{user.name}</FieldView>
        <FieldView label='Age'>{user.age}</FieldView>
        <FieldView label='Email'>{user.email}</FieldView>
      </DetailsViewBody>
    </DetailsView>
  );
}