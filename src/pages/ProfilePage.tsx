import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  navigate: (p: Page) => void;
}

const achievements = [
  { id: "first_win", emoji: "🏆", name: "Первая победа", desc: "Выиграй первую игру", unlocked: true },
  { id: "lucky_streak", emoji: "🔥", name: "Горячая серия", desc: "3 победы подряд", unlocked: true },
  { id: "high_roller", emoji: "💎", name: "Хай-роллер", desc: "Поставь 5000+ D-COIN", unlocked: true },
  { id: "daily_bonus", emoji: "📅", name: "Постоянный", desc: "7 дней подряд", unlocked: true },
  { id: "jackpot", emoji: "💰", name: "Джекпот", desc: "Сорви джекпот в слотах", unlocked: false },
  { id: "master", emoji: "🧙", name: "Мастер", desc: "Сыграй 500 игр", unlocked: false },
  { id: "millionaire", emoji: "🤑", name: "Миллионер", desc: "Накопи 1,000,000 D-COIN", unlocked: false },
  { id: "night_owl", emoji: "🦉", name: "Ночная сова", desc: "Играй после полуночи", unlocked: false },
];

const gameStats = [
  { game: "Слоты 🎰", played: 67, won: 32, winRate: 48, bestWin: 4500 },
  { game: "Рулетка 🎡", played: 28, won: 14, winRate: 50, bestWin: 8000 },
  { game: "Блэкджек 🃏", played: 22, won: 13, winRate: 59, bestWin: 3200 },
  { game: "Краш 🚀", played: 15, won: 9, winRate: 60, bestWin: 12000 },
  { game: "Кости 🎲", played: 10, won: 6, winRate: 60, bestWin: 2100 },
];

const subColors: Record<string, string> = {
  free: "text-gray-400",
  vip: "neon-text-gold",
  premium: "neon-text-purple",
  elite: "neon-text-blue",
};

const subBg: Record<string, string> = {
  free: "border-gray-600/30",
  vip: "neon-border-gold border",
  premium: "neon-border-purple border",
  elite: "neon-border-blue border",
};

