
import { useState } from 'react';
import Img2ImgImageInput from '@/components/img2img/Img2ImgImageInput';
import Img2ImgPromptSection from '@/components/img2img/Img2ImgPromptSection';
import Img2ImgModelSelection from '@/components/img2img/Img2ImgModelSelection';
import Img2ImgControls from '@/components/img2img/Img2ImgControls';
import Img2ImgPreview from '@/components/img2img/Img2ImgPreview';
import Img2ImgPostGeneration from '@/components/img2img/Img2ImgPostGeneration';

interface Img2ImgTabProps {
  onError: (message: string) => void;
}

const Img2ImgTab = ({ onError }: Img2ImgTabProps) => {
  // Image state
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Prompt state
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  
  // Model & Adapter state
  const [selectedModel, setSelectedModel] = useState('SD 1.5');
  const [selectedLora, setSelectedLora] = useState('');
  const [loraScale, setLoraScale] = useState(0.7);
  const [selectedControlNet, setSelectedControlNet] = useState('');
  const [controlNetEnabled, setControlNetEnabled] = useState(false);
  const [controlNetImage, setControlNetImage] = useState<File | null>(null);
  
  // Generation controls
  const [denoisingStrength, setDenoisingStrength] = useState(0.7);
  const [cfgScale, setCfgScale] = useState(7.5);
  const [inferenceSteps, setInferenceSteps] = useState(20);
  const [seed, setSeed] = useState<number | null>(null);
  const [autoDetectResolution, setAutoDetectResolution] = useState(true);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  
  // Preview state
  const [previewMode, setPreviewMode] = useState<'side-by-side' | 'overlay' | 'stacked'>('side-by-side');

  const handleGenerate = async () => {
    if (!inputImage || !prompt.trim()) {
      onError('Please provide an input image and prompt');
      return;
    }

    setIsGenerating(true);
    const startTime = Date.now();
    
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setGeneratedImage(inputImage); // Placeholder - would be actual generated result
      setGenerationTime((Date.now() - startTime) / 1000);
    } catch (error) {
      onError('Failed to generate img2img result');
    } finally {
      setIsGenerating(false);
    }
  };

  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          {/* Image Input */}
          <Img2ImgImageInput
            inputImage={inputImage}
            onImageChange={setInputImage}
            onError={onError}
          />

          {/* Prompt Section */}
          <Img2ImgPromptSection
            prompt={prompt}
            negativePrompt={negativePrompt}
            selectedStyle={selectedStyle}
            onPromptChange={setPrompt}
            onNegativePromptChange={setNegativePrompt}
            onStyleChange={setSelectedStyle}
          />

          {/* Model & Adapter Selection */}
          <Img2ImgModelSelection
            selectedModel={selectedModel}
            selectedLora={selectedLora}
            loraScale={loraScale}
            selectedControlNet={selectedControlNet}
            controlNetEnabled={controlNetEnabled}
            controlNetImage={controlNetImage}
            onModelChange={setSelectedModel}
            onLoraChange={setSelectedLora}
            onLoraScaleChange={setLoraScale}
            onControlNetChange={setSelectedControlNet}
            onControlNetEnabledChange={setControlNetEnabled}
            onControlNetImageChange={setControlNetImage}
            onError={onError}
          />

          {/* Generation Controls */}
          <Img2ImgControls
            denoisingStrength={denoisingStrength}
            cfgScale={cfgScale}
            inferenceSteps={inferenceSteps}
            seed={seed}
            autoDetectResolution={autoDetectResolution}
            onDenoisingStrengthChange={setDenoisingStrength}
            onCfgScaleChange={setCfgScale}
            onInferenceStepsChange={setInferenceSteps}
            onSeedChange={setSeed}
            onAutoDetectResolutionChange={setAutoDetectResolution}
            onRandomizeSeed={randomizeSeed}
            isGenerating={isGenerating}
            canGenerate={!!(inputImage && prompt.trim())}
            onGenerate={handleGenerate}
            generationTime={generationTime}
          />
        </div>

        {/* Right Column - Preview & Results */}
        <div className="space-y-6">
          {/* Preview */}
          <Img2ImgPreview
            inputImage={inputImage}
            generatedImage={generatedImage}
            isGenerating={isGenerating}
            previewMode={previewMode}
            onPreviewModeChange={setPreviewMode}
          />

          {/* Post-Generation Controls */}
          {generatedImage && (
            <Img2ImgPostGeneration
              generatedImage={generatedImage}
              prompt={prompt}
              settings={{
                denoisingStrength,
                cfgScale,
                inferenceSteps,
                seed,
                selectedLora,
                loraScale
              }}
              onError={onError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Img2ImgTab;
