import type { Metadata } from 'next'
import './globals.css'
import { ColorDivider } from '@/components/ColorDivider'

export const metadata: Metadata = {
  title: 'Soluções Digitais SEAD',
  description: 'Soluções digitais em desenvolvimento pela SEAD',
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
