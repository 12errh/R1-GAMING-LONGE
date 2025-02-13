'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the signup logic
    console.log('Signing up with:', username, email, password)
    // For now, we'll just redirect to the login page
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px] bg-purple-800 border-purple-600">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
              <Gamepad2 className="mr-2 h-6 w-6" />
              R1 Gaming Lounge
            </CardTitle>
            <CardDescription className="text-center text-purple-300">
              Create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-purple-700 border-purple-600 text-white placeholder-purple-400"
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-purple-700 border-purple-600 text-white placeholder-purple-400"
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-purple-700 border-purple-600 text-white placeholder-purple-400"
                  required
                />
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white">
                  Sign Up
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" className="text-purple-300 hover:text-purple-200" onClick={() => router.push('/login')}>
              Already have an account? Login
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

