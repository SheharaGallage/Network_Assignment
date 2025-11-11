"use client"
import { useEffect, useRef } from 'react'
import useStore from '../../store/useStore'
import MessageList from '../../components/MessageList'
import UserList from '../../components/UserList'
import MessageInput from '../../components/MessageInput'
import { connectSocket } from '../../utils/socket'
import { useRouter } from 'next/navigation'

export default function ChatPage(){
  const user = useStore(s=>s.user)
  const connect = useStore(s=>s.connect)
  const router = useRouter()

  useEffect(()=>{
    if(!user?.username) {
      router.push('/login')
      return
    }
    connectSocket(user.token)
    // on mount open ws
    connect()
    return ()=>{
      // cleanup socket on unmount handled in utils
    }
  }, [user])

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="card-glass rounded-xl-very shadow-xl p-6 chat-card">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-800">Public Chat Room</h2>
              <div className="text-sm text-slate-600">Logged in as <strong>{user?.username}</strong></div>
            </div>

            <div className="bg-white rounded-lg p-4 flex-1 flex flex-col h-[60vh]">
              <div className="flex-1 overflow-auto chat-scroll p-2" id="messagesWrap">
                <MessageList />
              </div>
              <div className="mt-4">
                <MessageInput />
              </div>
            </div>
          </div>

          <aside className="col-span-4">
            <div className="bg-white rounded-lg p-4 h-full flex flex-col">
              <h3 className="font-semibold mb-2 text-slate-800">Online Users</h3>
              <div className="flex-1 overflow-auto">
                <UserList />
              </div>
              <div className="mt-4">
                <button className="w-full btn-danger" onClick={()=>{
                  useStore.getState().logout()
                  router.push('/login')
                }}>Logout</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
