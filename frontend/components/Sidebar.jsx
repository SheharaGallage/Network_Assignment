"use client"
import Link from 'next/link'
import useStore from '../store/useStore'

export default function Sidebar(){
  const user = useStore(s=>s.user)
  const theme = useStore(s=>s.theme)
  const toggleTheme = useStore(s=>s.toggleTheme)

  return (
    <aside className="w-64 pr-4 hidden md:block">
      <div className="sticky top-6">
        <div className="mb-6 text-center">
          <div className="text-lg font-bold text-slate-800">Chat App</div>
          <div className="text-sm text-slate-500">{user?.username || 'Guest'}</div>
        </div>

        <nav className="space-y-2">
          <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-slate-100">Dashboard</Link>
          <Link href="/chat" className="block px-3 py-2 rounded hover:bg-slate-100">Chat</Link>
          <Link href="/files" className="block px-3 py-2 rounded hover:bg-slate-100">Files</Link>
          <Link href="/notes" className="block px-3 py-2 rounded hover:bg-slate-100">Notes</Link>
          <Link href="/admin" className="block px-3 py-2 rounded hover:bg-slate-100">Admin</Link>
          <Link href="/settings" className="block px-3 py-2 rounded hover:bg-slate-100">Settings</Link>
        </nav>

        <div className="mt-6">
          <button className="btn-primary w-full" onClick={toggleTheme}>{theme === 'light' ? 'Dark mode' : 'Light mode'}</button>
        </div>
      </div>
    </aside>
  )
}
