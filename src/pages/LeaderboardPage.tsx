import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  navigate: (p: Page) => void;
}

const topPlayers = [
  { rank: 1, name: "НебесныйАс", avatar: "👑", balance: 987654, level: 42, games: 1420, sub: "elite", streak: 15 },
  { rank: 2, name: "КвантовыйВор", avatar: "⚡", balance: 756321, level: 38, games: 1102, sub: "elite", streak: 8 },
  { rank: 3, name: "НеоНиндзя", avatar: "🥷", balance: 634100, level: 35, games: 980, sub: "premium", streak: 12 },
  { rank: 4, name: "ГалактическийПро", avatar: "🌌", balance: 521890, level: 31, games: 845, sub: "premium", streak: 5 },
  { rank: 5, name: "КиберПантера", avatar: "🐆", balance: 445230, level: 28, games: 720, sub: "vip", streak: 7 },
  { rank: 6, name: "ТёмнаяЗвезда", avatar: "🌟", balance: 389100, level: 25, games: 654, sub: "vip", streak: 3 },
  { rank: 7, name: "КосмоИгрок", avatar: "🚀", balance: 45200, level: 7, games: 142, sub: "vip", streak: 3 },
  { rank: 8, name: "АтомныйДракон", avatar: "🐉", balance: 201450, level: 20, games: 498, sub: "vip", streak: 2 },
  { rank: 9, name: "НеонГладиатор", avatar: "⚔️", balance: 178900, level: 18, games: 430, sub: "free", streak: 0 },
  { rank: 10, name: "ФотонныйВолк", avatar: "🐺", balance: 145000, level: 16, games: 380, sub: "free", streak: 4 },
];

const subColors: Record<string, string> = {
  free: "text-gray-500",
  vip: "text-yellow-400",
  premium: "text-purple-400",
  elite: "text-blue-400",
};

const rankColors = ["", "neon-text-gold", "text-gray-300", "text-amber-600"];

export default function LeaderboardPage({ user, navigate: _navigate }: Props) {
  const userRank = topPlayers.findIndex(p => p.name === user.name) + 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-orbitron text-4xl font-black text-white mb-3">
          🏆 <span className="neon-text-gold">Лидерборд</span>
        </h1>
        <p className="text-gray-400 font-exo">Топ игроков по накопленным D-COIN</p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 mb-10">
        {[topPlayers[1], topPlayers[0], topPlayers[2]].map((p, i) => {
          const isFirst = i === 1;
          const heights = ["h-28", "h-36", "h-24"];
          const realRank = i === 0 ? 2 : i === 1 ? 1 : 3;
          return (
            <div key={p.rank} className={`flex-1 max-w-[160px] text-center`}>
              <div className={`mb-2 ${isFirst ? "text-5xl" : "text-4xl"}`}>{p.avatar}</div>
              <div className={`font-orbitron text-sm font-bold ${isFirst ? "neon-text-gold" : "text-gray-300"} mb-1`}>
                {p.name}
              </div>
              <div className="text-xs text-gray-500 font-exo mb-2">
                {p.balance.toLocaleString()} D
              </div>
              <div
                className={`${heights[i]} rounded-t-2xl flex items-start justify-center pt-3 font-orbitron text-2xl font-black ${
                  isFirst
                    ? "bg-gradient-to-b from-yellow-500/40 to-yellow-600/20 border border-yellow-500/40 text-yellow-400"
                    : i === 0
                    ? "bg-gradient-to-b from-gray-400/20 to-gray-500/10 border border-gray-500/30 text-gray-400"
                    : "bg-gradient-to-b from-amber-700/30 to-amber-800/10 border border-amber-700/30 text-amber-600"
                }`}
              >
                #{realRank}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="card-game overflow-hidden">
        <div className="p-5 border-b border-purple-900/30 flex items-center justify-between">
          <h2 className="font-orbitron text-base font-bold text-white">Таблица рейтинга</h2>
          <div className="text-xs text-gray-500 font-exo">Обновляется каждые 10 мин</div>
        </div>

        <div className="divide-y divide-purple-900/20">
          {topPlayers.map((p) => {
            const isCurrentUser = p.name === user.name;
            return (
              <div
                key={p.rank}
                className={`flex items-center gap-4 px-5 py-4 transition-all ${
                  isCurrentUser
                    ? "bg-purple-600/10 border-l-2 border-purple-500"
                    : "hover:bg-white/2"
                }`}
              >
                {/* Rank */}
                <div className={`w-8 text-center font-orbitron font-bold text-sm ${rankColors[p.rank] || "text-gray-500"}`}>
                  {p.rank <= 3 ? ["🥇", "🥈", "🥉"][p.rank - 1] : `#${p.rank}`}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/30 to-blue-500/30 border border-purple-500/20 flex items-center justify-center text-xl">
                  {p.avatar}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className={`font-exo font-bold text-sm ${isCurrentUser ? "text-purple-300" : "text-white"} truncate`}>
                    {p.name}
                    {isCurrentUser && <span className="text-xs text-purple-400 ml-2">(Вы)</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-600">Lvl {p.level}</span>
                    <span className={`text-xs font-orbitron ${subColors[p.sub]}`}>{p.sub.toUpperCase()}</span>
                    {p.streak > 0 && <span className="text-xs text-orange-400">🔥 {p.streak}</span>}
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 text-center">
                  <div>
                    <div className="text-xs text-gray-600 font-exo">Игр</div>
                    <div className="font-orbitron text-sm text-gray-300 font-bold">{p.games}</div>
                  </div>
                </div>

                {/* Balance */}
                <div className="text-right">
                  <div className="font-orbitron text-sm neon-text-gold font-bold">{p.balance.toLocaleString()}</div>
                  <div className="text-xs text-yellow-700 font-exo">D-COIN</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User's Position */}
      {userRank > 0 && (
        <div className="mt-4 glass border border-purple-500/30 rounded-2xl p-4 text-center">
          <p className="text-gray-400 font-exo text-sm">
            Вы на <span className="font-orbitron font-bold text-purple-300">#{userRank}</span> месте ·{" "}
            До топ-5: <span className="neon-text-gold font-bold">{Math.max(0, topPlayers[4].balance - user.balance).toLocaleString()} D-COIN</span>
          </p>
        </div>
      )}
    </div>
  );
}
