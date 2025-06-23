
import React, { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import DigitClassifier from '../components/DigitClassifier';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Show loading for 4 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <DigitClassifier />
      )}
    </div>
  );
};

export default Index;
