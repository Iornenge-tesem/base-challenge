'use client';

import React, { useState, useEffect } from 'react';
import { mockLeaderboardData } from '@/lib/mockLeaderboard';
import { LeaderboardEntry } from '@/lib/types';
import BackButton from '@/components/BackButton';

export default function GlobalLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all-time' | 'monthly' | 'weekly'>('all-time');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLeaderboard(mockLeaderboardData['global-bcp']);
      setIsLoading(false);
    }, 500);
  }, [timeframe]);

  return (
    <div className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue pb-24">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BackButton />
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-5xl">🏆</span>
            <div>
              <h1 className="text-4xl font-bold text-primary-dark-blue dark:text-primary-white">
                Global Leaderboard
              </h1>
              <p className="text-primary-dark-blue dark:text-accent-light-gray">
                Top BCP earners across all challenges
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all-time', label: 'All Time' },
            { key: 'monthly', label: 'This Month' },
            { key: 'weekly', label: 'This Week' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTimeframe(tab.key as typeof timeframe)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                timeframe === tab.key
                  ? 'bg-accent-green text-primary-dark-blue shadow-lg'
                  : 'bg-primary-modal-light dark:bg-primary-light-blue text-primary-white dark:text-primary-white hover:shadow-md'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        {!isLoading && leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="w-20 h-20 rounded-full bg-accent-gray flex items-center justify-center text-3xl mb-2 shadow-lg">
                {leaderboard[1].avatar}
              </div>
              <div className="text-4xl mb-2">🥈</div>
              <div className="text-center">
                <div className="font-bold text-primary-white dark:text-primary-white text-sm">
                  {leaderboard[1].displayName}
                </div>
                <div className="text-2xl font-bold text-accent-green mt-1">
                  {leaderboard[1].score}
                </div>
                <div className="text-xs text-accent-gray dark:text-accent-light-gray">BCP</div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-accent-green flex items-center justify-center text-4xl mb-2 shadow-xl border-4 border-accent-green">
                {leaderboard[0].avatar}
              </div>
              <div className="text-5xl mb-2">🥇</div>
              <div className="text-center">
                <div className="font-bold text-primary-white dark:text-primary-white">
                  {leaderboard[0].displayName}
                </div>
                <div className="text-3xl font-bold text-accent-green mt-1">
                  {leaderboard[0].score}
                </div>
                <div className="text-xs text-accent-gray dark:text-accent-light-gray">BCP</div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-12">
              <div className="w-16 h-16 rounded-full bg-primary-light-blue flex items-center justify-center text-2xl mb-2 shadow-lg">
                {leaderboard[2].avatar}
              </div>
              <div className="text-3xl mb-2">🥉</div>
              <div className="text-center">
                <div className="font-bold text-primary-white dark:text-primary-white text-xs">
                  {leaderboard[2].displayName}
                </div>
                <div className="text-xl font-bold text-accent-green mt-1">
                  {leaderboard[2].score}
                </div>
                <div className="text-xs text-accent-gray dark:text-accent-gray">BCP</div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-primary-modal-light dark:bg-primary-light-blue rounded-2xl shadow-lg overflow-hidden border border-accent-green dark:border-accent-green">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 bg-accent-light-gray dark:bg-accent-gray rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-accent-light-gray dark:bg-accent-gray rounded mb-2 w-1/3"></div>
                    <div className="h-3 bg-accent-light-gray dark:bg-accent-gray rounded w-1/2"></div>
                  </div>
                  <div className="w-16 h-6 bg-accent-light-gray dark:bg-accent-gray rounded"></div>
                </div>
              ))}
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="divide-y divide-accent-light-gray dark:divide-accent-gray">
              {leaderboard.map((entry) => (
                <div
                  key={entry.address}
                  className={`p-4 flex items-center gap-4 transition-colors ${
                    entry.displayName === 'You' 
                      ? 'bg-accent-green/10 dark:bg-accent-green/10 border-l-4 border-accent-green' 
                      : 'hover:bg-primary-light-blue dark:hover:bg-primary-light-blue'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold dark:font-bold text-lg ${
                    entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    entry.rank === 2 ? 'bg-accent-gray text-primary-white' :
                    entry.rank === 3 ? 'bg-orange-400 text-orange-900' :
                    'bg-primary-dark-blue dark:bg-primary-dark-blue text-primary-white dark:text-primary-white'
                  }`}>
                    {entry.rank <= 3 ? (
                      entry.rank === 1 ? '🥇' :
                      entry.rank === 2 ? '🥈' : '🥉'
                    ) : (
                      `${entry.rank}`
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{entry.avatar}</span>
                      <div>
                        <div className="font-semibold text-primary-white dark:text-primary-white flex items-center gap-2">
                          {entry.displayName || `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                          {entry.displayName === 'You' && (
                            <span className="px-2 py-0.5 bg-accent-green text-primary-dark-blue text-xs rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-accent-gray dark:text-accent-light-gray font-mono">
                          {entry.address.slice(0, 10)}...{entry.address.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BCP Score */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-accent-green">
                      {entry.score}
                    </div>
                    <div className="text-xs text-accent-gray dark:text-accent-light-gray">BCP</div>
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
                Start participating in challenges to earn BCP!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
