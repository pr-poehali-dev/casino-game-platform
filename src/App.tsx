import { useState } from "react";
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
  | "game-crash";

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
  id: "usr_001",
  name: "КосмоИгрок",
  avatar: "🚀",
  balance: 10000,
  level: 7,
  xp: 3400,
  xpMax: 5000,
  totalWon: 45200,
  totalGames: 142,
  winStreak: 3,
  joinDate: "2026-01-15",
  subscription: "vip",
  achievements: ["first_win", "lucky_streak", "high_roller", "daily_bonus"],
};

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(defaultUser);

  const navigate = (p: Page) => {
    const protectedPages = [
      "profile", "games", "leaderboard", "shop", "bonus",
      "game-slots", "game-roulette", "game-blackjack",
      "game-number", "game-dice", "game-crash"
    ];
    if (protectedPages.includes(p) && !isLoggedIn) {
      setPage("auth");
      return;
    }
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const login = () => {
    setIsLoggedIn(true);
    setPage("home");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setPage("home");
  };

  const updateBalance = (delta: number) => {
    setUser((prev) => ({ ...prev, balance: Math.max(0, prev.balance + delta) }));
  };

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
      default: return <HomePage navigate={navigate} isLoggedIn={isLoggedIn} user={user} />;
    }
  };

  return (
    <Layout page={page} navigate={navigate} isLoggedIn={isLoggedIn} user={user} onLogout={logout}>
      {renderPage()}
    </Layout>
  );
}
