import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Smile, PlusCircle, ImageIcon, Gamepad2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from '@/lib/supabase'

interface ChatAreaProps {
  channel: string
}

interface Message {
  id: string
  user_id: string 
  content: string
  created_at: string
  channel_id: string
  isSystem?: boolean
  isGameInvite?: boolean
  game?: string
}

export function ChatArea({ channel }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('channel_id', channel)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Error fetching messages:', error)
        } else {
          setMessages(data || [])
        }
      } catch (error) {
        console.error('Error connecting to Supabase:', error)
      }
    }

    fetchMessages()

    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const newMessage = payload.new as Message
        if (newMessage.channel_id === channel) {
          setMessages(prevMessages => [...prevMessages, newMessage])
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [channel])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            user_id: user?.id, 
            content: newMessage,
            channel_id: channel,
            created_at: new Date().toISOString(),
          }
        ])

      if (error) {
        console.error('Error sending message:', error)
      } else {
        setNewMessage('')
      }
    }
  }

  const sendGameInvite = async (game: string) => {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          username: 'You', 
          content: `Game invite: ${game}`,
          channel_id: channel,
          created_at: new Date().toISOString(),
          isGameInvite: true,
          game: game,
        }
      ])

    if (error) {
      console.error('Error sending game invite:', error)
    }
  }

  const emojis = ['😊', '😂', '🎮', '👍', '❤️', '🏆', '🔥', '👀', '💯', '🤔']

  return (
    <div className="flex-grow flex flex-col bg-gradient-to-br from-blue-900 to-purple-900 overflow-hidden">
      <h2 className="text-xl lg:text-2xl p-4 font-bold text-purple-300">#{channel}</h2>
      <div className="flex-grow overflow-y-auto p-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div 
              key={message.id} 
              className={`mb-4 ${message.isSystem ? 'text-purple-400 italic' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {!message.isSystem && (
                <div className="flex items-center mb-1">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${message.user_id}`} />
                    <AvatarFallback>{message.user_id?.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-bold mr-2 text-purple-300">{message.user_id}</span>
                  <span className="text-xs text-purple-400">{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
              {message.isGameInvite ? (
                <Card className="ml-8 bg-purple-800 border-purple-600">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 font-semibold">{message.username} invited you to play {message.game}</p>
                      <p className="text-purple-400 text-sm">Game: {message.game}</p>
                    </div>
                    <Button variant="secondary" size="sm" className="bg-purple-600 hover:bg-purple-500">
                      Join Game
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="ml-8 text-purple-100">{message.content}</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 bg-purple-800">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="bg-purple-700 text-white hover:bg-purple-600">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0 bg-purple-800 border-purple-600">
              <div className="grid grid-cols-2 gap-2 p-2">
                <Button variant="ghost" className="text-white hover:bg-purple-700" onClick={() => sendGameInvite('PUBG')}>
                  <Gamepad2 className="mr-2 h-4 w-4" /> PUBG
                </Button>
                <Button variant="ghost" className="text-white hover:bg-purple-700" onClick={() => sendGameInvite('Fortnite')}>
                  <Gamepad2 className="mr-2 h-4 w-4" /> Fortnite
                </Button>
                <Button variant="ghost" className="text-white hover:bg-purple-700" onClick={() => sendGameInvite('Minecraft')}>
                  <Gamepad2 className="mr-2 h-4 w-4" /> Minecraft
                </Button>
                <Button variant="ghost" className="text-white hover:bg-purple-700" onClick={() => sendGameInvite('Among Us')}>
                  <Gamepad2 className="mr-2 h-4 w-4" /> Among Us
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" className="bg-purple-700 text-white hover:bg-purple-600">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-grow bg-purple-700 text-white placeholder-purple-300 border-purple-600"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="bg-purple-700 text-white hover:bg-purple-600">
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-purple-800 border-purple-600">
              <div className="grid grid-cols-5 gap-2 p-2">
                {emojis.map(emoji => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    className="text-lg text-white hover:bg-purple-700"
                    onClick={() => setNewMessage(prev => prev + emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={sendMessage} className="bg-purple-600 hover:bg-purple-500 text-white">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

