import { LeaderboardEntry } from './types';

export const mockLeaderboardData: Record<string, LeaderboardEntry[]> = {
  // Show Up Challenge Leaderboard
  'show-up': [
    { rank: 1, address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', displayName: 'StreakMaster', score: 47, avatar: '🔥' },
    { rank: 2, address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72', displayName: 'DailyGrinder', score: 45, avatar: '⚡' },
    { rank: 3, address: '0xDC25EF3F5B8A186998338A2ADA83795FBA2D695E', displayName: 'ConsistencyKing', score: 43, avatar: '👑' },
    { rank: 4, address: '0x1234567890123456789012345678901234567890', displayName: 'You', score: 12, avatar: '🎯' },
    { rank: 5, address: '0x5E5C73D1c8F25C5eB63eCb3f3d72F19e67b1cD88', displayName: 'ChainWarrior', score: 38, avatar: '⚔️' },
  ],
  
  // Streak 30 Challenge Leaderboard
  'streak-30': [
    { rank: 1, address: '0xA1B2C3D4E5F6789012345678901234567890ABCD', displayName: 'ThirtyDayPro', score: 30, avatar: '🎯' },
    { rank: 2, address: '0xDEF1234567890ABCDEF1234567890ABCDEF12345', displayName: 'NeverMiss', score: 28, avatar: '🏆' },
    { rank: 3, address: '0x9876543210FEDCBA9876543210FEDCBA98765432', displayName: 'StreakHunter', score: 25, avatar: '🎪' },
  ],
  
  // Community Vote Challenge Leaderboard
  'community-vote-jan': [
    { rank: 1, address: '0xVOTE1234567890ABCDEF1234567890ABCDEF123', displayName: 'VoiceOfPeople', score: 156, avatar: '🗳️' },
    { rank: 2, address: '0xPOLL9876543210FEDCBA9876543210FEDCBA987', displayName: 'PollMaster', score: 142, avatar: '📊' },
    { rank: 3, address: '0xDEMO5432109876FEDC5432109876FEDC54321098', displayName: 'CommunityFirst', score: 138, avatar: '🤝' },
  ],
  
  // Trivia Challenge Leaderboard
  'trivia-master': [
    { rank: 1, address: '0xBRAIN123456789ABCDEF123456789ABCDEF12345', displayName: 'QuizWizard', score: 98, avatar: '🧠' },
    { rank: 2, address: '0xSMART987654321FEDCBA987654321FEDCBA9876', displayName: 'KnowledgeKing', score: 95, avatar: '📚' },
    { rank: 3, address: '0xGENIUS54321098765FED54321098765FED54321', displayName: 'BrainPower', score: 92, avatar: '💡' },
  ],
  
  // Global BCP Leaderboard
  'global-bcp': [
    { rank: 1, address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', displayName: 'StreakMaster', score: 234, avatar: '🔥' },
    { rank: 2, address: '0xBRAIN123456789ABCDEF123456789ABCDEF12345', displayName: 'QuizWizard', score: 198, avatar: '🧠' },
    { rank: 3, address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72', displayName: 'DailyGrinder', score: 187, avatar: '⚡' },
    { rank: 4, address: '0xVOTE1234567890ABCDEF1234567890ABCDEF123', displayName: 'VoiceOfPeople', score: 176, avatar: '🗳️' },
    { rank: 5, address: '0xDC25EF3F5B8A186998338A2ADA83795FBA2D695E', displayName: 'ConsistencyKing', score: 165, avatar: '👑' },
    { rank: 6, address: '0xA1B2C3D4E5F6789012345678901234567890ABCD', displayName: 'ThirtyDayPro', score: 154, avatar: '🎯' },
    { rank: 7, address: '0x1234567890123456789012345678901234567890', displayName: 'You', score: 45, avatar: '🎯' },
    { rank: 8, address: '0x5E5C73D1c8F25C5eB63eCb3f3d72F19e67b1cD88', displayName: 'ChainWarrior', score: 143, avatar: '⚔️' },
  ],
};
