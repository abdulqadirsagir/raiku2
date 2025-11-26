import React from 'react';
import { Card } from './ui/Card';

export const Explainer: React.FC = () => {
  return (
    <section id="explainer" className="flex flex-col items-center">
      <Card className="max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4 text-raiku-lime">What is Raiku?</h2>
        <p className="text-lg text-gray-300 leading-relaxed">
          Raiku is a decentralized, high-throughput blockchain platform built on the Solana ecosystem. 
          It focuses on providing institutional-grade reliability and performance for decentralized finance (DeFi) applications. 
          Featuring sub-second finality and extremely low transaction costs through its novel 'Proof of Inevitability' consensus, 
          Raiku is engineered for the future of finance.
        </p>
      </Card>
    </section>
  );
};