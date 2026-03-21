import { useState } from "react";
import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  updateBalance: (delta: number) => void;
  navigate: (p: Page) => void;
}

const betOptions = [50, 100, 200, 500];

export default function NumberGame({ user, updateBalance, navigate }: Props) {
  const [bet, setBet] = useState(100);
  const [guess, setGuess] = useState(50);
  const [target, setTarget] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(5);
  const [hint, setHint] = useState("");
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [secretNumber, setSecretNumber] = useState(0);

  const startGame = () => {
    if (user.balance < bet) return;
    updateBalance(-bet);
    const secret = Math.floor(Math.random() * 100) + 1;
    setSecretNumber(secret);
    setAttempts(0);
    setHint("Загадано число от 1 до 100. У тебя 5 попыток!");
    setGameState("playing");
    setTarget(null);
  };

  const makeGuess = () => {
    if (gameState !== "playing") return;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setTarget(guess);

    if (guess === secretNumber) {
      const multiplier = newAttempts === 1 ? 10 : newAttempts === 2 ? 5 : newAttempts === 3 ? 3 : 2;
      const win = bet * multiplier;
      updateBalance(win);
      setHint(`🎉 Угадал за ${newAttempts} попытку! Число было ${secretNumber}`);
      setGameState("won");
    } else if (newAttempts >= maxAttempts) {
      setHint(`😢 Не угадал. Число было ${secretNumber}`);
      setGameState("lost");
    } else {
      setHint(guess > secretNumber ? `📉 Загаданное число МЕНЬШЕ ${guess}` : `📈 Загаданное число БОЛЬШЕ ${guess}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate("games")} className="flex items-center gap-2 text-gray-500 hover:text-purple-400 text-sm font-exo mb-6 transition-colors">
        <Icon name="ArrowLeft" size={16} /> Назад к играм
      </button>

      <div className="text-center mb-6">
        <h1 className="font-orbitron text-3xl font-black text-white mb-2">🔮 <span className="neon-text-purple">Угадай число</span></h1>
        <p className="text-gray-500 font-exo text-sm">Угадай число от 1 до 100 за 5 попыток!</p>
      </div>

      <div className="card-game p-8 neon-border-purple border mb-6">
        {gameState === "playing" && (
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-600/20 to-blue-500/20 border-2 border-purple-500/40 flex items-center justify-center mb-4">
              <span className="font-orbitron text-3xl font-black text-white">{target ?? "?"}</span>
            </div>
            <p className="text-sm font-exo text-gray-400">Попытка {attempts}/{maxAttempts}</p>
          </div>
        )}

        {(gameState === "won" || gameState === "lost") && (
          <div className="text-center mb-6">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${gameState === "won" ? "bg-green-600/20 border-2 border-green-500/40" : "bg-red-600/20 border-2 border-red-500/40"}`}>
              <span className="font-orbitron text-3xl font-black text-white">{secretNumber}</span>
            </div>
          </div>
        )}

        {hint && (
          <div className={`text-center py-3 mb-5 rounded-xl animate-scale-in ${
            gameState === "won" ? "bg-green-600/10 border border-green-500/30" :
            gameState === "lost" ? "bg-red-600/10 border border-red-500/20" :
            "glass border border-purple-500/20"
          }`}>
            <p className={`font-exo font-bold text-sm ${
              gameState === "won" ? "neon-text-green" : gameState === "lost" ? "text-red-400" : "text-purple-300"
            }`}>{hint}</p>
            {gameState === "won" && (
              <p className="font-orbitron text-lg neon-text-gold font-bold">
                +{(bet * (attempts === 1 ? 10 : attempts === 2 ? 5 : attempts === 3 ? 3 : 2)).toLocaleString()} D-COIN
              </p>
            )}
          </div>
        )}

        {gameState === "playing" && (
          <div className="mb-5">
            <p className="text-xs text-gray-500 font-exo text-center mb-3">Твоя догадка: <span className="text-white font-bold">{guess}</span></p>
            <input
              type="range"
              min="1"
              max="100"
              value={guess}
              onChange={(e) => setGuess(Number(e.target.value))}
              className="w-full h-2 bg-purple-900/40 rounded-full appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-600 font-exo mt-1">
              <span>1</span><span>50</span><span>100</span>
            </div>
            <button onClick={makeGuess} className="w-full btn-primary py-3 rounded-xl font-bold font-exo mt-4">
              Угадать → {guess}
            </button>
          </div>
        )}

        {gameState !== "playing" && (
          <>
            <div className="mb-4">
              <p className="text-xs text-gray-500 font-exo text-center mb-2">Ставка</p>
              <div className="flex justify-center gap-2">
                {betOptions.map((b) => (
                  <button key={b} onClick={() => setBet(b)}
                    className={`px-3 py-1.5 rounded-lg font-orbitron text-xs font-bold transition-all ${bet === b ? "btn-primary" : "glass border border-purple-800/30 text-gray-400"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 glass rounded-xl px-4 py-2">
              <span className="text-xs text-gray-500 font-exo">Баланс</span>
              <span className="font-orbitron text-sm neon-text-gold font-bold">{user.balance.toLocaleString()} D-COIN</span>
            </div>

            <button onClick={startGame} disabled={user.balance < bet}
              className={`w-full py-4 rounded-2xl font-bold font-exo text-lg ${user.balance < bet ? "bg-gray-800/50 text-gray-600 cursor-not-allowed" : "btn-primary"}`}>
              🔮 {gameState === "idle" ? "НАЧАТЬ ИГРУ" : "ИГРАТЬ СНОВА"}
            </button>
          </>
        )}

        <div className="glass rounded-xl p-3 mt-4">
          <p className="text-xs text-gray-500 font-exo text-center">
            Множители: 1 попытка = x10 · 2 = x5 · 3 = x3 · 4-5 = x2
          </p>
        </div>
      </div>
    </div>
  );
}
