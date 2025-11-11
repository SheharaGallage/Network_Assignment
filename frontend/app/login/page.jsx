"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '../../store/useStore'

export default function LoginPage(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const setUser = useStore(s => s.setUser)
  const registerUsers = useStore(s=>s.registered)

  const [remember, setRemember] = useState(false)
  function handleSubmit(e){
    e.preventDefault()
    if(!username.trim()) return setError('Please enter a username')
    // Simulate auth call - in real app POST to backend to receive token
    if(!username.trim()) return setError('Please enter a username')
    const fakeToken = 'token-' + Math.random().toString(36).slice(2)
    setUser({ username, token: fakeToken, remember })
    // toast or navigate to dashboard
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black/90" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-black drop-shadow-md">Welcome Back</h1>
          <p className="mt-2 text-black/90">Login to continue your conversations</p>
        </div>

        <div className="mx-auto card-glass rounded-xl-very shadow-xl w-full max-w-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left">
              <label className="block text-sm font-medium text-slate-700">Username or Nickname</label>
              <input className="mt-2 block w-full border border-slate-200 rounded-lg px-4 py-3 input-field focus-ring outline-none" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter your username" />
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" className="mt-2 block w-full border border-slate-200 rounded-lg px-4 py-3 input-field focus-ring outline-none" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center">
                <input type="checkbox" className="mr-2" checked={remember} onChange={e=>setRemember(e.target.checked)} /> Remember me
              </label>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">Login</button>
                <a href="/register" className="btn-primary bg-white text-slate-800">Register</a>
              </div>
            </div>
          </form>
        </div>

        <footer className="mt-8 text-white/80">
          <div>© 2025 Chat App. All rights reserved.</div>
        </footer>
      </div>
    </main>
  )
}
