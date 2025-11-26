import React, { useState } from 'react';
import { getRaikuAnswer } from '../services/geminiService';
import { Card } from './ui/Card';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);


export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setAnswer('');
    const result = await getRaikuAnswer(query);
    setAnswer(result);
    setIsLoading(false);
  };

  return (
    <section id="search" className="flex flex-col items-center">
        <Card className="w-full max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6 text-center text-raiku-lime">Ask About Raiku</h2>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., What is Proof of Inevitability?"
                className="flex-grow bg-gray-800/50 border-2 border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-raiku-lime focus:ring-1 focus:ring-raiku-lime transition-colors"
                disabled={isLoading}
            />
            <button
                type="submit"
                className="flex items-center justify-center px-6 py-3 font-mono font-bold text-lg uppercase tracking-wider border-2 rounded-md transition-all duration-300 transform focus:outline-none focus:ring-4 border-raiku-lime text-raiku-lime bg-black hover:bg-raiku-lime hover:text-black hover:shadow-raiku-lime focus:ring-raiku-lime/50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
               {isLoading ? 'Thinking...' : <><SearchIcon /><span className="ml-2">Search</span></>}
            </button>
            </form>
            {(isLoading || answer) && (
                <div className="mt-6 p-4 bg-black/50 border border-gray-700 rounded-md min-h-[80px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-raiku-lime"></div>
                        </div>
                    ) : (
                        <p className="text-gray-200">{answer}</p>
                    )}
                </div>
            )}
        </Card>
    </section>
  );
};