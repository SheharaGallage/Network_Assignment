import { redirect } from 'next/navigation'

// redirect root to login
export default function Home() {
  redirect('/login')
}
