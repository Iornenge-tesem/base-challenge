'use client';

import React, { useState, useEffect } from 'react';
import ChallengeCard from '@/components/ChallengeCard';
import FarcasterUserHeader from '@/components/FarcasterUserHeader';
import { Challenge } from '@/lib/types';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isMounted = true;

    const fetchChallenges = async () => {
      try {
        const response = await fetch('/api/challenges');
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setChallenges(data.challenges || []);
          }
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };

    const fetchParticipants = async () => {
      try {
        const response = await fetch('/api/participants?challenge_id=show-up');
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setParticipantCount(data.participants);
          }
        }
      } catch (error) {
        console.error('Error fetching participant count:', error);
      }
    };

    const load = async () => {
      await Promise.all([fetchChallenges(), fetchParticipants()]);
      if (isMounted) {
        setIsLoading(false);
      }
    };

    load();
    intervalId = setInterval(fetchParticipants, 10000);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const derivedChallenges = challenges.map((challenge) =>
    challenge.id === 'show-up'
      ? { ...challenge, participants: participantCount }
      : challenge
  );

  const featuredChallenge = derivedChallenges.find(c => c.id === 'show-up');
  const otherChallenges = derivedChallenges.filter(c => c.id !== 'show-up');

  return (
    <div className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue pb-24">
      {/* Hero Section */}
      <div className="bg-primary-modal-light dark:bg-primary-light-blue text-primary-white dark:text-primary-white py-3 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src="/icon.svg" alt="Base Challenge" className="w-7 h-7" />
              <div>
                <h1 className="text-lg font-bold leading-tight">Base Challenge</h1>
                <p className="text-[11px] opacity-90">Earn BCP by participating in challenges</p>
              </div>
            </div>
            <FarcasterUserHeader />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Featured Challenge */}
        {!isLoading && featuredChallenge && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-primary-dark-blue dark:text-primary-white mb-3">
              ⭐ Featured Challenge
            </h2>
            <a href={`/challenges/${featuredChallenge.id}`}>
              <div className="bg-white dark:bg-primary-light-blue rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-accent-green dark:border-accent-green relative overflow-hidden">
                {/* Gradient background */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent-green/5 rounded-full -z-0"></div>
                
                <div className="relative z-10 flex items-start justify-between mb-3">
                  <div>
                    <div>
                      <h3 className="text-lg font-bold text-primary-dark-blue dark:text-primary-white">
                        {featuredChallenge.title}
                      </h3>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-[10px] font-semibold rounded-full">
                        Ongoing
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-primary-dark-blue dark:text-accent-light-gray text-sm mb-4">
                  {featuredChallenge.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                  <div className="bg-primary-light-mode-blue dark:bg-primary-dark-blue rounded-lg p-2 sm:p-3 text-center min-w-0">
                    <div className="font-bold text-primary-dark-blue dark:text-primary-white leading-tight break-words text-[clamp(0.8rem,2.2vw,1.3rem)]">
                      {participantCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] sm:text-xs text-primary-dark-blue dark:text-accent-gray mt-1 leading-tight">Participants</div>
                  </div>
                  <div className="bg-primary-light-mode-blue dark:bg-primary-dark-blue rounded-lg p-2 sm:p-3 text-center min-w-0">
                    <div className="font-bold text-primary-dark-blue dark:text-primary-white leading-tight break-words text-[clamp(0.8rem,2.2vw,1.3rem)]">
                      ∞
                    </div>
                    <div className="text-[10px] sm:text-xs text-primary-dark-blue dark:text-accent-gray mt-1 leading-tight">Duration</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-accent-green hover:bg-accent-green-dark text-primary-dark-blue py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all">
                    Join Challenge (0.3 USDC) →
                  </button>
                </div>
              </div>
            </a>
          </div>
        )}

        {/* Other Challenges */}
        <div>
          <h2 className="text-2xl font-bold text-primary-dark-blue dark:text-primary-white mb-4">
            More Challenges
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-primary-light-blue rounded-2xl p-6 shadow-lg animate-pulse"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-accent-gray dark:bg-gray-700 rounded"></div>
                    <div className="w-16 h-6 bg-accent-gray dark:bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="h-6 bg-accent-gray dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-accent-gray dark:bg-gray-700 rounded mb-4"></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-16 bg-accent-gray dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-16 bg-accent-gray dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {otherChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherChallenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-primary-dark-blue dark:text-accent-gray mb-2">
                    More challenges coming soon
                  </h3>
                  <p className="text-primary-dark-blue dark:text-accent-gray">
                    Check back later for new opportunities
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
