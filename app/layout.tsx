// app/layout.tsx
import React from 'react'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono'
})

const geist = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist'
})

export const metadata: Metadata = {
  title: 'Heritage Heals',
  description: 'Discover traditional remedies and comfort foods for your health and wellness',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} ${geist.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}