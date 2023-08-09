import Image from 'next/image';

type Props = {
  photoURL?: string;
  displayName?: string;
};

export default function UserBio({ photoURL, displayName }: Props) {
  return (
    <div className="flex mt-14">
      <Image
        src={photoURL || '/images/profile.png'}
        height={150}
        width={150}
        className="rounded-full border border-zinc-400"
        alt="Profile Picture"
      />
      <div className="ml-20 mt-1">
        <h1 className="text-4xl font-bold">{displayName}</h1>
      </div>
    </div>
  );
}

export const nameToInitials = (name?: string | null) => {
  if (!name) return '?';
  const initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
};
