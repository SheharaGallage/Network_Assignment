import '../styles/globals.css'
import GlobalClientLayout from '../components/GlobalClientLayout'

export const metadata = {
  title: 'Network Chat - Frontend',
  description: 'Public and private chat UI scaffold',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen app-bg-light text-slate-900">
        <GlobalClientLayout>
          {children}
        </GlobalClientLayout>
      </body>
    </html>
  )
}
