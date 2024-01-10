import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Davies Cards Scoreboard',
  description: 'A dashboard for tracking scores for the Davies family card games.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container px-4">
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  )
}
