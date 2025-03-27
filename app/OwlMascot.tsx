'use client';

import Image from 'next/image';

export default function OwlMascot() {
  const handleOwlClick = () => {
    // Reset the game state in localStorage
    localStorage.removeItem('gangetabel_game_state');
    // Reload the page to start fresh
    window.location.reload();
  };

  return (
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
  );
} 