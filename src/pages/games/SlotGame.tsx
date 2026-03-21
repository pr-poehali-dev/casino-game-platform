import { useState } from "react";
import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  updateBalance: (delta: number) => void;
  navigate: (p: Page) => void;
}

const symbols = ["🍒", "🍋", "🔔", "⭐", "💎", "7️⃣", "🍇", "🍊"];
const betOptions = [50, 100, 200, 500, 1000];

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

export default function SlotGame({ user, updateBalance, navigate }: Props) {
  const [reels, setReels] = useState([["⭐", "🍒", "💎"], ["🍋", "⭐", "🔔"], ["💎", "7️⃣", "🍒"]]);
  const [bet, setBet] = useState(100);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ text: string; win: number } | null>(null);

  const spin = () => {
    if (spinning || user.balance < bet) return;
    updateBalance(-bet);
    setSpinning(true);
    setResult(null);

    const interval = setInterval(() => {
      setReels([
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      ]);
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      const finalReels = [
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      ];
      setReels(finalReels);
      setSpinning(false);

      const middleRow = [finalReels[0][1], finalReels[1][1], finalReels[2][1]];
      if (middleRow[0] === middleRow[1] && middleRow[1] === middleRow[2]) {
        const multiplier = middleRow[0] === "7️⃣" ? 50 : middleRow[0] === "💎" ? 20 : 10;
        const win = bet * multiplier;
        updateBalance(win);
        setResult({ text: `ДЖЕКПОТ! ${middleRow[0]}${middleRow[0]}${middleRow[0]}`, win });
      } else if (middleRow[0] === middleRow[1] || middleRow[1] === middleRow[2]) {
        const win = bet * 2;
        updateBalance(win);
        setResult({ text: "Пара! Маленький выигрыш", win });
      } else {
        setResult({ text: "Не повезло... Попробуй ещё!", win: 0 });
      }
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate("games")} className="flex items-center gap-2 text-gray-500 hover:text-purple-400 text-sm font-exo mb-6 transition-colors">
        <Icon name="ArrowLeft" size={16} /> Назад к играм
      </button>

      <div className="text-center mb-6">
        <h1 className="font-orbitron text-3xl font-black text-white mb-2">🎰 <span className="neon-text-purple">Слоты</span></h1>
        <p className="text-gray-500 font-exo text-sm">3 одинаковых символа — джекпот!</p>
      </div>

      <div className="card-game p-8 neon-border-purple border mb-6">
        <div className="flex justify-center gap-3 mb-6">
          {reels.map((reel, i) => (
            <div key={i} className="glass rounded-2xl w-24 overflow-hidden border border-purple-500/20">
              {reel.map((sym, j) => (
                <div key={j} className={`h-24 flex items-center justify-center text-4xl ${j === 1 ? "bg-purple-600/10" : ""} ${spinning ? "animate-pulse" : ""}`}>
                  {sym}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-px flex-1 bg-neon-gold/30" />
          <span className="text-xs text-neon-gold font-orbitron">ЛИНИЯ ВЫИГРЫША</span>
          <div className="h-px flex-1 bg-neon-gold/30" />
        </div>

        {result && (
          <div className={`text-center py-3 mb-4 rounded-xl ${result.win > 0 ? "bg-green-600/10 border border-green-500/30" : "bg-red-600/10 border border-red-500/20"} animate-scale-in`}>
            <p className={`font-exo font-bold text-sm ${result.win > 0 ? "neon-text-green" : "text-red-400"}`}>{result.text}</p>
            {result.win > 0 && <p className="font-orbitron text-lg neon-text-gold font-bold">+{result.win.toLocaleString()} D-COIN</p>}
          </div>
        )}

        <div className="mb-5">
          <p className="text-xs text-gray-500 font-exo text-center mb-2">Ставка</p>
          <div className="flex justify-center gap-2">
            {betOptions.map((b) => (
              <button key={b} onClick={() => setBet(b)}
                className={`px-3 py-1.5 rounded-lg font-orbitron text-xs font-bold transition-all ${bet === b ? "btn-primary" : "glass border border-purple-800/30 text-gray-400 hover:text-white"}`}>
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 glass rounded-xl px-4 py-2">
          <span className="text-xs text-gray-500 font-exo">Баланс</span>
          <span className="font-orbitron text-sm neon-text-gold font-bold">{user.balance.toLocaleString()} D-COIN</span>
        </div>

        <button onClick={spin} disabled={spinning || user.balance < bet}
          className={`w-full py-4 rounded-2xl font-bold font-exo text-lg transition-all flex items-center justify-center gap-2 ${spinning ? "bg-gray-700/30 text-gray-500 cursor-wait" : user.balance < bet ? "bg-gray-800/50 text-gray-600 cursor-not-allowed" : "btn-gold"}`}>
          {spinning ? "Крутится..." : user.balance < bet ? "Мало D-COIN" : "🎰 КРУТИТЬ"}
        </button>
      </div>
    </div>
  );
}
