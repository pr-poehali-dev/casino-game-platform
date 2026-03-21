import { useState } from "react";
import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  updateBalance: (delta: number) => void;
  navigate: (p: Page) => void;
}

type BetType = "red" | "black" | "green" | "odd" | "even" | "1-18" | "19-36";

const betMultipliers: Record<BetType, number> = {
  red: 2, black: 2, green: 36, odd: 2, even: 2, "1-18": 2, "19-36": 2,
};

const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];

function getNumberColor(n: number): "red" | "black" | "green" {
  if (n === 0) return "green";
  return redNumbers.includes(n) ? "red" : "black";
}

const betOptions = [50, 100, 200, 500];

export default function RouletteGame({ user, updateBalance, navigate }: Props) {
  const [bet, setBet] = useState(100);
  const [betType, setBetType] = useState<BetType>("red");
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ number: number; color: string; win: number; text: string } | null>(null);

  const spin = () => {
    if (spinning || user.balance < bet) return;
    updateBalance(-bet);
    setSpinning(true);
    setResult(null);

    setTimeout(() => {
      const num = Math.floor(Math.random() * 37);
      const color = getNumberColor(num);
      let win = 0;
      let text = "";

      const isWin = (
        (betType === "red" && color === "red") ||
        (betType === "black" && color === "black") ||
        (betType === "green" && color === "green") ||
        (betType === "odd" && num > 0 && num % 2 === 1) ||
        (betType === "even" && num > 0 && num % 2 === 0) ||
        (betType === "1-18" && num >= 1 && num <= 18) ||
        (betType === "19-36" && num >= 19 && num <= 36)
      );

      if (isWin) {
        win = bet * betMultipliers[betType];
        updateBalance(win);
        text = color === "green" ? "ЗЕРО! Невероятная удача!" : "Выигрыш!";
      } else {
        text = "Не угадал...";
      }

      setSpinning(false);
      setResult({ number: num, color, win, text });
    }, 2000);
  };

  const colorMap: Record<string, string> = {
    red: "bg-red-600", black: "bg-gray-800", green: "bg-green-600",
  };

  const betButtons: { type: BetType; label: string; color: string }[] = [
    { type: "red", label: "🔴 Красное", color: "border-red-500/40 hover:bg-red-600/20 text-red-400" },
    { type: "black", label: "⚫ Чёрное", color: "border-gray-500/40 hover:bg-gray-600/20 text-gray-300" },
    { type: "green", label: "🟢 Зеро (x36)", color: "border-green-500/40 hover:bg-green-600/20 text-green-400" },
    { type: "odd", label: "Нечётное", color: "border-purple-500/40 hover:bg-purple-600/20 text-purple-400" },
    { type: "even", label: "Чётное", color: "border-blue-500/40 hover:bg-blue-600/20 text-blue-400" },
    { type: "1-18", label: "1-18", color: "border-yellow-500/40 hover:bg-yellow-600/20 text-yellow-400" },
    { type: "19-36", label: "19-36", color: "border-orange-500/40 hover:bg-orange-600/20 text-orange-400" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate("games")} className="flex items-center gap-2 text-gray-500 hover:text-purple-400 text-sm font-exo mb-6 transition-colors">
        <Icon name="ArrowLeft" size={16} /> Назад к играм
      </button>

      <div className="text-center mb-6">
        <h1 className="font-orbitron text-3xl font-black text-white mb-2">🎡 <span className="neon-text-blue">Рулетка</span></h1>
        <p className="text-gray-500 font-exo text-sm">Выбери ставку и испытай удачу!</p>
      </div>

      <div className="card-game p-8 neon-border-blue border mb-6">
        {/* Wheel Display */}
        <div className="text-center mb-6">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center border-4 ${spinning ? "animate-spin-slow border-purple-500" : "border-purple-500/30"} transition-all`}
            style={{ background: result ? undefined : "linear-gradient(135deg, rgba(88,28,235,0.2), rgba(0,212,255,0.1))" }}>
            {spinning ? (
              <span className="text-4xl">🎡</span>
            ) : result ? (
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full ${colorMap[result.color]} flex items-center justify-center mx-auto`}>
                  <span className="font-orbitron text-2xl font-black text-white">{result.number}</span>
                </div>
              </div>
            ) : (
              <span className="text-4xl">🎡</span>
            )}
          </div>
        </div>

        {result && (
          <div className={`text-center py-3 mb-4 rounded-xl animate-scale-in ${result.win > 0 ? "bg-green-600/10 border border-green-500/30" : "bg-red-600/10 border border-red-500/20"}`}>
            <p className={`font-exo font-bold text-sm ${result.win > 0 ? "neon-text-green" : "text-red-400"}`}>{result.text}</p>
            <p className="text-gray-400 text-xs font-exo">Выпало: {result.number} ({result.color === "red" ? "красное" : result.color === "black" ? "чёрное" : "зеро"})</p>
            {result.win > 0 && <p className="font-orbitron text-lg neon-text-gold font-bold">+{result.win.toLocaleString()} D-COIN</p>}
          </div>
        )}

        {/* Bet Type */}
        <div className="mb-5">
          <p className="text-xs text-gray-500 font-exo text-center mb-3">Тип ставки</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {betButtons.map((b) => (
              <button key={b.type} onClick={() => setBetType(b.type)}
                className={`px-3 py-2 rounded-xl text-xs font-exo font-bold transition-all border ${betType === b.type ? "btn-primary border-transparent" : `glass ${b.color}`}`}>
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bet Amount */}
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
          className={`w-full py-4 rounded-2xl font-bold font-exo text-lg transition-all flex items-center justify-center gap-2 ${spinning ? "bg-gray-700/30 text-gray-500 cursor-wait" : user.balance < bet ? "bg-gray-800/50 text-gray-600 cursor-not-allowed" : "btn-secondary"}`}>
          {spinning ? "Колесо крутится..." : user.balance < bet ? "Мало D-COIN" : "🎡 КРУТИТЬ РУЛЕТКУ"}
        </button>
      </div>
    </div>
  );
}
