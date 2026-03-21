import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  navigate: (p: Page) => void;
  isLoggedIn: boolean;
  user: User;
}

const featuredGames = [
  { id: "game-slots", name: "Слоты", emoji: "🎰", desc: "Крути барабаны!", color: "from-purple-600 to-pink-500", badge: "HOT" },
  { id: "game-roulette", name: "Рулетка", emoji: "🎡", desc: "Удача на колесе", color: "from-blue-600 to-cyan-400", badge: "NEW" },
  { id: "game-blackjack", name: "Блэкджек", emoji: "🃏", desc: "21 или ничего", color: "from-green-600 to-emerald-400", badge: "" },
  { id: "game-crash", name: "Краш", emoji: "🚀", desc: "Не упусти ракету", color: "from-orange-500 to-red-500", badge: "HOT" },
  { id: "game-number", name: "Угадай число", emoji: "🔮", desc: "Читаешь мысли?", color: "from-violet-600 to-purple-400", badge: "" },
  { id: "game-dice", name: "Кости", emoji: "🎲", desc: "Бросай и побеждай", color: "from-teal-600 to-cyan-400", badge: "" },
  { id: "game-loto", name: "Лотерея", emoji: "🎟️", desc: "Выиграй 10000 D!", color: "from-yellow-500 to-orange-500", badge: "NEW" },
];

const stats = [
  { label: "Игроков онлайн", value: "12,847", icon: "Users", color: "text-neon-blue" },
  { label: "D-COIN выиграно сегодня", value: "2.4M", icon: "Zap", color: "text-neon-gold" },
  { label: "Игр сыграно", value: "1.2M", icon: "Gamepad2", color: "text-neon-purple" },
  { label: "Джекпот сейчас", value: "500K", icon: "Trophy", color: "text-neon-green" },
];

export default function HomePage({ navigate, isLoggedIn, user }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden mb-12 p-8 md:p-14 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(88,28,235,0.25) 0%, rgba(0,212,255,0.1) 50%, rgba(168,85,247,0.2) 100%)",
          border: "1px solid rgba(168,85,247,0.3)",
        }}>
        {/* bg effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-800/5 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 border border-purple-500/30">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs font-exo text-green-400 font-semibold">12,847 игроков онлайн</span>
          </div>

          <h1 className="font-orbitron text-4xl md:text-6xl font-black mb-4">
            <span className="neon-text-purple">D</span>
            <span className="neon-text-blue">COIN</span>
            <br />
            <span className="text-white text-2xl md:text-3xl font-bold">CASINO</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto font-exo">
            Футуристичное казино на виртуальной валюте. Играй бесплатно, побеждай, получай достижения!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("games")}
                  className="btn-primary px-8 py-4 rounded-xl text-lg font-bold font-exo flex items-center gap-2 justify-center"
                >
                  <Icon name="Gamepad2" size={20} />
                  Играть сейчас
                </button>
                <button
                  onClick={() => navigate("bonus")}
                  className="btn-gold px-8 py-4 rounded-xl text-lg font-bold font-exo flex items-center gap-2 justify-center"
                >
                  <Icon name="Gift" size={20} />
                  Забрать бонус
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("auth")}
                  className="btn-primary px-8 py-4 rounded-xl text-lg font-bold font-exo flex items-center gap-2 justify-center"
                >
                  <Icon name="Rocket" size={20} />
                  Начать играть
                </button>
                <button
                  onClick={() => navigate("info")}
                  className="glass border border-purple-500/30 text-purple-300 hover:text-white px-8 py-4 rounded-xl text-lg font-bold font-exo flex items-center gap-2 justify-center transition-all hover:border-purple-400/60"
                >
                  <Icon name="Info" size={20} />
                  Узнать больше
                </button>
              </>
            )}
          </div>

          {isLoggedIn && (
            <div className="mt-6 inline-flex items-center gap-3 glass rounded-xl px-5 py-3 border border-yellow-500/20">
              <span className="text-2xl">{user.avatar}</span>
              <div className="text-left">
                <p className="text-xs text-gray-400">Ваш баланс</p>
                <p className="font-orbitron text-neon-gold font-bold">{user.balance.toLocaleString()} D-COIN</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Live Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="card-game p-5 text-center">
            <Icon name={s.icon as "Users"} size={24} className={`${s.color} mx-auto mb-2`} />
            <div className={`font-orbitron text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1 font-exo">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Featured Games */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-orbitron text-2xl font-bold text-white">
            🎮 <span className="neon-text-purple">Популярные</span> игры
          </h2>
          <button
            onClick={() => navigate("games")}
            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            Все игры <Icon name="ChevronRight" size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {featuredGames.map((game) => (
            <button
              key={game.id}
              onClick={() => navigate(game.id as Page)}
              className="card-game p-6 text-left group relative overflow-hidden"
            >
              {game.badge && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full font-orbitron">
                  {game.badge}
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {game.emoji}
              </div>
              <h3 className="font-orbitron text-base font-bold text-white mb-1">{game.name}</h3>
              <p className="text-xs text-gray-500 font-exo">{game.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Subscriptions Preview */}
      <section className="mb-12">
        <h2 className="font-orbitron text-2xl font-bold text-white mb-6">
          👑 <span className="neon-text-gold">Подписки</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "FREE", color: "border-gray-600/30", glow: "", emoji: "🆓", perks: ["1000 D-COIN старт", "Базовые игры", "Ежедневные бонусы"] },
            { name: "VIP", color: "border-yellow-500/40", glow: "neon-border-gold", emoji: "⭐", perks: ["5000 D-COIN старт", "VIP бонусы x2", "Уникальные аватары"] },
            { name: "PREMIUM", color: "border-purple-500/40", glow: "neon-border-purple", emoji: "💎", perks: ["15000 D-COIN старт", "Все игры", "Эксклюзивные турниры"] },
            { name: "ELITE", color: "border-blue-400/40", glow: "neon-border-blue", emoji: "🚀", perks: ["50000 D-COIN старт", "Приоритет поддержки", "Все преимущества"] },
          ].map((sub) => (
            <div key={sub.name} className={`card-game p-5 border ${sub.color} ${sub.glow}`}>
              <div className="text-3xl mb-2">{sub.emoji}</div>
              <div className={`font-orbitron text-lg font-bold mb-3 ${
                sub.name === "VIP" ? "neon-text-gold" :
                sub.name === "PREMIUM" ? "neon-text-purple" :
                sub.name === "ELITE" ? "neon-text-blue" : "text-gray-400"
              }`}>{sub.name}</div>
              <ul className="space-y-1.5">
                {sub.perks.map((p) => (
                  <li key={p} className="text-xs text-gray-400 flex items-start gap-1.5">
                    <span className="text-neon-green mt-0.5">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isLoggedIn && (
        <section className="text-center py-10 rounded-3xl glass border border-purple-500/20">
          <div className="text-5xl mb-4">🎰</div>
          <h2 className="font-orbitron text-2xl font-bold text-white mb-3">
            Готов к победе?
          </h2>
          <p className="text-gray-400 mb-6 font-exo">Зарегистрируйся и получи 1000 D-COIN бесплатно!</p>
          <button
            onClick={() => navigate("auth")}
            className="btn-primary px-10 py-4 rounded-xl text-lg font-bold font-exo"
          >
            Получить 1000 D-COIN 🎁
          </button>
        </section>
      )}
    </div>
  );
}