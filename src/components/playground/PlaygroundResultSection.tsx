
import ImageDisplay from "../ImageDisplay";
import GenerateButton from "../GenerateButton";

interface PlaygroundResultSectionProps {
  isGenerating: boolean;
  generatedImage: string | null;
  onImageLoad: () => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  showSuccess: boolean;
  onGenerate: () => void;
  prompt: string;
}

const PlaygroundResultSection = ({
  isGenerating,
  generatedImage,
  onImageLoad,
  onImageError,
  showSuccess,
  onGenerate,
  prompt
}: PlaygroundResultSectionProps) => {
  return (
    <div
  className="fixed z-[999] bg-[#1e1e2f] rounded-[10px] shadow-lg space-y-6 scale-[0.82] scale-x-[0.95]"
  style={{
    top: '130px',      // precise vertical position
    right: '80px',     // precise horizontal position
    width: '630px',    // fixed width
    padding: '10px',   // consistent padding
  }}
    >
      <ImageDisplay
        isGenerating={isGenerating}
        generatedImage={generatedImage}
        onImageLoad={onImageLoad}
        onImageError={onImageError}
      />
      
      <GenerateButton
        isGenerating={isGenerating}
        canGenerate={prompt.trim() !== ''}
        showSuccess={showSuccess}
        onGenerate={onGenerate}
      />
    </div>
  );
};

export default PlaygroundResultSection;
