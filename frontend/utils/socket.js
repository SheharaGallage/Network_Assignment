import { io } from 'socket.io-client'
import useStore from '../store/useStore'

let socket = null

export function connectSocket(token){
  if(socket) return socket
  // Example: try socket.io then fallback to native WebSocket in your app
  try{
    socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000', {
      auth: { token }
    })

    socket.on('connect', ()=>{
      console.log('ws connected', socket.id)
      try{ window.__socket__ = socket }catch(e){}
    })

    socket.on('message', (m) => {
      useStore.getState().addMessage(m)
    })

    socket.on('user_joined', (u)=>{
      const users = useStore.getState().users || []
      // add if missing
      if(!users.find(x=>x.username===u.username)){
        useStore.setState({ users: [u, ...users] })
      }
      useStore.getState().addRecentActivity({ type: 'join', detail: u.username, ts: new Date().toLocaleTimeString() })
    })

    socket.on('user_left', (u)=>{
      const users = (useStore.getState().users || []).filter(x=>x.username !== u.username)
      useStore.setState({ users })
      useStore.getState().addRecentActivity({ type: 'left', detail: u.username, ts: new Date().toLocaleTimeString() })
    })

    socket.on('private_message', (m)=>{
      // expected m: { from, to, text, ts }
      useStore.getState().addMessage({ from: m.from, text: m.text, ts: m.ts || new Date().toLocaleTimeString(), privateFrom: m.from, privateTo: m.to })
    })

    socket.on('note_update', (note)=>{
      useStore.getState().setSharedNote(note)
    })

    socket.on('admin_log', (log)=>{
      useStore.getState().addAdminLog(log)
    })

    socket.on('users', (users)=>{
      // replace user list
      useStore.setState({ users })
    })

  } catch (err){
    console.warn('socket init failed', err)
  }

  return socket
}

export function sendMessage(payload){
  if(socket && socket.connected) socket.emit('message', payload)
}

export function disconnectSocket(){
  if(socket) socket.disconnect()
  socket = null
}
