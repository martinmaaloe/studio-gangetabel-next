'use client';

import Image from 'next/image';
import { useLocalStorage } from '../../lib/hooks/useLocalStorage';

export default function OwlMascot() {
  const handleOwlClick = () => {
    localStorage.removeItem('gangetabel_game_state');
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Image
        src="/images/ugle2.png"
        alt="Ugle maskot - klik for at starte forfra"
        width={100}
        height={100}
        onClick={handleOwlClick}
        className="cursor-pointer hover:scale-110 transition-transform"
        title="Klik på mig for at starte forfra!"
      />
    </div>
  );
} 