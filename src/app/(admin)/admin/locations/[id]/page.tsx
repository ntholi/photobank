import DeleteIconButton from '@/app/(admin)/components/DeleteIconButton';
import FieldView from '@/app/(admin)/components/FieldView';
import HeaderDisplay from '@/app/(admin)/components/HeaderDisplay';
import { Box, Fieldset, Text, Image, Stack, Anchor } from '@mantine/core';
import { notFound } from 'next/navigation';
import { deleteLocation, getLocation } from '../actions';
import { thumbnail } from '@/lib/config/urls';

type Props = {
  params: {
    id: string;
  };
};
export default async function Page({ params: { id } }: Props) {
  const item = await getLocation(id);
  if (!item) {
    return notFound();
  }

  return (
    <Box p={'lg'}>
      <HeaderDisplay
        title={item.location.name}
        actionButtons={[<DeleteIconButton action={deleteLocation} id={id} />]}
      />

      <Stack p={'xl'}>
        <FieldView label="Name">{item.location.name}</FieldView>
        <FieldView label="Virtual Tour">
          {item.tourUrl && (
            <Anchor target="_blank" href={`${item.tourUrl}/index.htm`}>
              {item.tourUrl?.split('/').at(-1)}
            </Anchor>
          )}
        </FieldView>
        {item.coverPhoto && (
          <Image
            style={{ maxHeight: '40vh' }}
            src={thumbnail(item.coverPhoto?.fileName)}
          />
        )}
        <Fieldset legend={'About Location'}>
          <Text>{item.about}</Text>
        </Fieldset>
      </Stack>
    </Box>
  );
}
