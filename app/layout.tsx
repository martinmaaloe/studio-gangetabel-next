import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gangetabel Spil 2.0',
  description: 'Lær gangetabellen på en sjov måde!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  )
} 