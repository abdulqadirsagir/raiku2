import React, { useState } from 'react';
import { Header } from './components/Header';
import { Explainer } from './components/Explainer';
import { Search } from './components/Search';
import { Quiz } from './components/Quiz';
import { Leaderboard } from './components/Leaderboard';
import { LeaderboardEntry } from './types';
import { DUMMY_LEADERBOARD } from './constants';
import { Socials } from './components/Socials';

const App: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(DUMMY_LEADERBOARD);

  const handleAddScore = (entry: Omit<LeaderboardEntry, 'rank'>) => {
    setLeaderboardData(prev => {
      const newLeaderboard = [...prev, { ...entry, rank: 0 }]
        .sort((a, b) => b.score - a.score)
        .map((item, index) => ({ ...item, rank: index + 1 }));
      return newLeaderboard;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-raiku-lime selection:text-black">
      <div 
        className="absolute top-0 left-0 w-full h-full animate-grid-pan"
        style={{
          backgroundImage: 'linear-gradient(rgba(191, 255, 0, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(191, 255, 0, 0.07) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>
      
      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-16 md:gap-24">
        <Header />
        <Explainer />
        <Search />
        <Quiz onQuizComplete={handleAddScore} />
        <Leaderboard data={leaderboardData} />
        <Socials />
      </main>
      <footer className="text-center py-8 text-gray-500 font-mono text-sm">
        <p>&copy; {new Date().getFullYear()} Raiku.com. All rights reserved.</p>
        <p className="mt-2">vibecoded by chrollo69420</p>
      </footer>
    </div>
  );
};

export default App;