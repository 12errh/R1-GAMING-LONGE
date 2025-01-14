import { motion } from 'framer-motion'
import { X, Trophy, Star, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UserProfileProps {
  setShowProfile: (show: boolean) => void
}

export function UserProfile({ setShowProfile }: UserProfileProps) {
  const user = {
    name: 'REHAN',
    level: 85,
    xp: 8500,
    nextLevelXp: 10000,
    achievements: [
      { name: 'First Victory', icon: '🏆' },
      { name: 'Sharpshooter', icon: '🎯' },
      { name: 'Team Player', icon: '🤝' },
    ],
    stats: {
      gamesPlayed: 1337,
      winRate: 65,
      avgPlaytime: '2h 15m',
    },
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-purple-900 rounded-lg shadow-lg w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <Card className="bg-purple-800 border-purple-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold text-purple-100">User Profile</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowProfile(false)}>
              <X className="h-4 w-4 text-purple-100" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${user.name}`} />
                <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">{user.name}</h2>
                <p className="text-purple-300">Level {user.level}</p>
                <div className="mt-2">
                  <Progress value={(user.xp / user.nextLevelXp) * 100} className="h-2 bg-purple-700" />
                  <p className="text-xs text-purple-400 mt-1">
                    {user.xp} / {user.nextLevelXp} XP
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <Trophy className="h-8 w-8 mx-auto text-yellow-500" />
                <p className="mt-1 text-sm text-purple-300">Games Played</p>
                <p className="font-bold text-purple-100">{user.stats.gamesPlayed}</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 mx-auto text-yellow-500" />
                <p className="mt-1 text-sm text-purple-300">Win Rate</p>
                <p className="font-bold text-purple-100">{user.stats.winRate}%</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto text-yellow-500" />
                <p className="mt-1 text-sm text-purple-300">Avg. Playtime</p>
                <p className="font-bold text-purple-100">{user.stats.avgPlaytime}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-100 mb-2">Achievements</h3>
              <div className="grid grid-cols-3 gap-2">
                {user.achievements.map((achievement) => (
                  <div key={achievement.name} className="text-center bg-purple-700 rounded-lg p-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <p className="text-xs mt-1 text-purple-200">{achievement.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

