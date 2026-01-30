'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label?: string;
}

export default function BackButton({ label = 'Back' }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 px-4 py-2 text-accent-green hover:opacity-80 transition-opacity font-medium mb-4"
    >
      <span>←</span>
      <span>{label}</span>
    </button>
  );
}
