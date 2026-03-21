import { useState, useEffect, useRef } from "react";
import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  updateBalance: (delta: number) => void;
  navigate: (p: Page) => void;
}

const betOptions = [50, 100, 200, 500, 1000];

export default function CrashGame({ user, updateBalance, navigate }: Props) {
  const [bet, setBet] = useState(100);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameState, setGameState] = useState<"idle" | "flying" | "crashed" | "cashed">("idle");
  const [crashPoint, setCrashPoint] = useState(0);
  const [resultText, setResultText] = useState("");
  const [winAmount, setWinAmount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [history, setHistory] = useState<{ mult: number; crashed: boolean }[]>([
    { mult: 2.34, crashed: true },
    { mult: 1.12, crashed: true },
    { mult: 5.67, crashed: true },
    { mult: 1.45, crashed: true },
    { mult: 3.21, crashed: true },
  ]);

  const startGame = () => {
    if (user.balance < bet) return;
    updateBalance(-bet);
    setGameState("flying");
    setMultiplier(1.0);
    setResultText("");
    setWinAmount(0);

    const crash = 1 + Math.random() * Math.random() * 15;
    setCrashPoint(crash);

    intervalRef.current = setInterval(() => {
      setMultiplier((prev) => {
        const next = parseFloat((prev + 0.02).toFixed(2));
        if (next >= crash) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setGameState("crashed");
          setResultText(`Крушение на x${crash.toFixed(2)}! 💥`);
          setHistory((h) => [{ mult: parseFloat(crash.toFixed(2)), crashed: true }, ...h.slice(0, 9)]);
          return crash;
        }
        return next;
      });
    }, 50);
  };

  const cashOut = () => {
    if (gameState !== "flying") return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    const win = Math.floor(bet * multiplier);
    updateBalance(win);
    setWinAmount(win);
    setGameState("cashed");
    setResultText(`Забрал на x${multiplier.toFixed(2)}!`);
    setHistory((h) => [{ mult: parseFloat(multiplier.toFixed(2)), crashed: false }, ...h.slice(0, 9)]);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getMultColor = () => {
    if (multiplier < 1.5) return "text-white";
    if (multiplier < 3) return "neon-text-green";
    if (multiplier < 5) return "neon-text-blue";
    return "neon-text-gold";
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate("games")} className="flex items-center gap-2 text-gray-500 hover:text-purple-400 text-sm font-exo mb-6 transition-colors">
        <Icon name="ArrowLeft" size={16} /> Назад к играм
      </button>

      <div className="text-center mb-6">
        <h1 className="font-orbitron text-3xl font-black text-white mb-2">🚀 <span className="neon-text-green">Краш</span></h1>
        <p className="text-gray-500 font-exo text-sm">Ракета летит вверх — забери выигрыш до крушения!</p>
      </div>

      <div className="card-game p-8 border border-green-500/20 mb-6">
        {/* Rocket Display */}
        <div className="relative h-48 rounded-2xl glass border border-purple-900/20 mb-6 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            {gameState === "flying" && (
              <>
                <div className="absolute bottom-0 left-1/4 w-1 h-full bg-gradient-to-t from-green-500/20 to-transparent" />
                <div className="absolute bottom-0 left-1/2 w-1 h-full bg-gradient-to-t from-blue-500/10 to-transparent" />
                <div className="absolute bottom-0 left-3/4 w-1 h-full bg-gradient-to-t from-purple-500/10 to-transparent" />
              </>
            )}
            {gameState === "crashed" && (
              <div className="absolute inset-0 bg-red-600/10" />
            )}
          </div>

          <div className="relative text-center">
            <div className={`text-6xl mb-2 transition-transform ${
              gameState === "flying" ? "animate-float" :
              gameState === "crashed" ? "rotate-180 opacity-50" : ""
            }`}>
              {gameState === "crashed" ? "💥" : "🚀"}
            </div>
            <div className={`font-orbitron text-4xl font-black ${
              gameState === "crashed" ? "text-red-400" :
              gameState === "cashed" ? "neon-text-gold" :
              getMultColor()
            }`}>
              x{multiplier.toFixed(2)}
            </div>
          </div>
        </div>

        {resultText && (
          <div className={`text-center py-3 mb-4 rounded-xl animate-scale-in ${
            gameState === "cashed" ? "bg-green-600/10 border border-green-500/30" : "bg-red-600/10 border border-red-500/20"
          }`}>
            <p className={`font-exo font-bold text-sm ${gameState === "cashed" ? "neon-text-green" : "text-red-400"}`}>{resultText}</p>
            {winAmount > 0 && <p className="font-orbitron text-lg neon-text-gold font-bold">+{winAmount.toLocaleString()} D-COIN</p>}
          </div>
        )}

        {gameState === "flying" ? (
          <button onClick={cashOut}
            className="w-full btn-gold py-4 rounded-2xl font-bold font-exo text-lg animate-pulse-glow">
            💰 ЗАБРАТЬ x{multiplier.toFixed(2)} ({Math.floor(bet * multiplier).toLocaleString()} D-COIN)
          </button>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-xs text-gray-500 font-exo text-center mb-2">Ставка</p>
              <div className="flex justify-center gap-2 flex-wrap">
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
              🚀 ЗАПУСТИТЬ РАКЕТУ
            </button>
          </>
        )}

        {/* History */}
        <div className="mt-5 glass rounded-xl p-3">
          <p className="text-xs text-gray-500 font-exo text-center mb-2">Последние раунды</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {history.map((h, i) => (
              <span key={i} className={`font-orbitron text-xs font-bold px-2 py-1 rounded-lg ${
                h.crashed
                  ? (h.mult > 3 ? "bg-green-600/10 text-green-400" : "bg-red-600/10 text-red-400")
                  : "bg-neon-gold/10 text-neon-gold"
              }`}>
                x{h.mult.toFixed(2)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
