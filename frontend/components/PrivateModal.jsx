"use client"
import useStore from '../store/useStore'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

export default function PrivateModal(){
  const privateUser = useStore(s=>s.privateChatUser)
  const close = useStore(s=>s.closePrivate)
  if(!privateUser) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={close}></div>
      <div className="relative w-full max-w-2xl card-glass rounded-xl-very shadow-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-800">Private chat with {privateUser}</h3>
          <button className="text-slate-600" onClick={close}>Close</button>
        </div>
        <div className="bg-white rounded-lg p-3 h-80 flex flex-col">
          <div className="flex-1 overflow-auto chat-scroll p-2">
            <MessageList privateTo={privateUser} />
          </div>
          <div className="mt-3">
            <MessageInput privateTo={privateUser} />
          </div>
        </div>
      </div>
    </div>
  )
}
