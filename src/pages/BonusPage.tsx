import { useState } from "react";
import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  updateBalance: (delta: number) => void;
  navigate: (p: Page) => void;
}

const dailyTasks = [
  { id: "t1", label: "Сыграй 3 игры", emoji: "🎮", reward: 200, progress: 2, total: 3, done: false },
  { id: "t2", label: "Выиграй в рулетке", emoji: "🎡", reward: 500, progress: 0, total: 1, done: false },
  { id: "t3", label: "Поставь 1000 D-COIN суммарно", emoji: "💰", reward: 300, progress: 1000, total: 1000, done: true },
  { id: "t4", label: "Войди в систему", emoji: "✅", reward: 100, progress: 1, total: 1, done: true },
  { id: "t5", label: "Посети магазин", emoji: "🛍️", reward: 150, progress: 0, total: 1, done: false },
];

const weeklyBonuses = [
  { day: "Пн", emoji: "🎁", reward: 100, claimed: true },
  { day: "Вт", emoji: "⚡", reward: 200, claimed: true },
  { day: "Ср", emoji: "💎", reward: 300, claimed: true },
  { day: "Чт", emoji: "🔥", reward: 400, claimed: false, current: true },
  { day: "Пт", emoji: "🌟", reward: 500, claimed: false },
  { day: "Сб", emoji: "👑", reward: 750, claimed: false },
  { day: "Вс", emoji: "🚀", reward: 1000, claimed: false },
];

const promos = [
  { code: "DCOIN100", reward: 100, desc: "100 монет за промокод", used: false },
  { code: "LUCKY500", reward: 500, desc: "500 монет для новичков", used: false },
];

