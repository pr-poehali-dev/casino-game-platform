import { useState } from "react";
import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  updateBalance: (delta: number) => void;
  navigate: (p: Page) => void;
}

interface Card {
  suit: string;
  value: string;
  points: number;
}

const suits = ["♠️", "♥️", "♦️", "♣️"];
const values = [
  { v: "A", p: 11 }, { v: "2", p: 2 }, { v: "3", p: 3 }, { v: "4", p: 4 },
  { v: "5", p: 5 }, { v: "6", p: 6 }, { v: "7", p: 7 }, { v: "8", p: 8 },
  { v: "9", p: 9 }, { v: "10", p: 10 }, { v: "J", p: 10 }, { v: "Q", p: 10 }, { v: "K", p: 10 },
];

function randomCard(): Card {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const val = values[Math.floor(Math.random() * values.length)];
  return { suit, value: val.v, points: val.p };
}

function calcHand(cards: Card[]): number {
  let total = cards.reduce((s, c) => s + c.points, 0);
  let aces = cards.filter(c => c.value === "A").length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

const betOptions = [100, 200, 500, 1000];

export default function BlackjackGame({ user, updateBalance, navigate }: Props) {
  const [bet, setBet] = useState(200);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<"idle" | "playing" | "done">("idle");
  const [resultText, setResultText] = useState("");
  const [winAmount, setWinAmount] = useState(0);

  const deal = () => {
    if (user.balance < bet) return;
    updateBalance(-bet);
    const p = [randomCard(), randomCard()];
    const d = [randomCard(), randomCard()];
    setPlayerHand(p);
    setDealerHand(d);
    setGameState("playing");
    setResultText("");
    setWinAmount(0);

    if (calcHand(p) === 21) {
      const win = Math.floor(bet * 2.5);
      updateBalance(win);
      setWinAmount(win);
      setResultText("БЛЭКДЖЕК! 🎉");
      setGameState("done");
    }
  };

  const hit = () => {
    const newHand = [...playerHand, randomCard()];
    setPlayerHand(newHand);
    if (calcHand(newHand) > 21) {
      setResultText("Перебор! Ты проиграл 😢");
      setWinAmount(0);
      setGameState("done");
    }
  };

  const stand = () => {
    let dHand = [...dealerHand];
    while (calcHand(dHand) < 17) {
      dHand = [...dHand, randomCard()];
    }
    setDealerHand(dHand);

    const playerTotal = calcHand(playerHand);
    const dealerTotal = calcHand(dHand);

    if (dealerTotal > 21) {
      const win = bet * 2;
      updateBalance(win);
      setWinAmount(win);
      setResultText("Дилер перебрал! Ты выиграл! 🎉");
    } else if (playerTotal > dealerTotal) {
      const win = bet * 2;
      updateBalance(win);
      setWinAmount(win);
      setResultText("Ты выиграл! 🎉");
    } else if (playerTotal === dealerTotal) {
      updateBalance(bet);
      setWinAmount(bet);
      setResultText("Ничья! Ставка возвращена.");
    } else {
      setResultText("Дилер выиграл 😢");
      setWinAmount(0);
    }
    setGameState("done");
  };

  const renderCard = (card: Card) => (
    <div className="glass border border-purple-500/20 rounded-xl w-16 h-24 flex flex-col items-center justify-center text-center">
      <span className="text-lg">{card.suit}</span>
      <span className="font-orbitron text-sm font-bold text-white">{card.value}</span>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate("games")} className="flex items-center gap-2 text-gray-500 hover:text-purple-400 text-sm font-exo mb-6 transition-colors">
        <Icon name="ArrowLeft" size={16} /> Назад к играм
      </button>

      <div className="text-center mb-6">
        <h1 className="font-orbitron text-3xl font-black text-white mb-2">🃏 <span className="neon-text-green">Блэкджек</span></h1>
        <p className="text-gray-500 font-exo text-sm">Набери 21 и обыграй дилера!</p>
      </div>

      <div className="card-game p-8 border border-green-500/20 mb-6">
        {gameState !== "idle" && (
          <>
            {/* Dealer */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-exo font-bold">Дилер</p>
                <p className="font-orbitron text-xs text-gray-400">
                  {gameState === "done" ? calcHand(dealerHand) : "?"}
                </p>
              </div>
              <div className="flex gap-2">
                {dealerHand.map((c, i) => (
                  <div key={i}>
                    {gameState === "playing" && i === 1 ? (
                      <div className="glass border border-purple-500/20 rounded-xl w-16 h-24 flex items-center justify-center">
                        <span className="text-2xl">❓</span>
                      </div>
                    ) : renderCard(c)}
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-purple-900/30 my-4" />

            {/* Player */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-exo font-bold">Вы</p>
                <p className={`font-orbitron text-sm font-bold ${calcHand(playerHand) > 21 ? "text-red-400" : calcHand(playerHand) === 21 ? "neon-text-green" : "text-white"}`}>
                  {calcHand(playerHand)}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {playerHand.map((c, i) => (
                  <div key={i} className="animate-scale-in">{renderCard(c)}</div>
                ))}
              </div>
            </div>
          </>
        )}

        {resultText && (
          <div className={`text-center py-3 mb-4 rounded-xl animate-scale-in ${winAmount > 0 ? "bg-green-600/10 border border-green-500/30" : "bg-red-600/10 border border-red-500/20"}`}>
            <p className={`font-exo font-bold ${winAmount > 0 ? "neon-text-green" : "text-red-400"}`}>{resultText}</p>
            {winAmount > 0 && <p className="font-orbitron text-lg neon-text-gold font-bold">+{winAmount.toLocaleString()} D-COIN</p>}
          </div>
        )}

        {gameState === "playing" && (
          <div className="flex gap-3 mb-4">
            <button onClick={hit} className="flex-1 btn-primary py-3 rounded-xl font-bold font-exo">Ещё карту</button>
            <button onClick={stand} className="flex-1 btn-secondary py-3 rounded-xl font-bold font-exo">Хватит</button>
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

            <button onClick={deal} disabled={user.balance < bet}
              className={`w-full py-4 rounded-2xl font-bold font-exo text-lg ${user.balance < bet ? "bg-gray-800/50 text-gray-600 cursor-not-allowed" : "btn-primary"}`}>
              {gameState === "done" ? "🃏 ИГРАТЬ СНОВА" : "🃏 РАЗДАТЬ КАРТЫ"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
