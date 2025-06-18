
import { Button } from "@/components/ui/button";
import { Play, Palette, Expand } from "lucide-react";
import { useState } from 'react';

interface InpaintingGenerateButtonProps {
  isGenerating: boolean;
  canGenerate: boolean;
  onGenerate: () => void;
  mode: 'inpainting' | 'outpainting';
}

const InpaintingGenerateButton = ({ 
  isGenerating, 
  canGenerate, 
  onGenerate, 
  mode 
}: InpaintingGenerateButtonProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const buttonText = mode === 'inpainting' ? 'Generate Inpainting' : 'Generate Outpainting';
  const Icon = mode === 'inpainting' ? Palette : Expand;

  return (
    <div className="flex justify-center">
      <div className="relative">
        <Button 
          onClick={onGenerate}
          onMouseMove={handleMouseMove}
          disabled={isGenerating || !canGenerate}
          className={`px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium text-lg
            transition-all duration-300 hover:scale-105 hover:shadow-xl 
            active:scale-95 disabled:hover:scale-100 disabled:hover:shadow-none
            relative overflow-hidden
            ${isGenerating ? 'animate-pulse' : ''}
          `}
          style={{
            background: isGenerating || !canGenerate ? undefined : `
              radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, 
                rgba(255, 255, 0, 0.3), 
                transparent 70%
              ),
              linear-gradient(to right, rgb(147, 51, 234), rgb(219, 39, 119))
            `
          }}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              <span className="animate-pulse">Generating...</span>
            </>
          ) : (
            <>
              <Icon className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
              {buttonText}
            </>
          )}
        </Button>
        
        {/* Ripple effect overlay */}
        <div className="absolute inset-0 rounded-md overflow-hidden pointer-events-none">
          <div className={`absolute inset-0 bg-white/20 rounded-full scale-0 ${
            isGenerating ? 'animate-ping' : ''
          }`} />
        </div>
      </div>
    </div>
  );
};

export default InpaintingGenerateButton;