export default function BonusPage({ user, updateBalance, navigate: _navigate }: Props) {
  const [tasks, setTasks] = useState(dailyTasks);
  const [days, setDays] = useState(weeklyBonuses);
  const [promoCode, setPromoCode] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [dailyClaimed, setDailyClaimed] = useState(false);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const claimDaily = () => {
    if (dailyClaimed) return;
    updateBalance(250);
    setDailyClaimed(true);
    showNotif("🎁 Ежедневный бонус получен: +250 D-COIN!");
  };

  const claimTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !task.done) return;
    updateBalance(task.reward);
    setTasks(prev => prev.filter(t => t.id !== id));
    showNotif(`✅ Задание выполнено! +${task.reward} D-COIN`);
  };

  const claimDay = (day: typeof weeklyBonuses[0]) => {
    if (day.claimed || !day.current) return;
    updateBalance(day.reward);
    setDays(prev => prev.map(d => d.day === day.day ? { ...d, claimed: true, current: false } : d));
    showNotif(`🎊 День получен! +${day.reward} D-COIN`);
  };

  const applyPromo = () => {
    const promo = promos.find(p => p.code === promoCode.toUpperCase());
    if (promo && !promo.used) {
      updateBalance(promo.reward);
      showNotif(`🎉 Промокод активирован! +${promo.reward} D-COIN`);
      setPromoCode("");
    } else {
      showNotif("❌ Промокод не найден или уже использован");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass border border-purple-500/50 rounded-2xl px-6 py-3 font-exo font-semibold text-white animate-scale-in shadow-2xl">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-orbitron text-4xl font-black text-white mb-3">
          🎁 <span className="neon-text-purple">Бонусы</span> & <span className="neon-text-blue">Задания</span>
        </h1>
        <p className="text-gray-400 font-exo">Зарабатывай D-COIN каждый день!</p>
      </div>

      {/* Daily Bonus */}
      <div className="relative overflow-hidden rounded-3xl p-7 mb-6 text-center"
        style={{ background: "linear-gradient(135deg, rgba(88,28,235,0.3), rgba(0,212,255,0.15))", border: "1px solid rgba(168,85,247,0.4)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-purple-600/10 blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl" />
        </div>
        <div className="relative">
          <div className="text-5xl mb-3 animate-float">🎁</div>
          <h2 className="font-orbitron text-2xl font-bold text-white mb-2">Ежедневный бонус</h2>
          <p className="text-gray-400 font-exo mb-1">Баланс: <span className="neon-text-gold font-bold">{user.balance.toLocaleString()} D-COIN</span></p>
          <p className="text-gray-500 font-exo text-sm mb-5">+250 D-COIN каждый день</p>
          <button
            onClick={claimDaily}
            disabled={dailyClaimed}
            className={`px-10 py-4 rounded-2xl font-bold font-exo text-lg transition-all ${
              dailyClaimed
                ? "bg-green-600/20 border border-green-500/30 text-green-400 cursor-default"
                : "btn-gold"
            }`}
          >
            {dailyClaimed ? "✓ Получено сегодня" : "Забрать 250 D-COIN"}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">

        {/* Weekly streak */}
        <div className="card-game p-6">
          <h2 className="font-orbitron text-lg font-bold text-white mb-4">📅 Недельная серия</h2>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d) => (
              <button
                key={d.day}
                onClick={() => claimDay(d)}
                className={`flex flex-col items-center py-3 rounded-xl text-xs font-exo transition-all ${
                  d.claimed
                    ? "bg-green-600/20 border border-green-500/30 text-green-400"
                    : d.current
                    ? "btn-gold animate-pulse-glow cursor-pointer"
                    : "glass border border-gray-800/40 text-gray-600 cursor-default"
                }`}
              >
                <span className="text-lg mb-1">{d.emoji}</span>
                <span className="font-semibold">{d.day}</span>
                <span className="text-xs mt-0.5 font-orbitron">{d.reward}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 font-exo mt-3 text-center">
            Нажми на сегодняшний день (четверг) чтобы получить бонус
          </p>
        </div>

        {/* Promo code */}
        <div className="card-game p-6">
          <h2 className="font-orbitron text-lg font-bold text-white mb-4">🔑 Промокоды</h2>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Введи промокод..."
              className="flex-1 bg-black/30 border border-purple-800/40 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none font-exo text-sm"
            />
            <button
              onClick={applyPromo}
              className="btn-primary px-5 py-3 rounded-xl font-bold font-exo text-sm"
            >
              <Icon name="Check" size={18} />
            </button>
          </div>

          <div className="glass rounded-xl p-4 border border-purple-900/30">
            <p className="text-xs text-gray-500 font-exo mb-3 text-center">Доступные промокоды</p>
            <div className="space-y-2">
              {promos.map((p) => (
                <div key={p.code} className="flex justify-between items-center">
                  <code className="font-orbitron text-xs text-purple-300 bg-purple-900/20 px-2 py-1 rounded">{p.code}</code>
                  <span className="text-xs text-neon-gold font-exo font-bold">+{p.reward} D</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="card-game p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-orbitron text-lg font-bold text-white">⚡ Ежедневные задания</h2>
          <div className="text-xs text-gray-500 font-exo">Сброс через 14:23:05</div>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className={`glass rounded-xl p-4 border transition-all ${
              task.done ? "border-green-500/20" : "border-purple-900/20"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{task.emoji}</span>
                  <div>
                    <p className="font-exo text-sm text-white font-semibold">{task.label}</p>
                    <p className="text-xs text-gray-600 font-exo">
                      {task.progress}/{task.total}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-orbitron text-sm neon-text-gold font-bold">+{task.reward} D</span>
                  <button
                    onClick={() => claimTask(task.id)}
                    disabled={!task.done}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-exo transition-all ${
                      task.done
                        ? "btn-secondary"
                        : "glass border border-gray-700/30 text-gray-600 cursor-default"
                    }`}
                  >
                    {task.done ? "Забрать" : "В процессе"}
                  </button>
                </div>
              </div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (task.progress / task.total) * 100)}%`,
                    background: task.done ? "#00ff88" : "linear-gradient(90deg, #7c3aed, #00d4ff)"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
