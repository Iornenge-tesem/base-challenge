'use client';

import dynamic from 'next/dynamic';

// Dynamically import the component that uses wagmi hooks with ssr: false
const ShowUpChallengeContent = dynamic(
  () => import('@/components/ShowUpChallengeContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue flex items-center justify-center">
        <p className="text-primary-dark-blue dark:text-primary-white">Loading...</p>
      </div>
    )
  }
);

export default function ShowUpChallengePage() {
  return <ShowUpChallengeContent />;
}

