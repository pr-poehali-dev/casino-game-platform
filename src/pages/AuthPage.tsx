import { useState } from "react";
import { type Page, type User } from "@/App";
import Icon from "@/components/ui/icon";
import { authApi, setToken } from "@/lib/api";

interface Props {
  onLogin: (user: User, token: string) => void;
  navigate: (p: Page) => void;
}

export default function AuthPage({ onLogin, navigate }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let data;
      if (mode === "register") {
        data = await authApi.register(name, email, password);
      } else {
        data = await authApi.login(email, password);
      }
      setToken(data.token);
      onLogin(data.user, data.token);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">
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

        <div className="card-game p-8 neon-border-purple border">
          <div className="flex rounded-xl overflow-hidden mb-8 glass p-1 gap-1">
            <button
              onClick={() => { setMode("login"); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-exo transition-all ${
                mode === "login"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => { setMode("register"); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-exo transition-all ${
                mode === "register"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Регистрация
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-exo text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-exo font-semibold">Имя игрока</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="КосмоИгрок"
                  required
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
                required
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
                required
                minLength={4}
                className="w-full bg-black/30 border border-purple-800/40 focus:border-purple-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors font-exo text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl font-bold font-exo text-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Icon name={mode === "login" ? "LogIn" : "Rocket"} size={18} />
              )}
              {loading
                ? "Загрузка..."
                : mode === "login"
                ? "Войти в казино"
                : "Создать аккаунт + 1000 D-COIN 🎁"}
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
