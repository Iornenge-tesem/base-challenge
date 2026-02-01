'use client';

import React, { useEffect, useState } from 'react';
import ShowUpChallenge from '@/components/ShowUpChallenge';
import BackButton from '@/components/BackButton';
import { useWalletAddress } from '@/hooks/useWalletAddress';
import { useBasePayment } from '@/hooks/useBasePayment';

export const dynamic = 'force-dynamic';

export default function ShowUpChallengePage() {
  const [hasJoined, setHasJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);
  const [isCheckingJoined, setIsCheckingJoined] = useState(false);
  const { address, isConnected, connectWallet } = useWalletAddress();
  const { processPayment, isProcessing, error, entryFee } = useBasePayment();
  const challengeId = 'show-up';

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchParticipants = async () => {
      try {
        const response = await fetch('/api/participants?challenge_id=show-up');
        if (response.ok) {
          const data = await response.json();
          setParticipantCount(data.participants);
        }
      } catch (error) {
        console.error('Error fetching participant count:', error);
      } finally {
        setIsLoadingParticipants(false);
      }
    };
    fetchParticipants();
    intervalId = setInterval(fetchParticipants, 10000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  // Check if user has already joined (non-blocking)
  useEffect(() => {
    if (!address) {
      setHasJoined(false);
      return;
    }

    const checkJoined = async () => {
      setIsCheckingJoined(true);
      try {
        const response = await fetch(`/api/check-participation?challenge_id=${challengeId}&wallet_address=${address}`);
        if (response.ok) {
          const data = await response.json();
          setHasJoined(data.hasJoined || false);
        }
      } catch (error) {
        console.error('Error checking participation:', error);
      } finally {
        setIsCheckingJoined(false);
      }
    };

    checkJoined();
  }, [address, challengeId]);

  const handleJoin = async () => {
    if (!isConnected || !address) {
      connectWallet();
      return;
    }

    try {
      const result = await processPayment(challengeId, address);
      if (result.success) {
        setHasJoined(true);
      }
      // Error is already in the hook state, will display via error message
    } catch (err: any) {
      console.error('Payment error:', err);
      // Error should already be in hook state
    }
  };
  return (
    <div className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue pb-12">
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <BackButton />
        {/* Challenge Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <span className="text-5xl">🔥</span>
              <h1 className="text-3xl font-bold text-primary-dark-blue dark:text-primary-white">
                Show Up Challenge
              </h1>
            </div>
            <span className="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-[10px] font-semibold rounded-full">
              Ongoing
            </span>
          </div>
          <p className="text-primary-dark-blue dark:text-accent-light-gray ml-16">
            Check in daily to build your streak and earn BCP
          </p>
        </div>

        {/* Challenge Details Card */}
        <div className="bg-white dark:bg-primary-light-blue rounded-2xl p-6 mb-6 shadow-lg border border-accent-green dark:border-accent-green">
          <h2 className="text-lg font-semibold text-primary-dark-blue dark:text-primary-white mb-4">
            Challenge Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-primary-dark-blue dark:text-accent-light-gray">Entry Fee</span>
              <span className="font-semibold text-accent-green">0.3 USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-dark-blue dark:text-accent-light-gray">BCP per Day</span>
              <span className="font-semibold text-accent-green">1 BCP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-dark-blue dark:text-accent-light-gray">Duration</span>
              <span className="font-semibold text-primary-dark-blue dark:text-primary-white">Ongoing</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-dark-blue dark:text-accent-light-gray">Participants</span>
              <span className="font-semibold text-primary-dark-blue dark:text-primary-white">
                {isLoadingParticipants ? '...' : participantCount.toLocaleString()}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-400 font-medium text-sm">{error}</p>
            </div>
          )}

          {!hasJoined && (
            <button
              onClick={handleJoin}
              disabled={isProcessing || isCheckingJoined}
              className="mt-6 w-full bg-accent-green hover:bg-accent-green-dark text-primary-dark-blue py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCheckingJoined ? 'Checking...' : (!isConnected ? 'Connect Wallet →' : (isProcessing ? 'Processing Payment...' : `Join Challenge (${entryFee} USDC) →`))}
            </button>
          )}

          {hasJoined && (
            <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg text-center">
              <p className="text-green-700 dark:text-green-400 font-bold">✓ Successfully joined!</p>
            </div>
          )}
        </div>

        {/* Challenge Interface - Only show if user has joined */}
        {hasJoined && <ShowUpChallenge />}
        
        {/* Message for non-participants */}
        {!hasJoined && isConnected && (
          <div className="bg-white dark:bg-primary-light-blue rounded-2xl p-8 shadow-lg text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-primary-dark-blue dark:text-primary-white mb-2">
              Join to Start Checking In
            </h3>
            <p className="text-primary-dark-blue dark:text-accent-light-gray">
              Complete the payment above to unlock daily check-ins and start building your streak!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
