
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Upload, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { useRef, useState } from "react";

interface Img2ImgModelSelectionProps {
  selectedModel: string;
  selectedLora: string;
  loraScale: number;
  selectedControlNet: string;
  controlNetEnabled: boolean;
  controlNetImage: File | null;
  onModelChange: (model: string) => void;
  onLoraChange: (lora: string) => void;
  onLoraScaleChange: (scale: number) => void;
  onControlNetChange: (controlNet: string) => void;
  onControlNetEnabledChange: (enabled: boolean) => void;
  onControlNetImageChange: (file: File | null) => void;
  onError: (message: string) => void;
}

const baseModels = [
  { value: 'SD 1.5', label: 'Stable Diffusion 1.5' },
  { value: 'SDXL', label: 'Stable Diffusion XL' },
  { value: 'SD 2.1', label: 'Stable Diffusion 2.1' }
];

const loraOptions = [
  { value: 'none', label: 'None' },
  { value: 'anime-style', label: 'Anime Style' },
  { value: 'portrait-enhance', label: 'Portrait Enhance' },
  { value: 'landscape-boost', label: 'Landscape Boost' }
];

const controlNetOptions = [
  { value: 'none', label: 'None' },
  { value: 'canny', label: 'Canny Edge' },
  { value: 'depth', label: 'Depth Map' },
  { value: 'pose', label: 'Pose Detection' },
  { value: 'normal', label: 'Normal Map' }
];

const Img2ImgModelSelection = ({
  selectedModel,
  selectedLora,
  loraScale,
  selectedControlNet,
  controlNetEnabled,
  controlNetImage,
  onModelChange,
  onLoraChange,
  onLoraScaleChange,
  onControlNetChange,
  onControlNetEnabledChange,
  onControlNetImageChange,
  onError
}: Img2ImgModelSelectionProps) => {
  const controlNetFileRef = useRef<HTMLInputElement>(null);
  const [isAutoGenExpanded, setIsAutoGenExpanded] = useState(false);
  const [autoGenSteps, setAutoGenSteps] = useState(4);
  const [autoGenSeed, setAutoGenSeed] = useState<string>('');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [autoGenError, setAutoGenError] = useState<string>('');

  const handleControlNetFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        onControlNetImageChange(file);
      } else {
        onError('Please select a valid image file for ControlNet');
      }
    }
  };

  const handleAutoGenerate = async () => {
    setIsAutoGenerating(true);
    setAutoGenError('');

    try {
      const formData = new FormData();
      formData.append('prompt', 'Sample prompt'); // This would come from parent component
      formData.append('num_inference_steps', autoGenSteps.toString());
      if (autoGenSeed.trim()) {
        formData.append('seed', autoGenSeed);
      }
      formData.append('include_metadata', includeMetadata.toString());

      const response = await fetch('/generate-image-automatic/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Generation failed: ${errorText}`);
      }

      const result = await response.json();
      console.log('Auto generation result:', result);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Auto generation failed';
      setAutoGenError(errorMessage);
    } finally {
      setIsAutoGenerating(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Model & Adapter Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Base Model */}
        <div className="space-y-2">
          <Label className="text-slate-300">Base Model</Label>
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {baseModels.map((model) => (
                <SelectItem 
                  key={model.value} 
                  value={model.value}
                  className="text-white hover:bg-slate-700"
                >
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* LoRA Section */}
        <div className="space-y-3">
          <Label className="text-slate-300">LoRA Adapter</Label>
          <Select value={selectedLora} onValueChange={onLoraChange}>
            <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
              <SelectValue placeholder="Select LoRA..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {loraOptions.map((lora) => (
                <SelectItem 
                  key={lora.value} 
                  value={lora.value}
                  className="text-white hover:bg-slate-700"
                >
                  {lora.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedLora && selectedLora !== 'none' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-400 text-sm">LoRA Scale</Label>
                <span className="text-slate-400 text-sm">{loraScale.toFixed(1)}</span>
              </div>
              <Slider
                value={[loraScale]}
                onValueChange={(value) => onLoraScaleChange(value[0])}
                min={0.1}
                max={1.0}
                step={0.1}
                className="cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* ControlNet Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">ControlNet</Label>
            <Switch
              checked={controlNetEnabled}
              onCheckedChange={onControlNetEnabledChange}
            />
          </div>
          
          {controlNetEnabled && (
            <>
              <Select value={selectedControlNet} onValueChange={onControlNetChange}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select ControlNet module..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {controlNetOptions.map((controlNet) => (
                    <SelectItem 
                      key={controlNet.value} 
                      value={controlNet.value}
                      className="text-white hover:bg-slate-700"
                    >
                      {controlNet.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedControlNet && selectedControlNet !== 'none' && (
                <div className="space-y-2">
                  <Label className="text-slate-400 text-sm">ControlNet Conditioning Image</Label>
                  <Button
                    onClick={() => controlNetFileRef.current?.click()}
                    variant="outline"
                    className="w-full bg-slate-700 border-slate-600"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {controlNetImage ? controlNetImage.name : 'Upload ControlNet Image'}
                  </Button>
                  <input
                    ref={controlNetFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleControlNetFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Automatic Generation Panel */}
        <div className="border-t border-slate-600 pt-4">
          <Button
            onClick={() => setIsAutoGenExpanded(!isAutoGenExpanded)}
            variant="ghost"
            className="w-full flex items-center justify-between p-3 h-auto text-white hover:bg-slate-700/50 rounded-lg transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">⚙️ Automatic Generation</span>
            </div>
            {isAutoGenExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </Button>

          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isAutoGenExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
              {/* Number of Steps */}
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Number of Steps</Label>
                <Input
                  type="number"
                  value={autoGenSteps}
                  onChange={(e) => setAutoGenSteps(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="bg-slate-900/50 border-slate-600 text-white"
                />
              </div>

              {/* Seed */}
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Seed</Label>
                <Input
                  type="text"
                  value={autoGenSeed}
                  onChange={(e) => setAutoGenSeed(e.target.value)}
                  placeholder="Leave blank for random"
                  className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              {/* Metadata Toggle */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-metadata"
                  checked={includeMetadata}
                  onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
                />
                <Label htmlFor="include-metadata" className="text-slate-300 text-sm">
                  Include metadata
                </Label>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleAutoGenerate}
                disabled={isAutoGenerating}
                className="w-full bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-colors duration-300"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isAutoGenerating ? 'Generating...' : 'Generate Automatically'}
              </Button>

              {/* Error Display */}
              {autoGenError && (
                <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-800">
                  {autoGenError}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Img2ImgModelSelection;
