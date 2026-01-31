import { usePublicClient, useWriteContract } from 'wagmi'
import { Address, formatUnits } from 'viem'
import {
  CHALLENGE_PAYMENT_CONTRACT,
  USDC_ADDRESS,
  ENTRY_FEE_USDC,
  ENTRY_FEE_UNITS,
} from '../lib/usdc'

const CHALLENGE_PAYMENT_ABI = [
  {
    name: 'checkBalance',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'balanceSufficient', type: 'bool' },
      { name: 'balance', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    name: 'joinChallenge',
    type: 'function',
    inputs: [{ name: 'challengeId', type: 'bytes32' }],
    outputs: [{ name: 'success', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'checkParticipation',
    type: 'function',
    inputs: [
      { name: 'challengeId', type: 'bytes32' },
      { name: 'user', type: 'address' },
    ],
    outputs: [{ name: 'joined', type: 'bool' }],
    stateMutability: 'view',
  },
]

const USDC_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'allowance',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: 'amount', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'approve',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
]

export function useChallengePayment() {
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()
  const contractAddress = CHALLENGE_PAYMENT_CONTRACT as Address
  const usdcAddress = USDC_ADDRESS as Address

  const checkBalance = async (userAddress: Address) => {
    if (!publicClient || !contractAddress) {
      return { balanceSufficient: false, balance: BigInt(0), balanceFormatted: '0' }
    }

    try {
      const [balanceSufficient, balance] = (await publicClient.readContract({
        address: contractAddress,
        abi: CHALLENGE_PAYMENT_ABI,
        functionName: 'checkBalance',
        args: [userAddress],
      })) as [boolean, bigint]
      return {
        balanceSufficient,
        balance,
        balanceFormatted: formatUnits(balance, 6),
        hasEnough: balanceSufficient,
      }
    } catch (error) {
      console.error('Error checking balance:', error)
      throw new Error('Failed to check balance')
    }
  }

  const getAllowance = async (userAddress: Address) => {
    if (!publicClient || !contractAddress || !usdcAddress) return BigInt(0)

    try {
      const allowance = (await publicClient.readContract({
        address: usdcAddress,
        abi: USDC_ABI,
        functionName: 'allowance',
        args: [userAddress, contractAddress],
      })) as bigint
      return allowance
    } catch (error) {
      console.error('Error checking allowance:', error)
      return BigInt(0)
    }
  }

  const approveUsdc = async () => {
    if (!contractAddress || !usdcAddress) throw new Error('Contract not configured')

    try {
      const tx = await writeContractAsync({
        address: usdcAddress,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [contractAddress, BigInt(ENTRY_FEE_UNITS)],
      })
      return tx
    } catch (error: any) {
      console.error('Error approving USDC:', error)
      throw new Error(error.message || 'Failed to approve USDC')
    }
  }

  const joinChallenge = async (challengeId: `0x${string}`) => {
    if (!contractAddress) throw new Error('Contract not configured')

    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: CHALLENGE_PAYMENT_ABI,
        functionName: 'joinChallenge',
        args: [challengeId],
      })
      return tx
    } catch (error: any) {
      console.error('Error joining challenge:', error)
      throw new Error(error.message || 'Failed to join challenge')
    }
  }

  const checkParticipation = async (challengeId: `0x${string}`, userAddress: Address) => {
    if (!publicClient || !contractAddress) return false

    try {
      const hasJoined = (await publicClient.readContract({
        address: contractAddress,
        abi: CHALLENGE_PAYMENT_ABI,
        functionName: 'checkParticipation',
        args: [challengeId, userAddress],
      })) as boolean
      return hasJoined
    } catch (error) {
      console.error('Error checking participation:', error)
      return false
    }
  }

  return {
    checkBalance,
    getAllowance,
    approveUsdc,
    joinChallenge,
    checkParticipation,
    entryFee: ENTRY_FEE_USDC,
    entryFeeUnits: ENTRY_FEE_UNITS,
  }
}
