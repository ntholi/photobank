import { CircularProgress } from '@nextui-org/progress';

export default function Loading() {
  return (
    <div className="flex justify-center items-center pt-32 w-full h-full">
      <CircularProgress size="lg" aria-label="Loading..." />
    </div>
  );
}
