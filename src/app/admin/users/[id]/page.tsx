import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from '@/components/adease';
import { notFound } from 'next/navigation';
import { getUser, deleteUser } from '../actions';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserDetails({ params }: Props) {
  const { id } = await params;
  const users = await getUser(id);
  
  if (!users) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader 
        title={'User'} 
        queryKey={['users']}
        handleDelete={async () => {
          'use server';
          await deleteUser(id);
        }}
      />
      <DetailsViewBody>
        <FieldView label='Name'>{users.name}</FieldView>
        <FieldView label='Email'>{users.email}</FieldView>
        <FieldView label='Role'>{users.role}</FieldView>
        <FieldView label='Blocked'>{users.blocked}</FieldView>
        <FieldView label='Website'>{users.website}</FieldView>
        <FieldView label='Bio'>{users.bio}</FieldView>
      </DetailsViewBody>
    </DetailsView>
  );
}