export default function ProfilePage({ user, navigate }: Props) {
  const xpPercent = Math.round((user.xp / user.xpMax) * 100);
  const winRate = Math.round((user.totalWon / Math.max(user.totalGames, 1) / 100));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Profile Header */}
      <div className="card-game p-8 mb-6 relative overflow-hidden neon-border-purple border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-purple-600/5 blur-3xl" />
        </div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-5xl shadow-2xl"
              style={{ boxShadow: "0 0 30px rgba(168,85,247,0.4)" }}>
              {user.avatar}
            </div>
            <div className={`absolute -bottom-2 -right-2 text-xs font-bold font-orbitron px-2 py-0.5 rounded-full ${subBg[user.subscription]} bg-background`}>
              <span className={subColors[user.subscription]}>{user.subscription.toUpperCase()}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-orbitron text-2xl font-bold text-white">{user.name}</h1>
              <div className="glass border border-purple-500/30 rounded-full px-3 py-0.5 text-xs font-orbitron text-purple-300">
                LVL {user.level}
              </div>
              {user.winStreak > 0 && (
                <div className="glass border border-orange-500/30 rounded-full px-3 py-0.5 text-xs font-exo text-orange-400 flex items-center gap-1">
                  🔥 Серия: {user.winStreak}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 font-exo mb-4">
              Игрок с {new Date(user.joinDate).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            {/* XP Bar */}
            <div className="mb-1 flex justify-between text-xs font-exo text-gray-400">
              <span>Опыт: {user.xp.toLocaleString()} XP</span>
              <span>До уровня {user.level + 1}: {(user.xpMax - user.xp).toLocaleString()} XP</span>
            </div>
            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-purple-900/30">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${xpPercent}%`,
                  background: "linear-gradient(90deg, #7c3aed, #00d4ff)",
                  boxShadow: "0 0 10px rgba(168,85,247,0.5)"
                }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1 font-exo">{xpPercent}% до следующего уровня</p>
          </div>

          {/* Balance */}
          <div className="text-right">
            <p className="text-xs text-gray-500 font-exo">Баланс</p>
            <p className="font-orbitron text-3xl font-bold neon-text-gold">{user.balance.toLocaleString()}</p>
            <p className="text-sm text-yellow-600 font-semibold">D-COIN</p>
            <button
              onClick={() => navigate("shop")}
              className="mt-3 btn-gold px-4 py-2 rounded-lg text-xs font-bold font-exo"
            >
              В магазин →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Всего выиграно", value: user.totalWon.toLocaleString(), unit: "D-COIN", icon: "TrendingUp", color: "neon-text-green" },
          { label: "Игр сыграно", value: user.totalGames, unit: "игр", icon: "Gamepad2", color: "neon-text-blue" },
          { label: "Лучшая серия", value: user.winStreak, unit: "побед", icon: "Flame", color: "text-orange-400" },
          { label: "Достижений", value: user.achievements.length, unit: "из 8", icon: "Award", color: "neon-text-purple" },
        ].map((s) => (
          <div key={s.label} className="card-game p-5 text-center">
            <Icon name={s.icon as "TrendingUp"} size={22} className={`${s.color} mx-auto mb-2`} />
            <div className={`font-orbitron text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-600 font-exo">{s.unit}</div>
            <div className="text-xs text-gray-500 mt-1 font-exo">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Game Stats */}
        <div className="card-game p-6">
          <h2 className="font-orbitron text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="neon-text-blue">📊</span> Статистика по играм
          </h2>
          <div className="space-y-3">
            {gameStats.map((g) => (
              <div key={g.game} className="glass rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-exo text-sm text-white font-semibold">{g.game}</span>
                  <span className="text-xs font-orbitron text-neon-gold">{g.bestWin.toLocaleString()} max</span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500 font-exo mb-2">
                  <span>Игр: <span className="text-gray-300">{g.played}</span></span>
                  <span>Побед: <span className="text-neon-green">{g.won}</span></span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${g.winRate}%`,
                      background: g.winRate > 55 ? "linear-gradient(90deg, #00ff88, #00d4ff)" : "linear-gradient(90deg, #7c3aed, #a855f7)"
                    }}
                  />
                </div>
                <p className="text-right text-xs text-gray-600 mt-1">{g.winRate}% побед</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="card-game p-6">
          <h2 className="font-orbitron text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="neon-text-purple">🏆</span> Достижения
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`glass rounded-xl p-3 transition-all ${
                  a.unlocked
                    ? "border border-purple-500/30"
                    : "opacity-40 border border-gray-800/50"
                }`}
              >
                <div className="text-2xl mb-1">{a.unlocked ? a.emoji : "🔒"}</div>
                <div className={`text-xs font-bold font-exo ${a.unlocked ? "text-white" : "text-gray-600"}`}>
                  {a.name}
                </div>
                <div className="text-xs text-gray-600 font-exo mt-0.5">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="card-game p-6 mt-6">
        <h2 className="font-orbitron text-lg font-bold text-white mb-4">👑 Подписка</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {["free", "vip", "premium", "elite"].map((sub) => (
            <div
              key={sub}
              className={`glass rounded-xl p-4 text-center transition-all cursor-pointer ${
                user.subscription === sub
                  ? `${subBg[sub]} ring-2 ring-offset-1 ring-offset-background ${
                    sub === "vip" ? "ring-yellow-500" :
                    sub === "premium" ? "ring-purple-500" :
                    sub === "elite" ? "ring-blue-400" : "ring-gray-500"
                  }`
                  : "border border-gray-800/40 hover:border-gray-600/40"
              }`}
            >
              <div className="text-2xl mb-1">
                {sub === "free" ? "🆓" : sub === "vip" ? "⭐" : sub === "premium" ? "💎" : "🚀"}
              </div>
              <div className={`font-orbitron text-sm font-bold ${subColors[sub]}`}>
                {sub.toUpperCase()}
              </div>
              {user.subscription === sub && (
                <div className="text-xs text-neon-green mt-1 font-exo">✓ Активна</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
