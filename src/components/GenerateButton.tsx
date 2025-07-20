
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Check } from "lucide-react";

interface GenerateButtonProps {
  isGenerating: boolean;
  canGenerate: boolean;
  showSuccess: boolean;
  onGenerate: () => void;
}

const GenerateButton = ({ isGenerating, canGenerate, showSuccess, onGenerate }: GenerateButtonProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="relative">
      <Button 
        onClick={onGenerate}
        onMouseMove={handleMouseMove}
        disabled={isGenerating || !canGenerate}
        className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 
          transition-all duration-300 hover:scale-105 hover:shadow-[var(--gradient-glow)]
          active:scale-95 disabled:hover:scale-100 disabled:hover:shadow-none
          relative overflow-hidden border border-primary/20
          ${isGenerating ? 'animate-pulse' : ''}
        `}
        style={{
          background: isGenerating || !canGenerate ? undefined : `
            radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, 
              hsl(258 100% 80% / 0.3), 
              transparent 70%
            ),
            hsl(var(--primary))
          `,
          boxShadow: !isGenerating && canGenerate ? 'var(--gradient-glow)' : undefined
        }}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <span className="animate-pulse">Generating...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
            Generate
          </>
        )}
      </Button>
      
      {/* Ripple effect overlay */}
      <div className="absolute inset-0 rounded-md overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 bg-white/20 rounded-full scale-0 ${
          isGenerating ? 'animate-ping' : ''
        }`} />
      </div>

      {/* Success checkmark */}
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-md animate-in fade-in-0 duration-300">
          <Check className="w-6 h-6 text-green-400 animate-in scale-in-0 duration-500" />
        </div>
      )}
    </div>
  );
};

export default GenerateButton;
