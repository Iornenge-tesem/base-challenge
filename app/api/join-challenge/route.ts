import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, isAddress } from 'viem'
import { base } from 'viem/chains'
import { supabase } from '@/lib/supabase'

const publicClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
})

const CHALLENGE_PAYMENT_CONTRACT = process.env.NEXT_PUBLIC_CHALLENGE_PAYMENT_CONTRACT || ''
const TREASURY_WALLET = '0x01491D527190528ccBC340De80bf2E447dCc4fe3'
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const ENTRY_FEE_UNITS = 300000n // 0.3 USDC with 6 decimals

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, challengeId, transactionHash, paymentMethod, referralCode } = body

    // Validate inputs
    if (!walletAddress || !isAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      )
    }

    if (!challengeId || typeof challengeId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid challenge ID' },
        { status: 400 }
      )
    }

    if (!transactionHash || typeof transactionHash !== 'string') {
      return NextResponse.json(
        { error: 'Invalid transaction hash' },
        { status: 400 }
      )
    }

    // For Base Account payments, skip blockchain verification
    if (paymentMethod === 'base-account') {
      // Insert into challenge_participants table
      const { error: insertError } = await supabase
        .from('challenge_participants')
        .insert({
          wallet_address: walletAddress.toLowerCase(),
          challenge_id: challengeId,
          joined_at: new Date().toISOString(),
          transaction_hash: transactionHash, // Store payment ID as transaction_hash
          status: 'active',
          referral_code: referralCode || null, // Store referral code if present
        })

      if (insertError) {
        // If it's a unique constraint error (already joined), that's ok
        if (insertError.code === '23505') {
          return NextResponse.json(
            { success: true, message: 'Already joined this challenge' },
            { status: 200 }
          )
        }
        console.error('Insert error:', insertError)
        throw insertError
      }

      return NextResponse.json(
        { 
          success: true, 
          message: 'Successfully joined challenge',
          paymentId: transactionHash,
        },
        { status: 201 }
      )
    }

    // For direct blockchain transactions, verify the transaction on-chain
    // Fetch transaction from Base blockchain
    let transaction
    try {
      transaction = await publicClient.getTransaction({
        hash: transactionHash as `0x${string}`,
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Transaction not found on blockchain' },
        { status: 404 }
      )
    }

    // Verify transaction sender is the wallet
    if (transaction.from.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json(
        { error: 'Transaction sender does not match wallet address' },
        { status: 400 }
      )
    }

    // Verify transaction was to USDC contract
    if (transaction.to?.toLowerCase() !== USDC_ADDRESS.toLowerCase()) {
      return NextResponse.json(
        { error: 'Transaction was not to USDC contract' },
        { status: 400 }
      )
    }

    // Verify transaction was successful
    let receipt
    try {
      receipt = await publicClient.getTransactionReceipt({
        hash: transactionHash as `0x${string}`,
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Transaction receipt not found' },
        { status: 404 }
      )
    }

    if (receipt.status !== 'success') {
      return NextResponse.json(
        { error: 'Transaction failed on blockchain' },
        { status: 400 }
      )
    }

    // Parse transaction data to verify it's a transferFrom call to our contract
    // USDC transferFrom signature: 0x23b872dd
    // We need to verify this is a transferFrom from wallet to treasury for 0.3 USDC
    const transferFromSignature = '0x23b872dd'
    if (!transaction.input.startsWith(transferFromSignature)) {
      return NextResponse.json(
        { error: 'Transaction is not a USDC transfer' },
        { status: 400 }
      )
    }

    // Decode transferFrom(from, to, amount) - extracts to and amount from tx data
    // Format: 0x23b872dd + 64 chars (from) + 64 chars (to) + 64 chars (amount)
    try {
      // Skip signature (8 chars = 0x + 6 chars for signature)
      const dataWithoutSig = transaction.input.slice(10)
      
      // Get 'to' address (chars 64-128, skipping 'from' which is in slots 0-63)
      const toAddress = '0x' + dataWithoutSig.slice(64, 128).slice(-40)
      
      // Get amount (last 64 chars)
      const amountHex = dataWithoutSig.slice(128)
      const amount = BigInt('0x' + amountHex)

      // Verify recipient is treasury
      if (toAddress.toLowerCase() !== TREASURY_WALLET.toLowerCase()) {
        return NextResponse.json(
          { error: 'Transaction recipient is not the treasury wallet' },
          { status: 400 }
        )
      }

      // Verify amount is 0.3 USDC
      if (amount !== ENTRY_FEE_UNITS) {
        return NextResponse.json(
          { error: 'Transaction amount does not match entry fee' },
          { status: 400 }
        )
      }
    } catch (error) {
      console.error('Error parsing transaction data:', error)
      return NextResponse.json(
        { error: 'Could not verify transaction details' },
        { status: 400 }
      )
    }

    // All verifications passed - insert into challenge_participants table
    const { error: insertError } = await supabase
      .from('challenge_participants')
      .insert({
        wallet_address: walletAddress.toLowerCase(),
        challenge_id: challengeId,
        joined_at: new Date().toISOString(),
        transaction_hash: transactionHash,
        status: 'active',
        referral_code: referralCode || null, // Store referral code if present
      })

    if (insertError) {
      // If it's a unique constraint error (already joined), that's ok
      if (insertError.code === '23505') {
        return NextResponse.json(
          { success: true, message: 'Already joined this challenge' },
          { status: 200 }
        )
      }
      throw insertError
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully joined challenge',
        transactionHash,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Join challenge error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to join challenge' },
      { status: 500 }
    )
  }
}
