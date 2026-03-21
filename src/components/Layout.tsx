import { useState } from "react";
import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";

interface LayoutProps {
  children: React.ReactNode;
  page: Page;
  navigate: (p: Page) => void;
  isLoggedIn: boolean;
  user: User;
  onLogout: () => void;
}

const navItems = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "games", label: "Игры", icon: "Gamepad2" },
  { id: "bonus", label: "Бонусы", icon: "Gift" },
  { id: "leaderboard", label: "Рейтинг", icon: "Trophy" },
  { id: "shop", label: "Магазин", icon: "ShoppingBag" },
  { id: "info", label: "Инфо", icon: "Info" },
] as const;

const subLabels: Record<string, { label: string; color: string }> = {
  free: { label: "FREE", color: "text-gray-400" },
  vip: { label: "VIP", color: "text-neon-gold" },
  premium: { label: "PREMIUM", color: "text-neon-purple" },
  elite: { label: "ELITE", color: "text-neon-blue" },
};

export default function Layout({ children, page, navigate, isLoggedIn, user, onLogout }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen grid-lines relative">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center animate-pulse-glow">
              <span className="text-lg">🎰</span>
            </div>
            <span className="font-orbitron text-lg font-bold neon-text-purple hidden sm:block">
              D<span className="neon-text-blue">COIN</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id as Page)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-exo ${
                  page === item.id
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Right: Balance + User */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="hidden sm:flex items-center gap-2 glass rounded-lg px-3 py-1.5 neon-border-gold border">
                  <span className="text-neon-gold text-sm">⚡</span>
                  <span className="font-orbitron text-neon-gold text-sm font-bold">
                    {user.balance.toLocaleString()}
                  </span>
                  <span className="text-xs text-yellow-600 font-semibold">D-COIN</span>
                </div>
                <button
                  onClick={() => navigate("profile")}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all glass border text-sm ${
                    page === "profile"
                      ? "neon-border-purple border text-purple-300"
                      : "border-transparent hover:border-purple-500/30 text-gray-300 hover:text-white"
                  }`}
                >
                  <span className="text-xl">{user.avatar}</span>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold font-exo text-white">{user.name}</div>
                    <div className={`text-xs font-orbitron ${subLabels[user.subscription]?.color}`}>
                      {subLabels[user.subscription]?.label}
                    </div>
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  className="hidden sm:flex p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Выйти"
                >
                  <Icon name="LogOut" size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("auth")}
                className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold font-exo"
              >
                Войти
              </button>
            )}

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Icon name={mobileOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden glass-dark border-t border-purple-900/30 px-4 py-3 flex flex-col gap-1 animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { navigate(item.id as Page); setMobileOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  page === item.id
                    ? "bg-purple-600/20 text-purple-300"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
            {isLoggedIn && (
              <button
                onClick={() => { onLogout(); setMobileOpen(false); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10"
              >
                <Icon name="LogOut" size={16} />
                Выйти
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Main */}
      <main className="pt-16 min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/20 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎰</span>
            <span className="font-orbitron text-purple-400 font-bold">DCOIN CASINO</span>
          </div>
          <p className="text-xs text-gray-600 text-center">
            Только виртуальная валюта D-COIN · Нет реальных денег · 18+
          </p>
          <div className="flex gap-4 text-xs text-gray-600">
            <button onClick={() => navigate("info")} className="hover:text-purple-400 transition-colors">Помощь</button>
            <button onClick={() => navigate("info")} className="hover:text-purple-400 transition-colors">Правила</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
