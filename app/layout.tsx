import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="px-4 max-w-3xl mx-auto sm:px-6 sm:py-12 lg:max-w-4xl lg:py-4 lg:px-8 xl:max-w-6xl">
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  )
}
