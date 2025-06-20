
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
    <div className="space-y-6">
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
