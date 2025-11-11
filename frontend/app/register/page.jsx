"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '../../store/useStore'
import { toast } from 'react-toastify'

export default function RegisterPage(){
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const setUser = useStore(s=>s.setUser)
  const registerUser = useStore(s=>s.registerUser)

  function handleSubmit(e){
    e.preventDefault()
    if(!username.trim() || !password) return setError('Please enter username and password')
    if(password !== confirm) return setError('Passwords do not match')
    // mock register locally
    const user = { username, email }
  registerUser(user)
  const fakeToken = 'token-' + Math.random().toString(36).slice(2)
  setUser({ username, token: fakeToken })
  toast.success('Account created — logged in')
  router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md card-glass rounded-xl-very shadow-xl p-8">
        <h1 className="text-2xl font-semibold mb-4 text-slate-800">Create account</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input className="mt-2 block w-full border border-slate-200 rounded-lg px-4 py-3" value={username} onChange={e=>setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" className="mt-2 block w-full border border-slate-200 rounded-lg px-4 py-3" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div>
            <button className="btn-primary w-full">Create account</button>
          </div>
        </form>
      </div>
    </main>
  )
}
