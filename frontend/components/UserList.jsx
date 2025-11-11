"use client"
import useStore from '../store/useStore'
import { useRouter } from 'next/navigation'

export default function UserList(){
  const users = useStore(s=>s.users)
  const openPrivate = useStore(s=>s.openPrivate)

  return (
    <div className="flex flex-col space-y-3 overflow-auto">
      {users.map(u=> (
        <div key={u.username} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="online-dot" aria-hidden></span>
            <div>
              <div className="font-medium text-slate-800">{u.username}</div>
              <div className="text-xs text-slate-500">{u.status || 'online'}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="text-sm text-slate-600" onClick={()=>openPrivate(u.username)}>Private</button>
          </div>
        </div>
      ))}
    </div>
  )
}
