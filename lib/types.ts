export type ChallengeType = 'daily-checkin' | 'streak-milestone' | 'community-vote' | 'skill-based';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  thumbnail: string;
  participants: number;
  bcpReward: number;
  duration: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  entryFee?: number; // in USDC
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  displayName?: string;
  score: number; // BCP or challenge-specific points
  avatar?: string;
}
