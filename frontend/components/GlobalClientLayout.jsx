"use client"
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './Sidebar'
import PrivateModal from './PrivateModal'
import useStore from '../store/useStore'

export default function GlobalClientLayout({ children }){
  const theme = useStore(s=>s.theme)

  useEffect(()=>{
    // apply theme class to body
    if(theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 flex gap-6">
        <Sidebar />
        <div className="flex-1">
          {children}
        </div>
      </div>
      <PrivateModal />
      <ToastContainer position="bottom-right" />
    </div>
  )
}
