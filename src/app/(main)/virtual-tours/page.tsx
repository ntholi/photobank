import { Metadata } from 'next';
import Body from './Body';
import Container from '../base/Container';

export const metadata: Metadata = {
  title: 'Virtual Tours | Lehakoe',
  description: 'Explore our collection of immersive virtual tours',
};

export default async function VirtualToursPage() {
  return (
    <Container width='xl' className='mt-10'>
      <div className='mb-8'>
        <h1 className='mb-2 text-4xl font-bold'>Virtual Tours</h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Explore stunning locations through our immersive virtual tours
        </p>
      </div>
      <Body />
    </Container>
  );
}
