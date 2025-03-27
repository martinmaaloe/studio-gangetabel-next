export const MESSAGES = {
  correct: [
    "Fantastisk, {name}! Du fik det helt rigtigt! 🎉",
    "Yes, {name}! Du er på rette vej! 💪",
    "Super godt gået, {name}! 🚀",
    "Spot on, {name}! Du er en mester! 🏆",
    "Det sidder lige i skabet, {name}! 😎",
    "Flot arbejde, {name}! Du er virkelig dygtig! 🌟",
    "Boom! Du ramte plet! 🔥",
    "Helt perfekt, {name}! Bliv ved sådan! ✨",
    "Wow, {name}! Du gør det fantastisk! 🎯",
    "Bravo, {name}! Du klarer det super godt! 👏"
  ],
  
  wrong: [
    "Ikke helt, {name}! Prøv igen – du kan godt! 🌈",
    "Øv, tæt på, {name}! Prøv igen! 💡",
    "Hovsa, {name}! Du rammer den næste! 👍",
    "Ikke noget problem, {name}! Alle laver fejl – prøv igen! 💪",
    "Ups! Bare rolig, {name}. Du klarer det! 🧠",
    "Forkert, men det er kun en lille hurdle, {name}! 🚧",
    "Ah, den missede vi, {name}. Du er stadig på vej mod succes! 🌟",
    "Næsten, {name}! Du er så tæt på – prøv igen! ✨",
    "Kom igen, {name}! Jeg tror på dig! 💪",
    "Det er helt okay, {name}. Giv det endnu et forsøg! 🌟"
  ],
  
  endGame: "Tillykke, {name}! Du har mestret {number}-tabellen! 🎉",
  welcome: "Hej, {name}! Klar til at lære gangetabellen?",
  chooseNumber: "Vælg et tal for at starte:",
  
  stats: {
    score: "Din score: {score}",
    streak: "Streak: {streak}",
    finalScore: "Din endelige score: {score}",
    bestStreak: "Højeste streak: {streak}"
  }
} as const; 