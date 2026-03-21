import { useState } from "react";
import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  updateBalance: (delta: number) => void;
  navigate: (p: Page) => void;
}

const diceEmoji = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const betOptions = [100, 200, 500, 1000];

type BetType = "exact" | "over7" | "under7" | "seven" | "doubles";

const betTypeLabels: Record<BetType, { label: string; mult: number }> = {
  exact: { label: "Точная сумма", mult: 30 },
  over7: { label: "Больше 7", mult: 2 },
  under7: { label: "Меньше 7", mult: 2 },
  seven: { label: "Ровно 7", mult: 5 },
  doubles: { label: "Дубль", mult: 6 },
};

export default function DiceGame({ user, updateBalance, navigate }: Props) {
  const [bet, setBet] = useState(100);
  const [betType, setBetType] = useState<BetType>("over7");
  const [exactGuess, setExactGuess] = useState(7);
  const [dice, setDice] = useState([0, 0]);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<{ text: string; win: number } | null>(null);

  const roll = () => {
    if (rolling || user.balance < bet) return;
    updateBalance(-bet);
    setRolling(true);
    setResult(null);

    const interval = setInterval(() => {
      setDice([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      setDice([d1, d2]);
      setRolling(false);

      const sum = d1 + d2;
      let win = 0;
      let text = "";

      if (betType === "exact" && sum === exactGuess) {
        win = bet * 30;
        text = `Точное попадание! Сумма ${sum}`;
      } else if (betType === "over7" && sum > 7) {
        win = bet * 2;
        text = `Больше 7! Сумма ${sum}`;
      } else if (betType === "under7" && sum < 7) {
        win = bet * 2;
        text = `Меньше 7! Сумма ${sum}`;
      } else if (betType === "seven" && sum === 7) {
        win = bet * 5;
        text = `Семёрка! Удача!`;
      } else if (betType === "doubles" && d1 === d2) {
        win = bet * 6;
        text = `Дубль ${d1}! Красота!`;
      } else {
        text = `Сумма ${sum}. Не повезло...`;
      }

      if (win > 0) updateBalance(win);
      setResult({ text, win });
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate("games")} className="flex items-center gap-2 text-gray-500 hover:text-purple-400 text-sm font-exo mb-6 transition-colors">
        <Icon name="ArrowLeft" size={16} /> Назад к играм
      </button>

      <div className="text-center mb-6">
        <h1 className="font-orbitron text-3xl font-black text-white mb-2">🎲 <span className="neon-text-blue">Кости</span></h1>
        <p className="text-gray-500 font-exo text-sm">Два кубика, одна судьба!</p>
      </div>

      <div className="card-game p-8 neon-border-blue border mb-6">
        {/* Dice Display */}
        <div className="flex justify-center gap-6 mb-6">
          {dice.map((d, i) => (
            <div key={i} className={`w-24 h-24 glass rounded-2xl border border-purple-500/20 flex items-center justify-center text-5xl ${rolling ? "animate-pulse" : ""} transition-all`}>
              {d > 0 ? diceEmoji[d] : "🎲"}
            </div>
          ))}
        </div>

        {dice[0] > 0 && !rolling && (
          <div className="text-center mb-4">
            <span className="font-orbitron text-xl text-white font-bold">Сумма: {dice[0] + dice[1]}</span>
          </div>
        )}

        {result && (
          <div className={`text-center py-3 mb-4 rounded-xl animate-scale-in ${result.win > 0 ? "bg-green-600/10 border border-green-500/30" : "bg-red-600/10 border border-red-500/20"}`}>
            <p className={`font-exo font-bold text-sm ${result.win > 0 ? "neon-text-green" : "text-red-400"}`}>{result.text}</p>
            {result.win > 0 && <p className="font-orbitron text-lg neon-text-gold font-bold">+{result.win.toLocaleString()} D-COIN</p>}
          </div>
        )}

        {/* Bet Type */}
        <div className="mb-5">
          <p className="text-xs text-gray-500 font-exo text-center mb-3">Тип ставки</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(betTypeLabels) as BetType[]).map((t) => (
              <button key={t} onClick={() => setBetType(t)}
                className={`px-3 py-2 rounded-xl text-xs font-exo font-bold transition-all ${betType === t ? "btn-primary" : "glass border border-purple-800/30 text-gray-400 hover:text-white"}`}>
                {betTypeLabels[t].label} <span className="text-neon-gold ml-1">x{betTypeLabels[t].mult}</span>
              </button>
            ))}
          </div>

          {betType === "exact" && (
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500 font-exo mb-2">Угадай сумму: <span className="text-white font-bold">{exactGuess}</span></p>
              <input type="range" min="2" max="12" value={exactGuess}
                onChange={(e) => setExactGuess(Number(e.target.value))}
                className="w-full h-2 bg-purple-900/40 rounded-full appearance-none cursor-pointer accent-purple-500" />
              <div className="flex justify-between text-xs text-gray-600 font-exo mt-1">
                <span>2</span><span>7</span><span>12</span>
              </div>
            </div>
          )}
        </div>

        {/* Bet */}
        <div className="mb-5">
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

        <button onClick={roll} disabled={rolling || user.balance < bet}
          className={`w-full py-4 rounded-2xl font-bold font-exo text-lg transition-all ${rolling ? "bg-gray-700/30 text-gray-500 cursor-wait" : user.balance < bet ? "bg-gray-800/50 text-gray-600 cursor-not-allowed" : "btn-secondary"}`}>
          {rolling ? "Кубики летят..." : "🎲 БРОСИТЬ КОСТИ"}
        </button>
      </div>
    </div>
  );
}
