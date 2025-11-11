"use client"
import { useEffect, useRef } from 'react'
import useStore from '../store/useStore'

export default function MessageList({ privateTo }){
  const messages = useStore(s=>s.messages)
  const user = useStore(s=>s.user)
  const typingUsers = useStore(s=>s.typingUsers)
  const containerRef = useRef(null)

  const items = privateTo ? messages.filter(m=>m.privateTo === privateTo || (m.privateFrom === privateTo && m.privateTo === user.username)) : messages.filter(m=>!m.privateTo)

  // auto-scroll to latest message
  useEffect(()=>{
    const el = containerRef.current
    if(!el) return
    // scroll smoothly to bottom
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [items.length])

  return (
    <div className="flex flex-col gap-3 h-full">
      <div ref={containerRef} className="flex-1 overflow-auto p-2 flex flex-col gap-3">
        {items.map((m, idx)=> (
          <div key={idx} className={`flex flex-col ${m.from === user?.username ? 'items-end' : 'items-start'}`}>
            <div className={`msg-bubble ${m.from === user?.username ? 'msg-from-me' : 'msg-from-other'}`}>
              <div className="text-sm text-slate-600">{m.from} <span className="text-xs text-slate-400">{m.ts}</span></div>
              <div className="mt-1 text-slate-800">{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* typing indicator */}
      <div className="h-6">
        {typingUsers && typingUsers.length > 0 && (
          <div className="text-sm text-slate-500">{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</div>
        )}
      </div>
    </div>
  )
}
