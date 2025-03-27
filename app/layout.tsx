'use client';

import './globals.css'
import type { Metadata } from 'next'
import Image from 'next/image'
import { useLocalStorage } from '../lib/hooks/useLocalStorage'

export const metadata: Metadata = {
  title: 'Gangetabel Spil 2.0',
  description: 'Lær gangetabellen på en sjov måde!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const handleOwlClick = () => {
    // Reset the game state in localStorage
    localStorage.removeItem('gangetabel_game_state');
    // Reload the page to start fresh
    window.location.reload();
  };

  return (
    <html lang="da">
      <body>
        {children}
        <div className="fixed bottom-0 left-0 w-full h-36 bg-gradient-to-t from-primary to-secondary rounded-t-full -z-10" />
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-10">
          <Image
            src="/images/ugle2.png"
            alt="Ugle maskot - Klik for at starte forfra"
            width={144}
            height={144}
            className="w-36 h-auto opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
            onClick={handleOwlClick}
            title="Klik for at starte forfra"
          />
        </div>
      </body>
    </html>
  )
} 