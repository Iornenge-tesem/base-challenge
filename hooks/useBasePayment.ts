'use client'

import { pay, getPaymentStatus } from '@base-org/account'
import { useState } from 'react'

const RECIPIENT_ADDRESS = process.env.NEXT_PUBLIC_RECIPIENT_WALLET || '0x01491D527190528ccBC340De80bf2E447dCc4fe3'
const ENTRY_FEE_AMOUNT = '0.30' // 0.3 USDC

export function useBasePayment() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processPayment = async (challengeId: string, userAddress: string) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Initiate payment
      const payment = await pay({
        amount: ENTRY_FEE_AMOUNT,
        to: RECIPIENT_ADDRESS,
        testnet: false, // Set to true for testing
      })

      if (!payment?.id) {
        throw new Error('Payment initiation failed - no payment ID received')
      }

      // Poll for payment status
      let attempts = 0
      const maxAttempts = 10
      let paymentStatus = 'pending'

      while (attempts < maxAttempts && paymentStatus === 'pending') {
        await new Promise(resolve => setTimeout(resolve, 1500)) // Wait 1.5 seconds

        const statusResponse = await getPaymentStatus({
          id: payment.id,
          testnet: false,
        })

        paymentStatus = statusResponse?.status || 'pending'
        attempts++

        if (paymentStatus === 'completed') {
          // Get referral code from localStorage
          const referralCode = typeof window !== 'undefined' ? localStorage.getItem('referralCode') : null

          // Verify payment with backend
          const verifyResponse = await fetch('/api/join-challenge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              walletAddress: userAddress,
              challengeId,
              transactionHash: payment.id,
              paymentMethod: 'base-account',
              referralCode: referralCode || undefined,
            }),
          })

          if (!verifyResponse.ok) {
            const errorData = await verifyResponse.json()
            throw new Error(errorData.error || 'Payment verification failed')
          }

          setIsProcessing(false)
          return { success: true, paymentId: payment.id }
        } else if (paymentStatus === 'failed') {
          throw new Error('Payment was rejected')
        }
      }

      // Timeout - payment still pending
      throw new Error('Payment timeout - transaction is taking too long')
    } catch (err: any) {
      const errorMessage = err?.message || 'Payment processing failed'
      setError(errorMessage)
      setIsProcessing(false)
      return { success: false, error: errorMessage }
    }
  }

  const checkParticipation = async (challengeId: string, userAddress: string) => {
    try {
      const response = await fetch(`/api/check-participation?challenge_id=${challengeId}&wallet_address=${userAddress}`)
      if (response.ok) {
        const data = await response.json()
        return data.hasJoined || false
      }
      return false
    } catch (error) {
      console.error('Error checking participation:', error)
      return false
    }
  }

  return {
    processPayment,
    checkParticipation,
    isProcessing,
    error,
    entryFee: ENTRY_FEE_AMOUNT,
  }
}
