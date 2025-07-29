'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Heart, Crown, Star, Zap, Trophy, Sparkles } from 'lucide-react';

type Sparkle = {
  id: number;
  left: number;
  top: number;
  animationDelay: number;
};

type FloatingHeart = {
  id: number;
  left: number;
  animationDuration: number;
};

const LoveLordSimulator = () => {
  const [currentTarget, setCurrentTarget] = useState(0);
  const [charmLevel, setCharmLevel] = useState(0);
  const [conqueredHearts, setConqueredHearts] = useState<number[]>([]);
  const [isFlirting, setIsFlirting] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [lovePower, setLovePower] = useState(100);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const girls = [
    { name: "Anjali Akka", difficulty: 3, conquered: false, emoji: "💕" },
    { name: "Sanjana", difficulty: 3, conquered: false, emoji: "🌸" },
    { name: "Tharushi", difficulty: 3, conquered: false, emoji: "🌷" },
    { name: "Thamodi", difficulty: 3, conquered: false, emoji: "🌹" },
    { name: "Shehela", difficulty: 3, conquered: false, emoji: "✨" },
    { name: "Chamini", difficulty: 3, conquered: false, emoji: "🌻" },
  ];

  const [targets, setTargets] = useState(girls);

  const flirtLines = [
    "Are you an API? Because I can't function without you. 💻❤️",
    "You're the semicolon to my line of code — I’m incomplete without you. 🖋️",
    "Are you Git? Because you’ve committed to my heart. 💘",
    "You're the CSS to my HTML — you make everything beautiful. 🎨",
    "If we were threads, I'd never want us to deadlock. 🔄",
    "You must be a recursive function, because I keep falling for you over and over. 🔁",
    "You're my favorite algorithm — efficient, elegant, and impossible to replace. 🧠💖",
    "Without you, my life's just a 404. 🚫📄",
    "Are you a pull request? Because I’ve been waiting for you to merge into my life. 🔀",
    "You're the only bug I never want to fix. 🐞❤️"
  ];

  const [currentFlirtLine, setCurrentFlirtLine] = useState("");

  const createFloatingHeart = () => {
    const id = Date.now() + Math.random();
    const newHeart = {
      id,
      left: Math.random() * 100,
      animationDuration: 3 + Math.random() * 2
    };
    setFloatingHearts(prev => [...prev, newHeart]);
    
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => heart.id !== id));
    }, 5000);
  };

  const createSparkles = () => {
    const newSparkles = Array.from({ length: 5 }, () => ({
      id: Date.now() + Math.random(),
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 1
    }));
    setSparkles(newSparkles);
    
    setTimeout(() => {
      setSparkles([]);
    }, 2000);
  };

  useEffect(() => {
    const interval = setInterval(createFloatingHeart, 2000);
    return () => clearInterval(interval);
  }, []);

   const executeFlirt = () => {
    if (lovePower <= 0 || targets[currentTarget].conquered) return;
    
    setIsFlirting(true);
    setShakeAnimation(true);
    setLovePower(prev => Math.max(0, prev - 10));
    
    const randomLine = flirtLines[Math.floor(Math.random() * flirtLines.length)];
    setCurrentFlirtLine(randomLine);
    
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createFloatingHeart(), i * 200);
    }
    
    setTimeout(() => {
      setShakeAnimation(false);
      
      const baseSuccessRate = 0.7; 
      const difficultyPenalty = targets[currentTarget].difficulty * 0.1;
      const successRate = Math.max(0.3, baseSuccessRate - difficultyPenalty); 
      const success = Math.random() < successRate;
      
      if (success && !targets[currentTarget].conquered) {
        const charmGain = targets[currentTarget].difficulty * 5 + 10; 
        setCharmLevel(prev => prev + charmGain);
        
        const newTargets = [...targets];
        newTargets[currentTarget].conquered = true;
        setTargets(newTargets);
        
        setConqueredHearts(prev => {
          if (!prev.includes(currentTarget)) {
            const newConquered = [...prev, currentTarget];
            
            if (newConquered.length === targets.length) {
              setTimeout(() => setShowVictory(true), 1000);
            }
            
            return newConquered;
          }
          return prev;
        });
        
        createSparkles();

        for (let i = 0; i < 5; i++) {
          setTimeout(() => createFloatingHeart(), i * 100);
        }
      }
      
      setIsFlirting(false);
      setCurrentFlirtLine("");
    }, 2000);
  };

  const selectTarget = (index: number) => {
    if (!targets[index].conquered) {
      setCurrentTarget(index);
    }
  };

  const resetGame = () => {
    setTargets(girls.map(girl => ({ ...girl, conquered: false })));
    setConqueredHearts([]);
    setCharmLevel(0);
    setCurrentTarget(0);
    setShowVictory(false);
    setLovePower(100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-red-500 relative overflow-hidden">
      {floatingHearts.map(heart => (
        <div
          key={heart.id}
          className="fixed pointer-events-none z-10"
          style={{
            left: `${heart.left}%`,
            bottom: '-50px',
            animation: `floatUp ${heart.animationDuration}s ease-out forwards`
          }}
        >
          <div className="text-4xl animate-pulse">💕</div>
        </div>
      ))}

      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="fixed pointer-events-none z-20"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.animationDelay}s`
          }}
        >
          <Sparkles className="text-yellow-300 w-6 h-6 animate-ping" />
        </div>
      ))}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 relative z-30">
          <div className="flex items-center justify-center mb-4">
            <Crown className={`text-yellow-300 w-12 h-12 mr-3 ${showVictory ? 'bounce-animation' : 'hover:animate-spin'} transition-all duration-300`} />
            <h1 className="text-4xl font-bold text-white hover:text-yellow-200 transition-colors duration-300 cursor-default">
              Love Lord Simulator
            </h1>
            <Crown className={`text-yellow-300 w-12 h-12 ml-3 ${showVictory ? 'bounce-animation' : 'hover:animate-spin'} transition-all duration-300`} />
          </div>
          <p className="text-xl text-pink-100 hover:text-white transition-colors duration-300 cursor-default">
            Featuring: Lord Lashan Ayya - Master of Hearts 💕
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 mb-8 hover:bg-white/30 transition-all duration-300 relative z-30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/30 rounded-lg p-4 hover:bg-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-center mb-2">
                <Zap className={`text-yellow-300 w-6 h-6 mr-2 ${lovePower > 50 ? 'animate-pulse' : lovePower > 0 ? 'wiggle-animation' : 'opacity-50'}`} />
                <span className="text-white font-semibold">Love Power</span>
              </div>
              <div className={`text-2xl font-bold text-white ${lovePower <= 20 ? 'animate-bounce text-red-300' : ''}`}>
                {lovePower}%
              </div>
              <div className="bg-white/30 rounded-full h-3 mt-2 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    lovePower > 50 ? 'bg-gradient-to-r from-green-400 to-blue-500' :
                    lovePower > 20 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    'bg-gradient-to-r from-red-400 to-red-600 animate-pulse'
                  }`}
                  style={{ width: `${lovePower}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white/30 rounded-lg p-4 hover:bg-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-center mb-2">
                <Star className="text-yellow-300 w-6 h-6 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-white font-semibold">Charm Level</span>
              </div>
              <div className={`text-2xl font-bold text-white ${charmLevel > 0 ? 'heart-beat' : ''}`}>
                {charmLevel}
              </div>
            </div>
            <div className="bg-white/30 rounded-lg p-4 hover:bg-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-center mb-2">
                <Heart className="text-red-300 w-6 h-6 mr-2 heart-beat" />
                <span className="text-white font-semibold">Hearts Won</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {conqueredHearts.length}/{targets.length}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 relative z-30">
          {targets.map((girl, index) => (
            <div
              key={index}
              onClick={() => selectTarget(index)}
              onMouseEnter={() => !girl.conquered && createFloatingHeart()}
              className={`bg-white/30 backdrop-blur-md rounded-xl p-4 cursor-pointer transition-all duration-500 hover:shadow-2xl ${
                currentTarget === index ? 'ring-4 ring-yellow-300 bg-white/40 glow-animation scale-105' : 'hover:scale-110'
              } ${girl.conquered ? 'bg-green-400/40 ring-2 ring-green-300 bounce-animation' : 'hover:bg-white/50'} ${
                shakeAnimation && currentTarget === index ? 'wiggle-animation' : ''
              }`}
            >
              <div className="text-center">
                <div className={`text-4xl mb-2 transition-all duration-300 ${
                  girl.conquered ? 'animate-bounce' : currentTarget === index && isFlirting ? 'heart-beat' : 'hover:scale-125'
                }`}>
                  {girl.emoji}
                </div>
                <h3 className="text-white font-semibold mb-2 hover:text-yellow-200 transition-colors duration-300">
                  {girl.name}
                </h3>
                <div className="flex justify-center mb-2">
                  {[...Array(girl.difficulty)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-300 fill-current hover:animate-spin transition-all duration-300" />
                  ))}
                </div>
                {girl.conquered ? (
                  <div className="text-green-200 font-semibold flex items-center justify-center heart-beat">
                    <Heart className="w-4 h-4 mr-1 fill-current animate-pulse" />
                    Conquered!
                  </div>
                ) : (
                  <div className={`text-pink-200 ${currentTarget === index ? 'animate-pulse text-yellow-200' : ''}`}>
                    {currentTarget === index ? 'Selected ✨' : 'Available'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 mb-8 hover:bg-white/30 transition-all duration-300 relative z-30">
          <div className="text-center">
            <h3 className={`text-2xl font-bold text-white mb-4 transition-all duration-300 ${
              isFlirting ? 'heart-beat text-yellow-200' : 'hover:text-yellow-200'
            }`}>
              Target: {targets[currentTarget].name} {targets[currentTarget].emoji}
            </h3>
            
            {isFlirting && (
              <div className="bg-white/30 rounded-lg p-4 mb-4 animate-pulse border-2 border-pink-300">
                <p className="text-white text-lg italic bounce-animation">"{currentFlirtLine}"</p>
                <div className="mt-2">
                  <div className="inline-block animate-spin text-2xl">💕</div>
                  <span className="text-pink-200 ml-2 animate-bounce">Deploying charm...</span>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={executeFlirt}
                onMouseEnter={() => !isFlirting && !targets[currentTarget].conquered && createSparkles()}
                disabled={isFlirting || targets[currentTarget].conquered || lovePower <= 0}
                className={`bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform ${
                  isFlirting 
                    ? 'animate-pulse scale-110' 
                    : 'hover:scale-110 hover:shadow-2xl hover:from-pink-400 hover:to-red-400'
                } ${
                  targets[currentTarget].conquered || lovePower <= 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:animate-bounce glow-animation'
                }`}
              >
                {isFlirting ? (
                  <span className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 animate-spin" />
                    Flirting...
                  </span>
                ) : targets[currentTarget].conquered ? (
                  'Already Conquered'
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Deploy Charm 💫
                  </span>
                )}
              </button>
              
              {lovePower <= 0 && (
                <button
                  onClick={resetGame}
                  onMouseEnter={() => createSparkles()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-110 bounce-animation glow-animation"
                >
                  <span className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 animate-pulse" />
                    Recharge ⚡
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {showVictory && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 ">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-4 text-center max-w-md mx-4 transform animate-bounce glow-animation">
              <Trophy className="w-16 h-16 text-white mx-auto mb-4 animate-spin" style={{ animationDuration: '2s' }} />
              <h2 className="text-3xl font-bold text-white mb-4 heart-beat">VICTORY!</h2>
              <p className="text-white text-lg mb-4 wiggle-animation">
                🎉 Congratulations Lord Lashan Ayya! 🎉
              </p>
              <p className="text-white mb-6 animate-pulse">
                You have successfully won all the hearts in the office! 
                Truly the undisputed Love Lord! 👑💕
              </p>
              <button
                onClick={resetGame}
                onMouseEnter={() => createSparkles()}
                className="bg-white text-orange-500 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 bounce-animation"
              >
                <span className="flex items-center justify-center">
                  <Heart className="w-4 h-4 mr-2 heart-beat" />
                  Play Again 🔄
                </span>
              </button>
            </div>
          </div>
        )}

        <div className="text-center text-pink-100 relative z-30">
          <p className="text-sm hover:text-white transition-colors duration-300 cursor-default">
            💝 A lighthearted tribute to office romance master Lashan Ayya💝
          </p>
          <p className="text-xs mt-2 opacity-75 hover:opacity-100 transition-opacity duration-300 cursor-default">
           © 2025 ERM DASSAYO. All rights reserved 😄
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoveLordSimulator;