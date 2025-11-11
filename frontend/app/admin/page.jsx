"use client"
import useStore from '../../store/useStore'
import { useState } from 'react'
import { connectSocket } from '../../utils/socket'

export default function AdminPage(){
  const logs = useStore(s=>s.adminLogs)
  const users = useStore(s=>s.users)
  const [notice, setNotice] = useState('')

  function kickUser(username){
    const s = window.__socket__
    if(s && s.connected) s.emit('kick', { username })
  }

  function sendNotice(){
    const s = window.__socket__
    if(s && s.connected) s.emit('system_notice', { text: notice })
    setNotice('')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-5xl card-glass rounded-xl-very shadow-xl p-6">
        <h1 className="text-xl font-semibold mb-4 text-slate-800">Admin</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 bg-white rounded-lg p-4">
            <h3 className="font-semibold mb-2">Active Users</h3>
            <ul className="space-y-2">
              {users.map(u=> (
                <li key={u.username} className="flex items-center justify-between">
                  <span>{u.username}</span>
                  <button className="text-sm text-red-600" onClick={()=>kickUser(u.username)}>Kick</button>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <label className="block text-sm">System notice</label>
              <input className="mt-2 block w-full border rounded px-3 py-2" value={notice} onChange={e=>setNotice(e.target.value)} />
              <button className="mt-2 btn-primary" onClick={sendNotice}>Send Notice</button>
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-lg p-4">
            <h3 className="font-semibold mb-2">Live Logs</h3>
            <div className="max-h-96 overflow-auto text-sm space-y-2">
              {logs.map((l, idx)=> (
                <div key={idx} className="text-slate-700">{l.ts} — {l.text || JSON.stringify(l)}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
