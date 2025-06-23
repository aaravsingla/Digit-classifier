
import React, { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const numberInterval = setInterval(() => {
      setCurrentNumber(Math.floor(Math.random() * 10));
    }, 200);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 80);

    return () => {
      clearInterval(numberInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background numbers */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute text-white text-2xl animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {Math.floor(Math.random() * 10)}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="text-center z-10">
        <h1 className="text-6xl font-bold text-white mb-8 animate-fade-in">
          MNIST Digit Classifier
        </h1>
        
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-scale-in">
            {currentNumber}
          </div>
          <div className="absolute inset-0 text-9xl font-bold text-white opacity-20 blur-lg">
            {currentNumber}
          </div>
        </div>

        <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto mb-4">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-white text-xl opacity-80">
          Loading AI Model... {progress}%
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
