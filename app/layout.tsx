import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gangetabel Spil 2.0',
  description: 'Lær gangetabellen på en sjov måde!',
}

import OwlMascot from './OwlMascot'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="da">
      <body>
        {children}
        <div className="fixed bottom-0 left-0 w-full h-36 bg-gradient-to-t from-primary to-secondary rounded-t-full -z-10" />
        <OwlMascot />
      </body>
    </html>
  )
} 