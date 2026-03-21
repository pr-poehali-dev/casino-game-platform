import { useState } from "react";
import { type Page } from "@/App";
import Icon from "@/components/ui/icon";

interface Props {
  onLogin: () => void;
  navigate: (p: Page) => void;
}

export default function AuthPage({ onLogin, navigate }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-4xl mb-4 animate-float shadow-2xl"
            style={{ boxShadow: "0 0 40px rgba(168,85,247,0.4)" }}>
            🎰
          </div>
          <h1 className="font-orbitron text-3xl font-bold neon-text-purple">DCOIN</h1>
          <p className="text-gray-400 mt-2 font-exo">
            {mode === "login" ? "Войди в игру" : "Начни своё путешествие"}
          </p>
        </div>

        {/* Card */}
        <div className="card-game p-8 neon-border-purple border">

          {/* Toggle */}
          <div className="flex rounded-xl overflow-hidden mb-8 glass p-1 gap-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-exo transition-all ${
                mode === "login"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-exo transition-all ${
                mode === "register"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Регистрация
            </button>
          </div>

          {/* Social Auth */}
          <div className="space-y-3 mb-6">
            <p className="text-xs text-gray-500 text-center font-exo mb-3">Войди через соц. сети</p>

            <button
              onClick={onLogin}
              className="w-full glass border border-blue-500/30 hover:border-blue-400/60 text-white py-3 rounded-xl flex items-center justify-center gap-3 font-exo font-semibold text-sm transition-all hover:bg-blue-500/10"
            >
              <span className="text-xl">✈️</span>
              Войти через Telegram
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onLogin}
                className="glass border border-red-500/20 hover:border-red-400/40 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-exo font-semibold text-sm transition-all hover:bg-red-500/10"
              >
                <span>🔴</span> Google
              </button>
              <button
                onClick={onLogin}
                className="glass border border-blue-600/30 hover:border-blue-500/50 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-exo font-semibold text-sm transition-all hover:bg-blue-600/10"
              >
                <span>🔷</span> VK
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-purple-900/40" />
            <span className="text-xs text-gray-600 font-exo">или через email</span>
            <div className="flex-1 h-px bg-purple-900/40" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-exo font-semibold">Имя игрока</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="КосмоИгрок"
                  className="w-full bg-black/30 border border-purple-800/40 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors font-exo text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-exo font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/30 border border-purple-800/40 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors font-exo text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-exo font-semibold">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/30 border border-purple-800/40 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors font-exo text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3.5 rounded-xl font-bold font-exo text-sm mt-2 flex items-center justify-center gap-2"
            >
              <Icon name={mode === "login" ? "LogIn" : "Rocket"} size={18} />
              {mode === "login" ? "Войти в казино" : "Создать аккаунт + 1000 D-COIN 🎁"}
            </button>
          </form>

          {mode === "register" && (
            <p className="text-xs text-center text-gray-600 mt-4 font-exo">
              Регистрируясь, ты получаешь <span className="text-neon-gold font-bold">1000 D-COIN</span> бесплатно
            </p>
          )}
        </div>

        <button
          onClick={() => navigate("home")}
          className="w-full text-center text-sm text-gray-600 hover:text-gray-400 mt-4 transition-colors font-exo"
        >
          ← Вернуться на главную
        </button>
      </div>
    </div>
  );
}
