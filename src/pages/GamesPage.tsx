import { type Page } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  navigate: (p: Page) => void;
}

const games = [
  {
    id: "game-slots",
    name: "Слоты",
    emoji: "🎰",
    desc: "Классические слоты с 5 барабанами и джекпотом. Крути и выигрывай комбинации символов!",
    color: "from-purple-600 to-pink-500",
    borderColor: "border-purple-500/40",
    badge: "HOT",
    badgeColor: "bg-red-500",
    minBet: 50,
    maxWin: "x100",
    category: "Удача"
  },
  {
    id: "game-roulette",
    name: "Рулетка",
    emoji: "🎡",
    desc: "Европейская рулетка с ставками на числа, цвета и секторы. Классика казино!",
    color: "from-blue-600 to-cyan-400",
    borderColor: "border-blue-500/40",
    badge: "NEW",
    badgeColor: "bg-blue-500",
    minBet: 100,
    maxWin: "x36",
    category: "Удача"
  },
  {
    id: "game-blackjack",
    name: "Блэкджек",
    emoji: "🃏",
    desc: "21 — король карточных игр. Обыграй дилера, не превысив 21 очко!",
    color: "from-green-600 to-emerald-400",
    borderColor: "border-green-500/40",
    badge: "",
    badgeColor: "",
    minBet: 200,
    maxWin: "x2.5",
    category: "Стратегия"
  },
  {
    id: "game-crash",
    name: "Краш",
    emoji: "🚀",
    desc: "Ракета летит вверх — забери выигрыш до крушения! Чем дольше ждёшь, тем больше риск.",
    color: "from-orange-500 to-red-500",
    borderColor: "border-orange-500/40",
    badge: "HOT",
    badgeColor: "bg-red-500",
    minBet: 50,
    maxWin: "∞",
    category: "Риск"
  },
  {
    id: "game-number",
    name: "Угадай число",
    emoji: "🔮",
    desc: "Угадай загаданное число от 1 до 100. Чем точнее — тем больше выигрыш!",
    color: "from-violet-600 to-purple-400",
    borderColor: "border-violet-500/40",
    badge: "",
    badgeColor: "",
    minBet: 50,
    maxWin: "x10",
    category: "Интуиция"
  },
  {
    id: "game-dice",
    name: "Кости",
    emoji: "🎲",
    desc: "Бросай два кубика и угадывай сумму. Выбирай стратегию — риск или осторожность!",
    color: "from-teal-600 to-cyan-400",
    borderColor: "border-teal-500/40",
    badge: "",
    badgeColor: "",
    minBet: 100,
    maxWin: "x30",
    category: "Удача"
  },
  {
    id: "game-loto",
    name: "Лотерея",
    emoji: "🎟️",
    desc: "Купи билет и участвуй в розыгрыше! 3 призовых места: 10000, 5000 и 1000 D-COIN.",
    color: "from-yellow-500 to-orange-500",
    borderColor: "border-yellow-500/40",
    badge: "NEW",
    badgeColor: "bg-yellow-500",
    minBet: 100,
    maxWin: "10000",
    category: "Удача"
  },
];

const categories = ["Все", "Удача", "Стратегия", "Риск", "Интуиция"];

export default function GamesPage({ navigate }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4 border border-purple-500/30">
          <span className="text-neon-green text-xs">●</span>
          <span className="text-xs font-exo text-green-400">Все игры работают</span>
        </div>
        <h1 className="font-orbitron text-4xl font-black text-white mb-3">
          🎮 <span className="neon-text-purple">Игровой</span> <span className="neon-text-blue">зал</span>
        </h1>
        <p className="text-gray-400 font-exo">7 игр · Только D-COIN · Без риска реальных денег</p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-sm font-exo font-semibold transition-all ${
              cat === "Все"
                ? "btn-primary"
                : "glass border border-purple-800/30 text-gray-400 hover:text-white hover:border-purple-500/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className={`card-game border ${game.borderColor} overflow-hidden group cursor-pointer`}
            onClick={() => navigate(game.id as Page)}
          >
            {/* Top gradient */}
            <div className={`h-36 bg-gradient-to-br ${game.color} flex items-center justify-center relative overflow-hidden`}>
              <span className="text-7xl group-hover:scale-110 transition-transform duration-300 select-none">
                {game.emoji}
              </span>
              {game.badge && (
                <div className={`absolute top-3 right-3 ${game.badgeColor} text-white text-xs font-bold font-orbitron px-2 py-0.5 rounded-full`}>
                  {game.badge}
                </div>
              )}
              <div className="absolute top-3 left-3 glass rounded-full px-2 py-0.5 text-xs font-exo text-white/80">
                {game.category}
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-orbitron text-xl font-bold text-white mb-2">{game.name}</h3>
              <p className="text-gray-500 text-sm font-exo mb-4 leading-relaxed">{game.desc}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600 font-exo">Мин. ставка</p>
                  <p className="font-orbitron text-sm neon-text-gold font-bold">{game.minBet} D</p>
                </div>
                <div className="h-8 w-px bg-purple-900/40" />
                <div className="text-center">
                  <p className="text-xs text-gray-600 font-exo">Макс. выигрыш</p>
                  <p className="font-orbitron text-sm neon-text-green font-bold">{game.maxWin}</p>
                </div>
                <div className="h-8 w-px bg-purple-900/40" />
                <div className="text-center">
                  <p className="text-xs text-gray-600 font-exo">Категория</p>
                  <p className="text-sm text-purple-300 font-exo font-semibold">{game.category}</p>
                </div>
              </div>

              <button className="w-full btn-primary py-3 rounded-xl font-bold font-exo text-sm flex items-center justify-center gap-2">
                <Icon name="Play" size={16} />
                Играть
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="mt-10 glass border border-purple-900/30 rounded-2xl p-6 text-center">
        <p className="text-gray-500 text-sm font-exo">
          🔒 Все игры работают исключительно на виртуальной валюте <span className="text-neon-gold font-bold">D-COIN</span>.
          Никаких реальных денег. Просто веселись!
        </p>
      </div>
    </div>
  );
}