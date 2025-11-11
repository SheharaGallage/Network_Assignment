"use client"
import { useState, useRef } from 'react'
import useStore from '../store/useStore'

export default function MessageInput({ privateTo }){
  const [text, setText] = useState('')
  const sendMessage = useStore(s=>s.sendMessage)
  const user = useStore(s=>s.user)
  const setTyping = useStore(s=>s.setTyping)
  const typingTimer = useRef(null)

  function send(){
    if(!text.trim()) return
    // use store helper to create and record message
    sendMessage(text.trim(), privateTo)
    setText('')
    // clear typing state
    setTyping(user.username, false)
  }

  function handleChange(e){
    const v = e.target.value
    setText(v)
    if(!user?.username) return
    // set typing true
    setTyping(user.username, true)
    if(typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(()=>{
      setTyping(user.username, false)
    }, 1500)
  }

  return (
    <div className="flex gap-3">
      <input className="flex-1 border border-slate-200 rounded-lg px-4 py-3 input-field focus-ring outline-none" value={text} onChange={handleChange} placeholder={privateTo ? `Message ${privateTo}` : 'Type a message...'} onKeyDown={e=>{ if(e.key === 'Enter') send() }} />
      <button className="btn-primary" onClick={send}>Send</button>
    </div>
  )
}
