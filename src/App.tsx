import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import GamesPage from "@/pages/GamesPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import ShopPage from "@/pages/ShopPage";
import BonusPage from "@/pages/BonusPage";
import InfoPage from "@/pages/InfoPage";
import SlotGame from "@/pages/games/SlotGame";
import RouletteGame from "@/pages/games/RouletteGame";
import BlackjackGame from "@/pages/games/BlackjackGame";
import NumberGame from "@/pages/games/NumberGame";
import DiceGame from "@/pages/games/DiceGame";
import CrashGame from "@/pages/games/CrashGame";
import LotoGame from "@/pages/games/LotoGame";
import { authApi, clearToken } from "@/lib/api";

export type Page =
  | "home"
  | "auth"
  | "profile"
  | "games"
  | "leaderboard"
  | "shop"
  | "bonus"
  | "info"
  | "game-slots"
  | "game-roulette"
  | "game-blackjack"
  | "game-number"
  | "game-dice"
  | "game-crash"
  | "game-loto";

export interface User {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  level: number;
  xp: number;
  xpMax: number;
  totalWon: number;
  totalGames: number;
  winStreak: number;
  joinDate: string;
  subscription: "free" | "vip" | "premium" | "elite";
  achievements: string[];
}

const defaultUser: User = {
  id: "",
  name: "",
  avatar: "🚀",
  balance: 0,
  level: 1,
  xp: 0,
  xpMax: 1000,
  totalWon: 0,
  totalGames: 0,
  winStreak: 0,
  joinDate: "2026-01-01",
  subscription: "free",
  achievements: [],
};

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(defaultUser);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("dcoin_token");
    if (token) {
      authApi.me().then((data) => {
        if (data.user) {
          setUser(data.user);
          setIsLoggedIn(true);
        } else {
          clearToken();
        }
      }).catch(() => {
        clearToken();
      }).finally(() => {
        setAuthLoading(false);
      });
    } else {
      setAuthLoading(false);
    }
  }, []);

  const navigate = (p: Page) => {
    const protectedPages = [
      "profile", "games", "leaderboard", "shop", "bonus",
      "game-slots", "game-roulette", "game-blackjack",
      "game-number", "game-dice", "game-crash", "game-loto"
    ];
    if (protectedPages.includes(p) && !isLoggedIn) {
      setPage("auth");
      return;
    }
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    setPage("home");
  };

  const logout = () => {
    authApi.logout().catch(() => {});
    clearToken();
    setIsLoggedIn(false);
    setUser(defaultUser);
    setPage("home");
  };

  const updateBalance = (delta: number) => {
    setUser((prev) => ({ ...prev, balance: Math.max(0, prev.balance + delta) }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen grid-lines flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-float mb-4">🎰</div>
          <p className="font-orbitron text-purple-400 text-lg">DCOIN</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage navigate={navigate} isLoggedIn={isLoggedIn} user={user} />;
      case "auth": return <AuthPage onLogin={login} navigate={navigate} />;
      case "profile": return <ProfilePage user={user} navigate={navigate} />;
      case "games": return <GamesPage navigate={navigate} />;
      case "leaderboard": return <LeaderboardPage user={user} navigate={navigate} />;
      case "shop": return <ShopPage user={user} updateBalance={updateBalance} navigate={navigate} />;
      case "bonus": return <BonusPage user={user} updateBalance={updateBalance} navigate={navigate} />;
      case "info": return <InfoPage navigate={navigate} />;
      case "game-slots": return <SlotGame user={user} updateBalance={updateBalance} navigate={navigate} />;
      case "game-roulette": return <RouletteGame user={user} updateBalance={updateBalance} navigate={navigate} />;
      case "game-blackjack": return <BlackjackGame user={user} updateBalance={updateBalance} navigate={navigate} />;
      case "game-number": return <NumberGame user={user} updateBalance={updateBalance} navigate={navigate} />;
      case "game-dice": return <DiceGame user={user} updateBalance={updateBalance} navigate={navigate} />;
      case "game-crash": return <CrashGame user={user} updateBalance={updateBalance} navigate={navigate} />;
      case "game-loto": return <LotoGame user={user} updateBalance={updateBalance} navigate={navigate} />;
      default: return <HomePage navigate={navigate} isLoggedIn={isLoggedIn} user={user} />;
    }
  };

  return (
    <Layout page={page} navigate={navigate} isLoggedIn={isLoggedIn} user={user} onLogout={logout}>
      {renderPage()}
    </Layout>
  );
}
