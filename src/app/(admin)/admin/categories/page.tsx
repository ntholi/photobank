import {
  CreateView,
  CreateViewProps,
  DetailsView,
  EditView,
  EditViewProps,
  FieldView,
  ResourcePage,
  TextField,
} from '@/app/(admin)/admin-core';
import { categoryRepository } from './repository';
import { Category } from '@prisma/client';
import {
  Button,
  CloseButton,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  Skeleton,
  Stack,
  Title,
  Text,
  ScrollArea,
} from '@mantine/core';
import { useQueryState } from 'nuqs';
import CreateButton from '../../admin-core/components/CreateButton';
import DeleteButton from '../../admin-core/components/DeleteButton';
import SearchField from '../../admin-core/components/SearchField';
import Navbar from '../../admin-core/Navbar';
import { deleteCategory } from './actions';
import prisma from '@/lib/db';

export default async function CategoryPage() {
  const data = prisma.category.findMany();
  return (
    <Grid columns={14} gutter={'xl'}>
      <GridCol span={{ base: 13, sm: 4 }} pr={{ base: 7, sm: 0 }}>
        <Paper withBorder>
          <Flex>
            <Stack gap={0} w={'100%'}>
              <Flex h={60} p="md" justify="space-between">
                <CreateButton href="/admin/categories/new" />
                <DeleteButton onClick={deleteCategory} />
              </Flex>
              <SearchField />
              <Divider />
              <ScrollArea h={{ base: 150, sm: '71vh' }} type="always" p={'sm'}>
                <Navbar
                  data={data}
                  navLinkProps={(it) => ({ label: it.name })}
                />
              </ScrollArea>
            </Stack>
          </Flex>
        </Paper>
      </GridCol>
      <GridCol span={{ base: 13, sm: 10 }} pos={'relative'}>
        <Paper withBorder>
          <Header showEditButton={false} resourceLabel={'Hello World'} />
          <ScrollArea h="78vh" type="always">
            <Loading />
          </ScrollArea>
        </Paper>
      </GridCol>
    </Grid>
  );
}

function Header({
  showEditButton,
  resourceLabel,
}: {
  showEditButton: boolean;
  resourceLabel: string;
}) {
  // const [_, setView] = useQueryState('view');
  // const [id, setId] = useQueryState('id');

  return (
    <>
      <Flex justify="space-between" align={'center'} h={60} p="md">
        <Title size={18} fw={500}>
          {resourceLabel}
        </Title>
        <Group>
          {/* {id && showEditButton && (
            <Button type="submit" color="dark" onClick={() => setView('edit')}>
              Edit
            </Button>
          )} */}
          <Divider orientation="vertical" />
          <CloseButton
            size="lg"
            variant="transparent"
            // onClick={async () => {
            //   await setView(null);
            //   await setId(null);
            // }}
          />
        </Group>
      </Flex>
      <Divider />
    </>
  );
}

function Loading() {
  return (
    <Stack py={50} px={70} pb={120} gap={'lg'}>
      <Skeleton mt="sm" h={50} w="100%" />
      <Skeleton h={160} w="100%" />
      <Skeleton h={160} w="100%" />
    </Stack>
  );
}

function NothingSelectedView({ title }: { title: string }) {
  return (
    <Stack align="center" gap={5} justify="center" mt="30vh">
      <div>
        <Title fw={400} c="gray">
          {title}
        </Title>
        <Text pl={3} c="gray" size="xs">
          Nothing Selected
        </Text>
      </div>
    </Stack>
  );
}
