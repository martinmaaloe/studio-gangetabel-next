import Game from '../components/Game'
import OwlMascot from './components/OwlMascot'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <Game />
      <OwlMascot />
    </main>
  )
} 