"use client"
import useStore from '../../store/useStore'
import { useRouter } from 'next/navigation'

export default function Dashboard(){
  const users = useStore(s=>s.users)
  const recent = useStore(s=>s.recentActivity)
  const router = useRouter()

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-4xl card-glass rounded-xl-very shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
          <div className="flex gap-3">
            <button className="btn-primary" onClick={()=>router.push('/chat')}>Open Chat</button>
            <button className="btn-primary" onClick={()=>router.push('/files')}>Files</button>
            <button className="btn-primary" onClick={()=>router.push('/notes')}>Notes</button>
          </div>
        </div>

        <section className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold mb-2">Connected Users</h3>
            <ul className="text-sm space-y-2">
              {users.map(u=> <li key={u.username}>{u.username}</li>)}
            </ul>
          </div>

          <div className="col-span-2 bg-white rounded-lg p-4">
            <h3 className="font-semibold mb-2">Recent Activity</h3>
            <ul className="text-sm space-y-2 max-h-56 overflow-auto">
              {recent.map((r, idx)=> (
                <li key={idx} className="text-slate-700">{r.ts} — {r.type}: {r.detail}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}
