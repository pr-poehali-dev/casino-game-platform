import { useState } from "react";
import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  updateBalance: (delta: number) => void;
  navigate: (p: Page) => void;
}

const shopItems = [
  {
    id: "avatar_robot",
    category: "Аватары",
    name: "Робот-Геймер",
    emoji: "🤖",
    desc: "Уникальный аватар для профиля",
    price: 500,
    rarity: "Обычный",
    rarityColor: "text-gray-400",
  },
  {
    id: "avatar_alien",
    category: "Аватары",
    name: "Инопланетянин",
    emoji: "👽",
    desc: "Таинственный пришелец",
    price: 1000,
    rarity: "Редкий",
    rarityColor: "text-blue-400",
  },
  {
    id: "avatar_dragon",
    category: "Аватары",
    name: "Кибер-Дракон",
    emoji: "🐲",
    desc: "Легендарный аватар",
    price: 5000,
    rarity: "Легендарный",
    rarityColor: "neon-text-gold",
  },
  {
    id: "boost_x2",
    category: "Бусты",
    name: "Буст x2",
    emoji: "⚡",
    desc: "Двойной выигрыш на 1 час",
    price: 2000,
    rarity: "Редкий",
    rarityColor: "text-blue-400",
  },
  {
    id: "boost_lucky",
    category: "Бусты",
    name: "Удача +50%",
    emoji: "🍀",
    desc: "Увеличивает шанс выигрыша на 30 мин",
    price: 3000,
    rarity: "Эпический",
    rarityColor: "text-purple-400",
  },
  {
    id: "frame_neon",
    category: "Рамки",
    name: "Неоновая рамка",
    emoji: "💜",
    desc: "Фиолетовая неоновая рамка профиля",
    price: 800,
    rarity: "Обычный",
    rarityColor: "text-gray-400",
  },
  {
    id: "frame_gold",
    category: "Рамки",
    name: "Золотая рамка",
    emoji: "✨",
    desc: "Эксклюзивная золотая рамка",
    price: 4000,
    rarity: "Эпический",
    rarityColor: "text-purple-400",
  },
  {
    id: "title_king",
    category: "Титулы",
    name: "Король казино",
    emoji: "👑",
    desc: "Отображается в профиле",
    price: 10000,
    rarity: "Легендарный",
    rarityColor: "neon-text-gold",
  },
  {
    id: "title_lucky",
    category: "Титулы",
    name: "Счастливчик",
    emoji: "🌟",
    desc: "Для удачливых игроков",
    price: 2500,
    rarity: "Редкий",
    rarityColor: "text-blue-400",
  },
];

const categories = ["Все", "Аватары", "Бусты", "Рамки", "Титулы"];

export default function ShopPage({ user, updateBalance, navigate: _navigate }: Props) {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [purchased, setPurchased] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const filtered = activeCategory === "Все"
    ? shopItems
    : shopItems.filter(i => i.category === activeCategory);

  const buy = (item: typeof shopItems[0]) => {
    if (purchased.includes(item.id)) return;
    if (user.balance < item.price) {
      setNotification("❌ Недостаточно D-COIN!");
      setTimeout(() => setNotification(null), 2000);
      return;
    }
    updateBalance(-item.price);
    setPurchased(prev => [...prev, item.id]);
    setNotification(`✅ Куплено: ${item.name}!`);
    setTimeout(() => setNotification(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass border border-purple-500/50 rounded-2xl px-6 py-3 font-exo font-semibold text-white animate-scale-in shadow-2xl">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-orbitron text-4xl font-black text-white mb-3">
          🛍️ <span className="neon-text-purple">Магазин</span>
        </h1>
        <p className="text-gray-400 font-exo mb-4">Трать D-COIN на крутые вещи</p>
        <div className="inline-flex items-center gap-2 glass rounded-xl px-5 py-2.5 border border-yellow-500/30">
          <span className="text-neon-gold text-lg">⚡</span>
          <span className="font-orbitron text-neon-gold font-bold text-lg">{user.balance.toLocaleString()}</span>
          <span className="text-yellow-700 font-exo text-sm font-semibold">D-COIN</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-exo font-semibold transition-all ${
              activeCategory === cat
                ? "btn-primary"
                : "glass border border-purple-800/30 text-gray-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const isBought = purchased.includes(item.id);
          const cantAfford = user.balance < item.price && !isBought;
          return (
            <div
              key={item.id}
              className={`card-game p-5 flex flex-col transition-all ${
                isBought
                  ? "border border-green-500/30"
                  : cantAfford
                  ? "opacity-60"
                  : ""
              }`}
            >
              <div className="text-4xl mb-3 text-center">{item.emoji}</div>
              <div className={`text-xs font-bold font-exo mb-1 ${item.rarityColor}`}>{item.rarity}</div>
              <h3 className="font-exo font-bold text-white text-sm mb-1">{item.name}</h3>
              <p className="text-xs text-gray-600 font-exo mb-3 flex-1">{item.desc}</p>

              <div className="flex items-center justify-between mb-3">
                <span className="font-orbitron text-sm neon-text-gold font-bold">{item.price.toLocaleString()} D</span>
                <span className={`text-xs px-2 py-0.5 rounded-full glass font-exo ${
                  item.category === "Бусты" ? "text-blue-400 border border-blue-500/20" :
                  item.category === "Аватары" ? "text-purple-400 border border-purple-500/20" :
                  "text-gray-400 border border-gray-600/20"
                }`}>{item.category}</span>
              </div>

              <button
                onClick={() => buy(item)}
                disabled={isBought}
                className={`w-full py-2.5 rounded-xl text-sm font-bold font-exo transition-all ${
                  isBought
                    ? "bg-green-600/20 border border-green-500/30 text-green-400 cursor-default"
                    : cantAfford
                    ? "bg-gray-800/50 border border-gray-700/30 text-gray-600 cursor-not-allowed"
                    : "btn-primary"
                }`}
              >
                {isBought ? "✓ Куплено" : cantAfford ? "Мало монет" : "Купить"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Featured Deal */}
      <div className="mt-8 relative overflow-hidden rounded-2xl p-6"
        style={{ background: "linear-gradient(135deg, rgba(88,28,235,0.3), rgba(0,212,255,0.2))", border: "1px solid rgba(168,85,247,0.4)" }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-600/10 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-4xl mb-2">🎁</div>
            <h3 className="font-orbitron text-xl font-bold text-white mb-1">Набор Легенды</h3>
            <p className="text-gray-400 font-exo text-sm">Кибер-Дракон + Золотая рамка + Титул "Король" — скидка 30%!</p>
          </div>
          <div className="text-center">
            <div className="text-gray-500 font-exo text-xs line-through mb-1">19 000 D-COIN</div>
            <div className="font-orbitron text-3xl neon-text-gold font-black">49999</div>
            <div className="text-yellow-700 text-xs font-exo">D-COIN</div>
            <button className="btn-gold mt-3 px-6 py-2.5 rounded-xl font-bold font-exo text-sm">
              Купить набор
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}