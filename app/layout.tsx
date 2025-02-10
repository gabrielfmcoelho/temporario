import type { Metadata } from 'next'
import './globals.css'
import { ColorDivider } from '@/components/ColorDivider'

export const metadata: Metadata = {
  title: 'Soluções Digitais',
  description: 'Soluções digitais em desenvolvimento - SUR Systems'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
