import React, { useState, useEffect, useCallback } from 'react';
import { Difficulty, QuizQuestion } from '../types';
import { generateQuizQuestions } from '../services/geminiService';
import { DIFFICULTY_LEVELS, QUESTION_COUNT, FALLBACK_QUESTIONS } from '../constants';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

type GameState = 'idle' | 'loading' | 'info' | 'playing' | 'finished';

interface QuizProps {
  onQuizComplete: (result: { username: string; score: number; difficulty: Difficulty }) => void;
}

export const Quiz: React.FC<QuizProps> = ({ onQuizComplete }) => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [username, setUsername] = useState('');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (gameState === 'playing' && timeLeft === 0) {
      finishGame();
    }
  }, [gameState, timeLeft]);

  const loadQuestions = async (selectedDifficulty: Difficulty) => {
    setGameState('loading');
    setDifficulty(selectedDifficulty);
    try {
        const fetchedQuestions = await generateQuizQuestions(selectedDifficulty);
        setQuestions(fetchedQuestions);
    } catch {
        setQuestions(FALLBACK_QUESTIONS); // fallback on error
    } finally {
        setGameState('info');
    }
  };

  const startGame = () => {
    if (!difficulty) return;
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setTimeLeft(DIFFICULTY_LEVELS[difficulty].time);
    setGameState('playing');
    setAnimate(true);
  };
  
  const finishGame = useCallback(() => {
    let finalScore = 0;
    questions.forEach((q, index) => {
      if (q.correctAnswerIndex === -1 || q.correctAnswerIndex === userAnswers[index]) {
        finalScore += 1;
      }
    });
    setScore(finalScore);
    setGameState('finished');
  }, [questions, userAnswers]);


  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setAnimate(false);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setAnimate(true);
      }, 300);
    } else {
      finishGame();
    }
  };

  const submitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && difficulty) {
      onQuizComplete({ username, score, difficulty });
      resetGame();
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setDifficulty(null);
    setQuestions([]);
    setUsername('');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const renderContent = () => {
    switch (gameState) {
      case 'idle':
        return (
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6 text-raiku-lime">Raiku Knowledge Challenge</h2>
            <p className="mb-8 text-gray-300">Test your knowledge. Choose your difficulty.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => loadQuestions(Difficulty.Simple)}>Simple</Button>
              <Button onClick={() => loadQuestions(Difficulty.Challenging)}>Challenging</Button>
              <Button onClick={() => loadQuestions(Difficulty.Hard)} variant="secondary">Hard</Button>
            </div>
          </div>
        );
      case 'loading':
        return <div className="text-center text-raiku-lime text-2xl font-mono animate-pulse">Generating questions...</div>;
      case 'info':
        return (
            <div className="text-center">
                <h2 className="text-3xl font-mono font-bold mb-4 text-raiku-lime">Quiz Details</h2>
                <p className="text-lg mb-2 text-gray-300">You will face {QUESTION_COUNT} questions.</p>
                <p className="text-lg mb-6 text-gray-300">You have <span className="text-neon-pink font-bold">{formatTime(DIFFICULTY_LEVELS[difficulty!].time)}</span> to complete it.</p>
                <Button onClick={startGame}>Start Quiz</Button>
            </div>
        );
      case 'playing':
        const question = questions[currentQuestionIndex];
        return (
          <div className={`transition-all duration-300 ease-in-out ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="flex justify-between items-center mb-4 font-mono text-lg">
              <div className="text-raiku-lime">Question {currentQuestionIndex + 1}/{questions.length}</div>
              <div className="text-neon-pink">{formatTime(timeLeft)}</div>
            </div>
            <div className="bg-black/50 p-6 rounded-md border border-gray-700">
                <h3 className="text-2xl font-semibold mb-6 text-gray-100">{question.question}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                    <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`p-4 border-2 rounded-md text-left transition-colors duration-200 ${
                        userAnswers[currentQuestionIndex] === index
                        ? 'border-raiku-lime bg-raiku-lime/20'
                        : 'border-gray-600 hover:border-raiku-lime hover:bg-raiku-lime/10'
                    }`}
                    >
                    {option}
                    </button>
                ))}
                </div>
            </div>
            <div className="text-center mt-6">
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
              </Button>
            </div>
          </div>
        );
      case 'finished':
        let resultTheme: { title: string; colorClass: string; emoji: string; buttonVariant: 'primary' | 'secondary' | 'success'; inputFocusClass: string; };

        if (score <= 3) {
            resultTheme = {
                title: 'Better Luck Next Time!',
                colorClass: 'text-neon-pink',
                emoji: '😔',
                buttonVariant: 'secondary',
                inputFocusClass: 'focus:border-neon-pink focus:ring-neon-pink'
            };
        } else if (score <= 6) {
            resultTheme = {
                title: 'Good Effort!',
                colorClass: 'text-raiku-lime',
                emoji: '🙂',
                buttonVariant: 'primary',
                inputFocusClass: 'focus:border-raiku-lime focus:ring-raiku-lime'
            };
        } else {
            resultTheme = {
                title: 'Quiz Complete!',
                colorClass: 'text-raiku-lime',
                emoji: '⚡️😄',
                buttonVariant: 'success',
                inputFocusClass: 'focus:border-raiku-lime focus:ring-raiku-lime'
            };
        }

        return (
            <div className="text-center">
                <h2 className={`text-3xl md:text-4xl font-mono font-bold mb-4 ${resultTheme.colorClass}`}>{resultTheme.title} {resultTheme.emoji}</h2>
                <p className="text-2xl mb-6">Your Score: <span className={`font-bold ${resultTheme.colorClass}`}>{score}/{questions.length}</span></p>
                <form onSubmit={submitScore} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter Discord Username"
                    className={`flex-grow bg-gray-800/50 border-2 border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${resultTheme.inputFocusClass}`}
                />
                <Button type="submit" variant={resultTheme.buttonVariant}>Add to Leaderboard</Button>
                </form>
                 <button onClick={resetGame} className="mt-4 text-gray-400 hover:text-raiku-lime transition-colors">Play Again</button>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="quiz">
        <Card className="w-full max-w-4xl mx-auto min-h-[400px] flex items-center justify-center">
            {renderContent()}
        </Card>
    </section>
  );
};