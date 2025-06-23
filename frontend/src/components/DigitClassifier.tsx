import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Zap, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const DigitClassifier = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidence, setConfidence] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
          setPrediction(null);
          setConfidence(0);
          toast.success("Image uploaded successfully!");
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please upload a valid image file");
      }
    }
  };

  const realPrediction = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first!");
      return;
    }

    setIsAnalyzing(true);
    setPrediction(null);

    try {
      const imageBlob = await (await fetch(selectedImage)).blob();
      const formData = new FormData();
      formData.append("file", imageBlob, "digit.png");

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.digit);
        setConfidence(data.confidence);
        toast.success(`Prediction complete! Digit: ${data.digit}`);
      } else {
        toast.error(data.error || "Prediction failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetClassifier = () => {
    setSelectedImage(null);
    setPrediction(null);
    setConfidence(0);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info("Classifier reset!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          MNIST Digit Classifier 
        </h1>
        <p className="text-xl text-gray-300">
          Upload a handwritten digit image and let AI predict the number!
        </p>
      </div>

      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardContent className="p-8">
          {/* Image Upload Area */}
          <div className="mb-8">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            
            <label
              htmlFor="image-upload"
              className="block w-full h-48 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:border-white/50 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center justify-center h-full">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Uploaded digit"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-white/60 mb-4 group-hover:text-white/80 transition-colors" />
                    <p className="text-white/60 group-hover:text-white/80 transition-colors">
                      Click to upload digit image
                    </p>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Prediction Result */}
          {(prediction !== null || isAnalyzing) && (
            <div className="mb-8 text-center">
              <div className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-lg p-6 border border-white/20">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center">
                    <div className="text-6xl mb-4 animate-pulse">🤖</div>
                    <p className="text-white text-lg">Analyzing digit...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-white/80 text-lg">Predicted Digit:</p>
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-scale-in">
                      {prediction}
                    </div>
                    <p className="text-white/70">
                      Confidence: {confidence.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={realPrediction}
              disabled={!selectedImage || isAnalyzing}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Predicting...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Predict Digit
                </div>
              )}
            </Button>

            {(selectedImage || prediction !== null) && (
              <Button
                onClick={resetClassifier}
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10 transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fun floating numbers animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute text-white/20 text-xl animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {Math.floor(Math.random() * 10)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitClassifier;
