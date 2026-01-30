'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { mockLeaderboardData } from '@/lib/mockLeaderboard';
import { mockChallenges } from '@/lib/mockChallenges';
import { LeaderboardEntry } from '@/lib/types';
import BackButton from '@/components/BackButton';

export default function ChallengeLeaderboardPage() {
  const params = useParams();
  const challengeId = params.id as string;
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const challenge = mockChallenges.find(c => c.id === challengeId);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLeaderboard(mockLeaderboardData[challengeId] || []);
      setIsLoading(false);
    }, 500);
  }, [challengeId]);

  if (!challenge) {
    return (
      <div className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-2xl font-bold text-primary-dark-blue dark:text-primary-white mb-2">Challenge Not Found</h2>
          <Link href="/challenges" className="text-accent-green dark:text-accent-green underline">
            Back to Challenges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue pb-24">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BackButton />
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl">{challenge.thumbnail}</span>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark-blue dark:text-primary-white">
                {challenge.title}
              </h1>
              <p className="text-primary-dark-blue dark:text-accent-light-gray">Leaderboard</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-primary-modal-light dark:bg-primary-light-blue rounded-2xl shadow-lg overflow-hidden border border-accent-green dark:border-accent-green">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 bg-primary-dark-blue dark:bg-primary-dark-blue rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-primary-dark-blue dark:bg-primary-dark-blue rounded mb-2 w-1/3"></div>
                    <div className="h-3 bg-primary-dark-blue dark:bg-primary-dark-blue rounded w-1/2"></div>
                  </div>
                  <div className="w-16 h-6 bg-primary-dark-blue dark:bg-primary-dark-blue rounded"></div>
                </div>
              ))}
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="divide-y divide-accent-light-gray dark:divide-accent-light-gray">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.address}
                  className={`p-4 flex items-center gap-4 transition-colors ${
                    entry.displayName === 'You' 
                      ? 'bg-accent-green/10 dark:bg-accent-green/10 border-l-4 border-accent-green' 
                      : 'hover:bg-primary-dark-blue dark:hover:bg-primary-dark-blue'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold dark:font-bold text-lg ${
                    entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    entry.rank === 2 ? 'bg-accent-gray text-primary-white' :
                    entry.rank === 3 ? 'bg-orange-400 text-orange-900' :
                    'bg-primary-dark-blue dark:bg-primary-dark-blue text-primary-white dark:text-primary-white'
                  }`}>
                    {entry.rank === 1 ? '🥇' :
                     entry.rank === 2 ? '🥈' :
                     entry.rank === 3 ? '🥉' :
                     `${entry.rank}`}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{entry.avatar}</span>
                      <div>
                        <div className="font-semibold text-primary-white dark:text-primary-white">
                          {entry.displayName || `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                        </div>
                        <div className="text-xs text-accent-gray dark:text-accent-light-gray font-mono">
                          {entry.address.slice(0, 10)}...{entry.address.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-accent-green">
                      {entry.score}
                    </div>
                    <div className="text-xs text-accent-gray dark:text-accent-light-gray">
                      {challenge.type === 'daily-checkin' ? 'days' : 'points'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-accent-gray dark:text-accent-light-gray mb-2">
                No rankings yet
              </h3>
              <p className="text-accent-gray dark:text-accent-light-gray">
                Be the first to participate in this challenge!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
