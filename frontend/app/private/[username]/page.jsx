"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '../../../store/useStore'
import MessageList from '../../../components/MessageList'
import MessageInput from '../../../components/MessageInput'

export default function PrivateChat({ params }){
  // `params` is a Promise in Next.js 15; unwrap with React.use()
  const { username } = React.use(params)
  const user = useStore(s=>s.user)
  const router = useRouter()

  useEffect(()=>{
    if(!user?.username) router.push('/login')
  }, [user])

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="card-glass rounded-xl-very shadow-xl w-full max-w-3xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-800">Private chat with {username}</h2>
          <div className="flex gap-3">
            <button className="text-sm text-slate-600" onClick={()=>router.push('/chat')}>Back to Public Chat</button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 flex-1 flex flex-col h-[60vh]">
          <div className="flex-1 overflow-auto chat-scroll p-2">
            <MessageList privateTo={username} />
          </div>
          <div className="mt-3">
            <MessageInput privateTo={username} />
          </div>
        </div>
      </div>
    </main>
  )
}
