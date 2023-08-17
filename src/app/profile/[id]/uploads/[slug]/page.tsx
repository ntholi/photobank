import admin from '@/lib/config/firebase-admin';

type Props = { params: { slug: string } };

export default async function Page({ params }: Props) {
  return <section className="w-screen px-16">Hello {params.slug}</section>;
}
