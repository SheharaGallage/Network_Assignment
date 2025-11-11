"use client"
import { useState } from 'react'
import useStore from '../../store/useStore'

export default function Settings(){
  const user = useStore(s=>s.user)
  const [displayName, setDisplayName] = useState(user?.username || '')
  const [themeDark, setThemeDark] = useState(false)

  function save(){
    // placeholder - call backend to save profile
    useStore.setState({ user: { ...user, username: displayName } })
    alert('Profile updated (local only).')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md card-glass rounded-xl-very shadow-xl p-6">
        <h1 className="text-xl font-semibold mb-4 text-slate-800">Settings</h1>
        <div className="bg-white rounded-lg p-4">
          <label className="block text-sm">Display name</label>
          <input className="mt-2 block w-full border rounded px-3 py-2" value={displayName} onChange={e=>setDisplayName(e.target.value)} />
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Theme</div>
              <div className="text-xs text-slate-500">Toggle app theme (local)</div>
            </div>
            <label className="inline-flex items-center">
              <input type="checkbox" checked={themeDark} onChange={e=>setThemeDark(e.target.checked)} className="mr-2" />
              Dark
            </label>
          </div>
          <div className="mt-4">
            <button className="btn-primary w-full" onClick={save}>Save settings</button>
          </div>
        </div>
      </div>
    </main>
  )
}
