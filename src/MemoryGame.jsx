import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient'; // Import supabase client

const cardImages = [
  { content: '🍎', matched: false },
  { content: '🍌', matched: false },
  { content: '🍇', matched: false },
  { content: '🍓', matched: false },
  { content: '🍍', matched: false },
  { content: '🥝', matched: false },
];

function MemoryGame({ onBack }) {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const timerRef = useRef(null);

  // Shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setTurns(0);
    setChoiceOne(null);
    setChoiceTwo(null);
    setTimer(0);
    setIsRunning(false);
    setGameEnded(false);
    clearInterval(timerRef.current); // Clear any existing timer
  };

  // Handle a choice
  const handleChoice = (card) => {
    if (disabled || gameEnded) return; // Prevent clicks if disabled or game ended

    if (!isRunning && turns === 0) { // Start timer on first click of the game
      setIsRunning(true);
    }

    if (choiceOne) {
      setChoiceTwo(card);
    } else {
      setChoiceOne(card);
    }
  };

  // Compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.content === choiceTwo.content) { // Changed from .src to .content
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.content === choiceOne.content) { // Changed from .src to .content
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  // Start a new game automatically on first render
  useEffect(() => {
    shuffleCards();
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && !gameEnded) {
      timerRef.current = setInterval(() => {
        setTimer(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, gameEnded]);

  // Check if game is won
  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every(card => card.matched);
    if (allMatched && !gameEnded) {
      setIsRunning(false);
      setGameEnded(true);
      clearInterval(timerRef.current);
      console.log('Game Over! Score:', cards.length / 2, 'Time:', timer, 'Flips:', turns);
      saveGameSession(cards.length / 2, timer, turns); // Save game data
    }
  }, [cards, gameEnded, timer, turns]);

  // Function to save game session to Supabase
  const saveGameSession = async (score, time_taken_seconds, flips) => {
    try {
      const { data: { user } } = await supabase.auth.getUser(); // Get current user
      const userId = user ? user.id : null; // Get user ID, or null if not logged in

      const { data, error } = await supabase
        .from('game_sessions')
        .insert([
          { score, time_taken_seconds, flips, user_id: userId } // Pass user_id
        ]);

      if (error) {
        console.error('Error saving game session:', error.message);
      } else {
        console.log('Game session saved successfully:', data);
      }
    } catch (err) {
      console.error('Unexpected error saving game session:', err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-background text-text">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-5xl font-bold text-primary mb-4 leading-tight">
          เกมความจำ
        </h1>
        <p className="text-xl text-textSecondary max-w-2xl mx-auto">
          พลิกการ์ดเพื่อจับคู่ภาพที่เหมือนกัน ฝึกความจำของคุณ!
        </p>
      </header>

      <main className="bg-surface p-8 rounded-3xl shadow-2xl max-w-4xl w-full text-center border border-border mb-8">
        <div className="flex justify-around items-center mb-6 text-2xl font-semibold text-text">
          <p>พลิก: {turns}</p>
          <p>เวลา: {timer} วินาที</p>
        </div>

        {gameEnded && (
          <div className="bg-success/20 border-success text-success p-6 rounded-xl mb-6 text-3xl font-bold animate-pulse">
            <p>ยอดเยี่ยม! คุณทำได้แล้ว!</p>
            <p>ใช้เวลา: {timer} วินาที, พลิก: {turns} ครั้ง</p>
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 md:gap-6 lg:gap-8 justify-center">
          {cards.map(card => (
            <div
              className="relative w-full aspect-square rounded-xl shadow-lg cursor-pointer"
              key={card.id}
              onClick={() => !disabled && handleChoice(card)}
              style={{ perspective: '1000px' }}
            >
              <div
                className={`relative w-full h-full transition-transform duration-300 ease-in-out origin-center card-inner-wrapper
                            ${(choiceOne === card || choiceTwo === card || card.matched) ? 'flipped' : ''}`}
              >
                {/* ด้านหน้าของการ์ด (เมื่อยังไม่พลิก) - แสดงเครื่องหมายคำถาม */}
                <div className="absolute inset-0 flex items-center justify-center bg-surface rounded-xl border-4 border-border card-face">
                  <span className="text-8xl font-bold text-primary">?</span>
                </div>
                {/* ด้านหลังของการ์ด (เมื่อพลิกแล้ว) - แสดงอีโมจิผลไม้ */}
                <div className="absolute inset-0 flex items-center justify-center bg-surface rounded-xl border-4 border-surface card-face card-back-face">
                  <span className="text-8xl font-bold">{card.content}</span> {/* Display emoji here */}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
          <button
            className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 ease-in-out shadow-lg
                       focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-surface
                       active:scale-98"
            onClick={shuffleCards}
          >
            เริ่มเกมใหม่
          </button>
          <button
            className="bg-accent hover:bg-accent/90 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 ease-in-out shadow-lg
                       focus:outline-none focus:ring-4 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-surface
                       active:scale-98"
            onClick={onBack}
          >
            กลับหน้าหลัก
          </button>
        </div>
      </main>
    </div>
  );
}

export default MemoryGame;
