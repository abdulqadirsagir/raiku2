import { Difficulty, LeaderboardEntry, QuizQuestion } from './types';

export const QUESTION_COUNT = 10;

export const DIFFICULTY_LEVELS = {
  [Difficulty.Simple]: { time: 5 * 60 },      // 5 minutes
  [Difficulty.Challenging]: { time: 2 * 60 }, // 2 minutes
  [Difficulty.Hard]: { time: 1 * 60 },      // 1 minute
};

export const RAIKU_CONTEXT = `Raiku is a decentralized, high-throughput Layer-1 blockchain, purpose-built for institutional-grade finance on the Solana ecosystem. It combines elite engineering with a forward-thinking consensus mechanism to deliver unparalleled performance, security, and capital efficiency.

## Core Features:
- **Proof of Inevitability (PoI) Consensus:** A novel BFT consensus mechanism where validator nodes pre-commit to transaction blocks. This allows for parallel transaction processing and achieves sub-second finality with deterministic outcomes, eliminating the risk of chain reorganizations.
- **Ultra-Low Transaction Fees:** By optimizing data propagation and leveraging Solana's architecture, Raiku maintains transaction fees that are fractions of a cent, making it viable for high-frequency trading and microtransactions.
- **Institutional-Grade Security:** The network is designed with compliance and security at its core, featuring permissioned sidechains for institutions and robust, auditable smart contracts written in Rust.
- **Seamless Interoperability:** Raiku features a native, trust-minimized bridge to Ethereum, allowing for frictionless asset transfer and cross-chain composability.

## Tokenomics (RAI):
The native token, RAI, is used for:
- **Staking:** Securing the network through PoI consensus.
- **Transaction Fees:** Paying for network operations.
- **Governance:** Participating in on-chain governance to vote on protocol upgrades and parameter changes.
Total Supply: 1,000,000,000 RAI.

## For Developers:
Raiku is fully compatible with Solana's toolchain. Developers can write smart contracts in Rust, leveraging frameworks like Anchor. The Raiku RPC is optimized for low-latency queries, providing a superior developer experience for building high-performance dApps.`;


export const SPECIAL_HARD_QUESTIONS: QuizQuestion[] = [
  {
    question: "What do you love about offmylawn?",
    options: ["everything", "everything", "everything", "everything"],
    correctAnswerIndex: -1, // Special flag for "any answer is correct"
  },
  {
    question: "Who is MIC?",
    options: ["CFG", "ChiefFG", "CFeetG", "CFGuy"],
    correctAnswerIndex: -1, // Special flag
  },
];


export const DUMMY_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: 'cypher_god', score: 90, difficulty: Difficulty.Hard },
  { rank: 2, username: 'solana_maxi', score: 80, difficulty: Difficulty.Challenging },
  { rank: 3, username: 'degen_trader', score: 70, difficulty: Difficulty.Simple },
  { rank: 4, username: 'rust_ace', score: 60, difficulty: Difficulty.Hard },
];

export const FALLBACK_QUESTIONS: QuizQuestion[] = [
    {
        question: "What ecosystem is Raiku built on?",
        options: ["Ethereum", "Polkadot", "Solana", "Cardano"],
        correctAnswerIndex: 2
    },
    {
        question: "What is the name of Raiku's consensus mechanism?",
        options: ["Proof of Stake", "Proof of Work", "Proof of History", "Proof of Inevitability"],
        correctAnswerIndex: 3
    },
    {
        question: "What programming language does Raiku primarily support for smart contracts?",
        options: ["Solidity", "Rust", "Python", "Go"],
        correctAnswerIndex: 1
    },
    {
        question: "What is a key feature of Raiku's transaction finality?",
        options: ["One minute finality", "Probabilistic finality", "Sub-second finality", "Ten-second finality"],
        correctAnswerIndex: 2
    },
    {
        question: "Raiku is primarily designed for what type of applications?",
        options: ["Gaming", "Social Media", "Decentralized Finance (DeFi)", "NFT Marketplaces"],
        correctAnswerIndex: 2
    },
    {
        question: "What does 'PoI' stand for in the context of Raiku?",
        options: ["Proof of Identity", "Protocol of Interest", "Proof of Inevitability", "Proof of Integration"],
        correctAnswerIndex: 2
    },
    {
        question: "How does Raiku aim to keep transaction costs?",
        options: ["Moderately high", "Variable based on network load", "Fixed at a high rate", "Extremely low"],
        correctAnswerIndex: 3
    },
    {
        question: "Raiku provides a seamless bridge to which other major blockchain?",
        options: ["Bitcoin", "Ethereum", "Tezos", "Avalanche"],
        correctAnswerIndex: 1
    },
    {
        question: "What is the main focus of Raiku?",
        options: ["Decentralized storage", "Privacy and anonymity", "Institutional-grade reliability and performance", "On-chain governance"],
        correctAnswerIndex: 2
    },
    {
        question: "How do validator nodes contribute to security in PoI?",
        options: ["By randomly selecting transactions", "By delaying block validation", "By pre-committing to transaction blocks", "By voting on every transaction"],
        correctAnswerIndex: 2
    }
];