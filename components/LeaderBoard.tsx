'use client'

import { useEffect, useState } from 'react'

interface LeaderBoardEntry {
  address: string
  username?: string
  avatar?: string
  streak: number
  points: number
}

export default function LeaderBoard() {
  const [leaders, setLeaders] = useState<LeaderBoardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard?challenge_id=show-up&limit=5')
      if (response.ok) {
        const data = await response.json()
        // Transform API response to match component structure
        const formattedLeaders = data.leaderboard.map((entry: any) => ({
          address: entry.address,
          username: entry.displayName,
          avatar: entry.avatar,
          streak: entry.streak || 0,
          points: entry.score || 0,
        }))
        setLeaders(formattedLeaders)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-primary-light-blue rounded-2xl shadow-lg p-6 border-2 border-primary-light-mode-blue dark:border-accent-green">
        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-accent-green to-accent-green-dark bg-clip-text text-transparent">Leaderboard</h3>
        <div className="text-center text-primary-dark-blue dark:text-primary-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-primary-light-blue rounded-2xl shadow-lg p-6 border-2 border-primary-light-mode-blue dark:border-accent-green">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-accent-green to-accent-green-dark bg-clip-text text-transparent">
          <span>🏆</span> Top Participants
        </h3>
        <a 
          href="/challenges/show-up/leaderboard" 
          className="text-sm text-accent-green dark:text-accent-green hover:underline"
        >
          View Full →
        </a>
      </div>
      
      <div className="space-y-3">
        {leaders.length === 0 ? (
          <p className="text-center text-primary-dark-blue dark:text-primary-white py-8">
            No participants yet. Be the first!
          </p>
        ) : (
          leaders.map((leader, index) => (
            <div
              key={leader.address}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-accent-green/40 to-accent-green-dark/20 dark:from-accent-green/20 dark:to-accent-green-dark/10 rounded-lg hover:from-accent-green/60 hover:to-accent-green-dark/30 transition-all min-h-[60px] border border-primary-light-mode-blue dark:border-accent-green/50"
            >
              <div className="text-2xl font-bold bg-gradient-to-r from-accent-green to-accent-green-dark bg-clip-text text-transparent w-8">
                {index + 1}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-green to-accent-green-dark flex items-center justify-center text-primary-dark-blue font-bold">
                {leader.username?.[0]?.toUpperCase() || leader.address.slice(2, 4).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <div className="font-medium text-primary-dark-blue dark:text-primary-white">
                  {leader.username || `${leader.address.slice(0, 6)}...${leader.address.slice(-4)}`}
                </div>
                <div className="text-sm text-primary-dark-blue dark:text-accent-light-gray">
                  {leader.streak} day streak
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold bg-gradient-to-r from-accent-green to-accent-green-dark bg-clip-text text-transparent">
                  {leader.points}
                </div>
                <div className="text-xs text-primary-dark-blue dark:text-accent-light-gray">BCP</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
