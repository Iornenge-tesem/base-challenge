'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Challenge } from '@/lib/types';
import { useWalletAddress } from '@/hooks/useWalletAddress';

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const isShowUpChallenge = challenge.id === 'show-up';
  const { address, isConnected } = useWalletAddress();
  const [hasJoined, setHasJoined] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!address || !isConnected || !isShowUpChallenge) {
      setHasJoined(false);
      return;
    }

    const checkParticipation = async () => {
      setIsChecking(true);
      try {
        const response = await fetch(`/api/check-participation?challenge_id=${challenge.id}&wallet_address=${address}`);
        if (response.ok) {
          const data = await response.json();
          setHasJoined(data.hasJoined || false);
        } else {
          setHasJoined(false);
        }
      } catch (error) {
        console.error('Error checking participation:', error);
        setHasJoined(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkParticipation();
  }, [address, isConnected, challenge.id, isShowUpChallenge]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isShowUpChallenge) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const CardContent = () => (
    <div className="bg-white dark:bg-primary-light-blue rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-accent-green dark:hover:border-accent-green cursor-pointer flex flex-col h-full">
      {/* Thumbnail and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-5xl">{challenge.thumbnail}</div>
        {!isShowUpChallenge && (
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs font-semibold rounded-full">
            Coming Soon
          </span>
        )}
        {challenge.isActive && isShowUpChallenge && (
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs font-semibold rounded-full">
            Coming Soon
          </span>
        )}
      </div>

      {/* Title and Description */}
      <h3 className="text-xl font-bold text-primary-dark-blue dark:text-primary-white mb-2">
        {challenge.title}
      </h3>
      <p className="text-primary-dark-blue dark:text-accent-light-gray text-sm mb-4 line-clamp-2">
        {challenge.description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-primary-light-mode-blue dark:bg-primary-dark-blue rounded-lg p-3 min-w-0">
          <div className="text-xs text-primary-dark-blue dark:text-accent-gray mb-1">Participants</div>
          <div className="font-bold text-primary-dark-blue dark:text-primary-white leading-tight break-words text-[clamp(0.85rem,2.4vw,1.125rem)]">
            {challenge.participants.toLocaleString()}
          </div>
        </div>
        <div className="bg-accent-green/10 dark:bg-accent-green/20 rounded-lg p-3">
          <div className="text-xs text-primary-dark-blue dark:text-accent-gray mb-1">BCP Reward</div>
          <div className="text-lg font-bold text-accent-green">
            {challenge.bcpReward}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-4 border-t border-accent-light-gray dark:border-accent-light-gray mt-auto">
        <div className="flex items-center gap-2 text-sm text-primary-dark-blue dark:text-accent-gray">
          <span>⏱️</span>
          <span>{challenge.duration}</span>
        </div>
        {challenge.entryFee && challenge.entryFee > 0 ? (
          <div className="px-3 py-1 bg-accent-green/10 dark:bg-accent-green/20 rounded-full">
            <span className="text-sm font-semibold text-accent-green">
              {challenge.entryFee} USDC
            </span>
          </div>
        ) : (
          <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
              Free
            </span>
          </div>
        )}
      </div>

      {/* View Details / Status Button */}
      {isShowUpChallenge ? (
        hasJoined ? (
          <div className="mt-4 w-full bg-green-100 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 py-2 rounded-lg font-bold text-center">
            ✓ Challenge Joined
          </div>
        ) : (
          <div className="mt-4 w-full bg-accent-green hover:bg-accent-green-dark text-primary-dark-blue py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-center">
            {isChecking ? 'Checking...' : 'View Details →'}
          </div>
        )
      ) : (
        <button
          disabled
          className="mt-4 w-full bg-accent-light-gray dark:bg-accent-gray text-primary-dark-blue dark:text-primary-white py-2 rounded-lg font-semibold cursor-not-allowed opacity-60"
        >
          Coming Soon
        </button>
      )}
    </div>
  );

  if (isShowUpChallenge) {
    return (
      <Link href={`/challenges/${challenge.id}`} onClick={handleClick}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}
