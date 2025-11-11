import create from 'zustand'

const useStore = create((set, get)=>({
  user: null,
  users: [ { username: 'alice' }, { username: 'bob' }, { username: 'carol' } ],
  messages: [
    { from: 'alice', text: 'Welcome to the public chat!', ts: new Date().toLocaleTimeString() }
  ],
  typingUsers: [],
  files: [],
  uploads: {},
  sharedNote: '',
  adminLogs: [],
  recentActivity: [
    { user: 'Alice', action: 'joined the chat', time: '2 min ago' },
    { user: 'Bob', action: 'uploaded a file', time: '5 min ago' }
  ],
  registered: [],
  privateChatUser: null,
  theme: 'light',
  setUser(user){
    set({ user })
    // persist simple session token if requested elsewhere
    if(user && user.remember) {
      try{ localStorage.setItem('chat_user', JSON.stringify(user)) }catch(e){}
    }
  },
  registerUser(u){
    set(state=>({ registered: [...state.registered, u], users: [...state.users, { username: u.username }] }))
  },
  addMessage(msg){
    set(state=>({ messages: [...state.messages, msg] }))
  },
  sendMessage(text, privateTo){
    const user = get().user
    if(!user) return
    const msg = { from: user.username, text, ts: new Date().toLocaleTimeString(), privateTo: privateTo || null }
    set(state=>({ messages: [...state.messages, msg] }))
    get().addRecentActivity({ type: 'message', detail: text.slice(0,40), ts: msg.ts })
  },
  addFile(fileMeta){
    set(state=>({ files: [fileMeta, ...state.files], recentActivity: [{ type: 'file', detail: fileMeta.name, ts: new Date().toLocaleTimeString() }, ...state.recentActivity].slice(0,50) }))
  },
  setUploadProgress(id, progress){
    set(state=>({ uploads: { ...state.uploads, [id]: progress } }))
  },
  setSharedNote(note){
    set({ sharedNote: note })
  },
  addAdminLog(log){
    set(state=>({ adminLogs: [log, ...state.adminLogs].slice(0,200) }))
  },
  addRecentActivity(entry){
    set(state=>({ recentActivity: [entry, ...state.recentActivity].slice(0,50) }))
  },
  setTyping(username, isTyping){
    set(state=>{
      const list = new Set(state.typingUsers || [])
      if(isTyping) list.add(username)
      else list.delete(username)
      return { typingUsers: Array.from(list) }
    })
  },
  openPrivate(username){ set({ privateChatUser: username }) },
  closePrivate(){ set({ privateChatUser: null }) },
  connect(){
    // connect to WS - delegated to utils/socket
  },
  logout(){
    try{ localStorage.removeItem('chat_user') }catch(e){}
    set({ user: null })
    // close socket if necessary
  }
  ,
  toggleTheme(){ set(state=>({ theme: state.theme === 'light' ? 'dark' : 'light' })) },
}))

export default useStore
