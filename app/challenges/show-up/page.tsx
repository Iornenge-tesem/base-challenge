'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Address, keccak256, toBytes } from 'viem';
import ShowUpChallenge from '@/components/ShowUpChallenge';
import BackButton from '@/components/BackButton';
import { useWalletAddress } from '@/hooks/useWalletAddress';
import { useChallengePayment } from '@/hooks/useChallengePayment';

export const dynamic = 'force-dynamic';

export default function ShowUpChallengePage() {
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [balance, setBalance] = useState('0');
  const [hasEnoughBalance, setHasEnoughBalance] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const { address, isConnected, connectWallet } = useWalletAddress();
  const { checkBalance, getAllowance, approveUsdc, joinChallenge, checkParticipation, entryFeeUnits } =
    useChallengePayment();
  const challengeId = useMemo(() => keccak256(toBytes('show-up')), []);

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

  useEffect(() => {
    if (!address) return;
    const walletAddress = address as Address;

    const loadState = async () => {
      setIsCheckingBalance(true);
      setError(null);
      try {
        const [balanceInfo, allowance, alreadyJoined] = await Promise.all([
          checkBalance(walletAddress),
          getAllowance(walletAddress),
          checkParticipation(challengeId, walletAddress),
        ]);

        setBalance(balanceInfo.balanceFormatted || '0');
        setHasEnoughBalance(balanceInfo.balanceSufficient);
        setNeedsApproval(allowance < BigInt(entryFeeUnits));
        setHasJoined(alreadyJoined);
      } catch (err: any) {
        setError(err.message || 'Failed to check balance');
      } finally {
        setIsCheckingBalance(false);
      }
    };

    loadState();
  }, [address, challengeId, checkBalance, checkParticipation, getAllowance]);

  const handleJoin = async () => {
    setError(null);

    if (!isConnected) {
      connectWallet();
      return;
    }

    if (!hasEnoughBalance) {
      setError('Insufficient USDC balance');
      return;
    }

    try {
      if (needsApproval) {
        setIsApproving(true);
        await approveUsdc();
        setNeedsApproval(false);
      }

      setIsJoining(true);
      const txHash = await joinChallenge(challengeId);
      
      // Verify transaction with backend
      if (txHash) {
        const verifyResponse = await fetch('/api/join-challenge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: address,
            challengeId,
            transactionHash: txHash,
          }),
        });

        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json();
          throw new Error(errorData.error || 'Transaction verification failed');
        }
      }
      setHasJoined(true);
    } catch (err: any) {
      setError(err.message || 'Failed to join challenge');
    } finally {
      setIsApproving(false);
      setIsJoining(false);
    }
  };
  return (
    <div className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue pb-12">
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <BackButton />
        {/* Challenge Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl">🔥</span>
            <h1 className="text-3xl font-bold text-primary-dark-blue dark:text-primary-white">
              Show Up Challenge
            </h1>
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
              disabled={isCheckingBalance || isApproving || isJoining}
              className="mt-6 w-full bg-accent-green hover:bg-accent-green-dark text-primary-dark-blue py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCheckingBalance && 'Checking balance...'}
              {!isCheckingBalance && !isConnected && 'Connect Wallet →'}
              {!isCheckingBalance && isConnected && needsApproval && (isApproving ? 'Approving USDC...' : 'Approve USDC (0.3) →')}
              {!isCheckingBalance && isConnected && !needsApproval && (isJoining ? 'Joining...' : 'Join Challenge (0.3 USDC) →')}
            </button>
          )}

          {!hasJoined && isConnected && !isCheckingBalance && (
            <div className="mt-3 text-sm text-primary-dark-blue dark:text-accent-light-gray">
              Balance: {balance} USDC
            </div>
          )}

          {hasJoined && (
            <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg text-center">
              <p className="text-green-700 dark:text-green-400 font-bold">✓ Successfully joined!</p>
            </div>
          )}
        </div>

        {/* Challenge Interface */}
        <ShowUpChallenge />
      </div>
    </div>
  );
}
