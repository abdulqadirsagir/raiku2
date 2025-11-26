import React, { useState } from 'react';
import { LeaderboardEntry, Difficulty } from '../types';
import { Card } from './ui/Card';

interface LeaderboardProps {
  data: LeaderboardEntry[];
}

const difficultyButtonClasses = (isActive: boolean) => 
    `px-3 py-1 text-sm font-bold rounded-md transition-colors ${
        isActive ? 'bg-raiku-lime text-black' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
    }`;

export const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState<Difficulty>(Difficulty.Hard);

  const filteredData = data.filter(entry => entry.difficulty === activeFilter);
  
  return (
    <section id="leaderboard" className="flex flex-col items-center">
      <Card className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-raiku-lime">Leaderboard</h2>
            <div className="flex items-center gap-2 border border-gray-700 p-1 rounded-lg">
                {(Object.keys(Difficulty) as Array<keyof typeof Difficulty>).map(key => (
                    <button 
                        key={key}
                        onClick={() => setActiveFilter(Difficulty[key])}
                        className={difficultyButtonClasses(activeFilter === Difficulty[key])}
                    >
                        {Difficulty[key]}
                    </button>
                ))}
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-left">
            <thead className="text-gray-400 uppercase tracking-wider text-sm border-b-2 border-gray-700">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Username</th>
                <th className="p-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? filteredData.map((entry, index) => (
                <tr key={index} className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800/50 transition-colors">
                  <td className={`p-4 font-bold ${entry.rank === 1 ? 'text-raiku-lime' : ''}`}>{entry.rank}</td>
                  <td className="p-4">{entry.username}</td>
                  <td className="p-4 text-right font-bold text-lg text-white">{entry.score}</td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={3} className="text-center p-8 text-gray-500">No scores yet for this difficulty.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};