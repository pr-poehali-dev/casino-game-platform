import { useState, useEffect, useCallback } from "react";
import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";
import { lotoApi } from "@/lib/api";

interface Props {
  user: User;
  updateBalance: (delta: number) => void;
  navigate: (p: Page) => void;
}

interface DrawInfo {
  id: number;
  status: string;
  ticketPrice: number;
  prize1: number;
  prize2: number;
  prize3: number;
  winnersFound: number;
  createdAt: string | null;
  finishedAt: string | null;
}

interface Winner {
  place: number;
  prize: number;
  name: string;
  ticket: string;
}

interface Ticket {
  id: number;
  number: string;
  status: string;
  prizePlace: number | null;
  prizeAmount: number | null;
  createdAt: string | null;
}

interface DrawResultData {
  place: number;
  prize: number;
  ticket: string;
  winnerName: string;
  drawFinished: boolean;
  cancelledTickets?: number;
}

interface HistoryDraw {
  id: number;
  winnersFound: number;
  createdAt: string | null;
  finishedAt: string | null;
  winners: { place: number; prize: number; name: string }[];
}

export default function LotoGame({ user, updateBalance, navigate }: Props) {
  const [draw, setDraw] = useState<DrawInfo | null>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [ticketsCount, setTicketsCount] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [drawResult, setDrawResult] = useState<DrawResultData | null>(null);
  const [history, setHistory] = useState<HistoryDraw[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [animatingDraw, setAnimatingDraw] = useState(false);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchStatus = useCallback(async () => {
    try {
      const data = await lotoApi.status();
      setDraw(data.draw);
      setWinners(data.winners || []);
      setTicketsCount(data.ticketsCount || 0);
      setTotalTickets(data.totalTickets || 0);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const fetchMyTickets = useCallback(async () => {
    try {
      const data = await lotoApi.myTickets();
      setMyTickets(data.tickets || []);
    } catch { /* ignore */ }
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await lotoApi.history();
      setHistory(data.draws || data.results || []);
      setShowHistory(true);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchStatus();
    fetchMyTickets();
  }, [fetchStatus, fetchMyTickets]);

  const buyTickets = async () => {
    if (!draw) return;
    const cost = draw.ticketPrice * quantity;
    if (user.balance < cost) {
      showNotif("Недостаточно D-COIN!");
      return;
    }
    setBuying(true);
    try {
      const data = await lotoApi.buy(quantity);
      if (data.tickets) {
        updateBalance(-cost);
        showNotif(`Куплено ${data.tickets.length} билет(ов)!`);
        fetchStatus();
        fetchMyTickets();
      }
    } catch (err: unknown) {
      showNotif(err instanceof Error ? err.message : "Ошибка покупки");
    }
    setBuying(false);
  };

  const doDraw = async () => {
    setDrawing(true);
    setAnimatingDraw(true);
    setDrawResult(null);

    await new Promise((r) => setTimeout(r, 2000));

    try {
      const data = await lotoApi.draw();
      setAnimatingDraw(false);

      if (data.place) {
        setDrawResult({
          place: data.place,
          prize: data.prize,
          ticket: data.ticket,
          winnerName: data.winnerName,
          drawFinished: data.drawFinished,
          cancelledTickets: data.cancelledTickets,
        });

        const myWin = myTickets.find((t) => t.number === data.ticket);
        if (myWin) {
          updateBalance(data.prize);
          showNotif(`Твой билет ${data.ticket} выиграл ${data.prize.toLocaleString()} D-COIN!`);
        }
      }

      fetchStatus();
      fetchMyTickets();
    } catch (err: unknown) {
      setAnimatingDraw(false);
      showNotif(err instanceof Error ? err.message : "Ошибка розыгрыша");
    }
    setDrawing(false);
  };

  const placeEmoji = (place: number) => {
    if (place === 1) return "🥇";
    if (place === 2) return "🥈";
    return "🥉";
  };

  const placeColor = (place: number) => {
    if (place === 1) return "neon-text-gold";
    if (place === 2) return "text-gray-300";
    return "text-amber-600";
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="text-4xl animate-float mb-4">🎟️</div>
        <p className="text-gray-400 font-exo">Загрузка лотереи...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass border border-purple-500/50 rounded-2xl px-6 py-3 font-exo font-semibold text-white animate-scale-in shadow-2xl">
          {notification}
        </div>
      )}

      <button
        onClick={() => navigate("games")}
        className="flex items-center gap-2 text-gray-500 hover:text-purple-400 text-sm font-exo mb-6 transition-colors"
      >
        <Icon name="ArrowLeft" size={16} /> Назад к играм
      </button>

      <div className="text-center mb-8">
        <h1 className="font-orbitron text-3xl font-black text-white mb-2">
          🎟️ <span className="neon-text-purple">Лотерея</span> <span className="neon-text-gold">D-COIN</span>
        </h1>
        <p className="text-gray-500 font-exo text-sm">
          Покупай билеты · Жди розыгрыш · Выигрывай призы!
        </p>
      </div>

      {!draw ? (
        <div className="card-game p-8 text-center border border-gray-700/30">
          <div className="text-5xl mb-4">🎰</div>
          <p className="text-gray-400 font-exo">Нет активного розыгрыша. Скоро начнётся новый!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { place: 1, prize: draw.prize1, label: "1-е место" },
              { place: 2, prize: draw.prize2, label: "2-е место" },
              { place: 3, prize: draw.prize3, label: "3-е место" },
            ].map((p) => {
              const won = winners.find((w) => w.place === p.place);
              return (
                <div
                  key={p.place}
                  className={`card-game p-4 text-center border ${
                    won ? "border-green-500/30 bg-green-600/5" : "border-purple-500/20"
                  }`}
                >
                  <div className="text-3xl mb-1">{placeEmoji(p.place)}</div>
                  <p className="text-xs text-gray-500 font-exo">{p.label}</p>
                  <p className={`font-orbitron text-lg font-bold ${placeColor(p.place)}`}>
                    {p.prize.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 font-exo">D-COIN</p>
                  {won && (
                    <div className="mt-2 text-xs text-green-400 font-exo font-semibold">
                      {won.name}
                      <div className="text-green-600 text-xs">#{won.ticket}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="glass rounded-xl p-3 text-center border border-purple-900/20">
              <p className="text-xs text-gray-500 font-exo">Билетов в игре</p>
              <p className="font-orbitron text-xl neon-text-blue font-bold">{ticketsCount}</p>
            </div>
            <div className="glass rounded-xl p-3 text-center border border-purple-900/20">
              <p className="text-xs text-gray-500 font-exo">Всего продано</p>
              <p className="font-orbitron text-xl text-purple-300 font-bold">{totalTickets}</p>
            </div>
            <div className="glass rounded-xl p-3 text-center border border-purple-900/20">
              <p className="text-xs text-gray-500 font-exo">Победителей</p>
              <p className="font-orbitron text-xl neon-text-green font-bold">{draw.winnersFound} / 3</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="card-game p-5 border border-purple-500/20">
              <h3 className="font-orbitron text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Icon name="Ticket" size={16} className="text-purple-400" /> Купить билеты
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="glass w-9 h-9 rounded-lg flex items-center justify-center text-white border border-purple-800/30 hover:border-purple-500/50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))
                  }
                  min={1}
                  max={10}
                  className="flex-1 bg-black/30 border border-purple-800/40 rounded-lg px-3 py-2 text-white text-center font-orbitron outline-none text-sm"
                />
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="glass w-9 h-9 rounded-lg flex items-center justify-center text-white border border-purple-800/30 hover:border-purple-500/50"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 font-exo mb-3 text-center">
                Цена: <span className="neon-text-gold font-bold">{(draw.ticketPrice * quantity).toLocaleString()} D-COIN</span>
                <span className="text-gray-600 ml-2">
                  (баланс: {user.balance.toLocaleString()})
                </span>
              </p>
              <button
                onClick={buyTickets}
                disabled={buying || user.balance < draw.ticketPrice * quantity}
                className="w-full btn-gold py-2.5 rounded-xl font-bold font-exo text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buying ? "Покупаем..." : user.balance < draw.ticketPrice * quantity ? "Мало D-COIN" : "Купить"}
              </button>
            </div>

            <div className="card-game p-5 border border-yellow-500/20">
              <h3 className="font-orbitron text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Icon name="Sparkles" size={16} className="text-yellow-400" /> Розыгрыш
              </h3>
              <p className="text-xs text-gray-500 font-exo mb-3">
                Нажми чтобы разыграть {draw.winnersFound + 1}-е место. Выбирается случайный билет из всех активных.
              </p>

              {animatingDraw && (
                <div className="text-center py-3 mb-3">
                  <div className="text-4xl animate-bounce">🎰</div>
                  <p className="text-sm text-purple-300 font-exo animate-pulse mt-2">
                    Выбираем победителя...
                  </p>
                </div>
              )}

              {drawResult && !animatingDraw && (
                <div className="glass rounded-xl p-3 mb-3 border border-green-500/30 animate-scale-in text-center">
                  <div className="text-2xl mb-1">{placeEmoji(drawResult.place)}</div>
                  <p className="text-sm text-white font-exo font-bold">{drawResult.winnerName}</p>
                  <p className={`font-orbitron text-lg font-bold ${placeColor(drawResult.place)}`}>
                    +{drawResult.prize.toLocaleString()} D
                  </p>
                  <p className="text-xs text-gray-600 font-exo">Билет: #{drawResult.ticket}</p>
                  {drawResult.drawFinished && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-xs text-red-400 font-exo font-bold">
                        Розыгрыш завершён! Аннулировано: {drawResult.cancelledTickets} билетов
                      </p>
                      <p className="text-xs text-gray-500 font-exo">Новый тираж уже начался</p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={doDraw}
                disabled={drawing || ticketsCount === 0 || draw.winnersFound >= 3}
                className="w-full btn-primary py-2.5 rounded-xl font-bold font-exo text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {drawing
                  ? "Розыгрыш..."
                  : ticketsCount === 0
                  ? "Нет билетов"
                  : draw.winnersFound >= 3
                  ? "Все призы разыграны"
                  : `Разыграть ${draw.winnersFound + 1}-е место`}
              </button>
            </div>
          </div>

          {winners.length > 0 && (
            <div className="card-game p-5 mb-6 border border-green-500/20">
              <h3 className="font-orbitron text-sm font-bold text-white mb-3">Победители текущего тиража</h3>
              <div className="space-y-2">
                {winners.map((w) => (
                  <div key={w.place} className="flex items-center gap-3 glass rounded-lg p-2.5">
                    <span className="text-xl">{placeEmoji(w.place)}</span>
                    <div className="flex-1">
                      <span className="text-sm text-white font-exo font-semibold">{w.name}</span>
                      <span className="text-xs text-gray-600 ml-2">#{w.ticket}</span>
                    </div>
                    <span className={`font-orbitron text-sm font-bold ${placeColor(w.place)}`}>
                      +{w.prize.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="card-game p-5 border border-purple-900/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-orbitron text-sm font-bold text-white flex items-center gap-2">
                  🎟️ Мои билеты
                </h3>
                <button onClick={fetchMyTickets} className="text-xs text-purple-400 hover:text-purple-300 font-exo">
                  Обновить
                </button>
              </div>
              {myTickets.length === 0 ? (
                <p className="text-sm text-gray-600 font-exo text-center py-4">Нет билетов</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {myTickets.map((t) => (
                    <div
                      key={t.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                        t.status === "won"
                          ? "bg-green-500/10 border border-green-500/20"
                          : t.status === "cancelled"
                          ? "bg-red-500/5 border border-red-500/10 opacity-50"
                          : "glass border border-purple-900/20"
                      }`}
                    >
                      <span className="font-orbitron text-purple-300">{t.number}</span>
                      <span
                        className={`font-exo font-semibold ${
                          t.status === "won"
                            ? "text-green-400"
                            : t.status === "cancelled"
                            ? "text-red-400"
                            : "text-gray-500"
                        }`}
                      >
                        {t.status === "won"
                          ? `${placeEmoji(t.prizePlace || 1)} +${(t.prizeAmount || 0).toLocaleString()}`
                          : t.status === "cancelled"
                          ? "Аннулирован"
                          : "Активный"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card-game p-5 border border-purple-900/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-orbitron text-sm font-bold text-white flex items-center gap-2">
                  📜 История тиражей
                </h3>
                <button onClick={fetchHistory} className="text-xs text-purple-400 hover:text-purple-300 font-exo">
                  {showHistory ? "Обновить" : "Загрузить"}
                </button>
              </div>
              {!showHistory ? (
                <p className="text-sm text-gray-600 font-exo text-center py-4">Нажми "Загрузить"</p>
              ) : history.length === 0 ? (
                <p className="text-sm text-gray-600 font-exo text-center py-4">Нет завершённых тиражей</p>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {history.map((h) => (
                    <div key={h.id} className="glass rounded-lg p-3 border border-purple-900/20">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-orbitron text-purple-300">Тираж #{h.id}</span>
                        <span className="text-gray-600 font-exo">{h.finishedAt}</span>
                      </div>
                      {h.winners.map((w) => (
                        <div key={w.place} className="flex items-center gap-2 text-xs">
                          <span>{placeEmoji(w.place)}</span>
                          <span className="text-gray-300 font-exo flex-1">{w.name}</span>
                          <span className={`font-orbitron font-bold ${placeColor(w.place)}`}>
                            +{w.prize.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="glass border border-purple-900/30 rounded-2xl p-5 text-center">
        <p className="text-gray-500 text-sm font-exo">
          🎟️ Розыгрыш идёт до <span className="text-neon-gold font-bold">3 победителей</span>.
          После этого все оставшиеся билеты <span className="text-red-400 font-bold">аннулируются</span> и начинается новый тираж.
        </p>
      </div>
    </div>
  );
}