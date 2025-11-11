"use client"
import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import { connectSocket } from '../../utils/socket'

export default function NotesPage(){
  const sharedNote = useStore(s=>s.sharedNote)
  const setSharedNote = useStore(s=>s.setSharedNote)
  const user = useStore(s=>s.user)
  const [local, setLocal] = useState(sharedNote || '')

  useEffect(()=>{
    setLocal(sharedNote || '')
  }, [sharedNote])

  useEffect(()=>{
    if(user?.token) connectSocket(user.token)
  }, [user])

  function handleChange(e){
    const v = e.target.value
    setLocal(v)
    // optimistically update store
    setSharedNote(v)
    // broadcast via socket
    const s = window.__socket__
    if(s && s.connected) s.emit('note_update', v)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-4xl card-glass rounded-xl-very shadow-xl p-6">
        <h1 className="text-xl font-semibold mb-4 text-slate-800">Shared Notes</h1>
        <div className="bg-white rounded-lg p-4">
          <textarea rows={12} className="w-full border rounded p-3" value={local} onChange={handleChange} />
        </div>
      </div>
    </main>
  )
}
