
import { useState } from 'react';
import ImageInputSection from '@/components/inpainting/ImageInputSection';
import ModeSelector from '@/components/inpainting/ModeSelector';
import MaskingCanvas from '@/components/inpainting/MaskingCanvas';
import InpaintingPromptInput from '@/components/inpainting/InpaintingPromptInput';
import InpaintingAdvancedSettings from '@/components/inpainting/InpaintingAdvancedSettings';
import InpaintingGenerateButton from '@/components/inpainting/InpaintingGenerateButton';
import InpaintingResultSection from '@/components/inpainting/InpaintingResultSection';

interface InOutpaintingTabProps {
  generatedImage: string | null;
  onError: (message: string) => void;
}

const InOutpaintingTab = ({ generatedImage, onError }: InOutpaintingTabProps) => {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [mode, setMode] = useState<'inpainting' | 'outpainting'>('inpainting');
  const [maskData, setMaskData] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [steps, setSteps] = useState(20);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [seed, setSeed] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImages, setResultImages] = useState<{
    original: string | null;
    masked: string | null;
    generated: string | null;
  }>({
    original: null,
    masked: null,
    generated: null
  });

  const handleGenerate = async () => {
    if (!inputImage || !maskData || !prompt.trim()) {
      onError('Please provide an image, mask, and prompt');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setResultImages({
        original: inputImage,
        masked: maskData,
        generated: inputImage // Placeholder - would be actual generated result
      });
    } catch (error) {
      onError('Failed to generate inpainted image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Image Input */}
      <ImageInputSection
        inputImage={inputImage}
        onImageChange={setInputImage}
        generatedImage={generatedImage}
        onError={onError}
      />

      {/* Step 2: Mode Selector */}
      <ModeSelector
        mode={mode}
        onModeChange={setMode}
      />

      {/* Step 3: Masking Canvas */}
      {inputImage && (
        <MaskingCanvas
          inputImage={inputImage}
          mode={mode}
          onMaskChange={setMaskData}
        />
      )}

      {/* Step 4: Prompt Input */}
      <InpaintingPromptInput
        prompt={prompt}
        onPromptChange={setPrompt}
        mode={mode}
      />

      {/* Step 5: Advanced Settings */}
      <InpaintingAdvancedSettings
        steps={steps}
        guidanceScale={guidanceScale}
        seed={seed}
        onStepsChange={setSteps}
        onGuidanceScaleChange={setGuidanceScale}
        onSeedChange={setSeed}
      />

      {/* Step 6: Generate Button */}
      <InpaintingGenerateButton
        isGenerating={isGenerating}
        canGenerate={!!(inputImage && maskData && prompt.trim())}
        onGenerate={handleGenerate}
        mode={mode}
      />

      {/* Result Section */}
      <InpaintingResultSection
        resultImages={resultImages}
        isGenerating={isGenerating}
        mode={mode}
      />
    </div>
  );
};

export default InOutpaintingTab;
