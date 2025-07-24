import React, { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComfyUITabProps {
  onError: (message: string) => void;
}

interface WorkflowNode {
  inputs: Record<string, any>;
  class_type: string;
  _meta: {
    title: string;
  };
}

interface WorkflowJSON {
  [key: string]: WorkflowNode;
}

// const WORKFLOW_JSON: WorkflowJSON = {
//   "257": { 
//     "inputs": { 
//       "upscale_by": 2.0000000000000004, 
//       "seed": 536230148344323, 
//       "steps": 10, 
//       "cfg": 1, 
//       "sampler_name": "euler", 
//       "scheduler": "normal", 
//       "denoise": 0.02, 
//       "mode_type": "Chess", 
//       "tile_width": 1024, 
//       "tile_height": 1024, 
//       "mask_blur": 8, 
//       "tile_padding": 32, 
//       "seam_fix_mode": "None", 
//       "seam_fix_denoise": 1, 
//       "seam_fix_width": 64, 
//       "seam_fix_mask_blur": 8, 
//       "seam_fix_padding": 16, 
//       "force_uniform_tiles": true, 
//       "tiled_decode": false, 
//       "image": ["125", 0], 
//       "model": ["94", 0], 
//       "positive": ["33", 0], 
//       "negative": ["33", 0], 
//       "vae": ["41", 0], 
//       "upscale_model": ["118", 0] 
//     }, 
//     "class_type": "UltimateSDUpscale", 
//     "_meta": { "title": "Ultimate SD Upscale" } 
//   },
//   "258": { 
//     "inputs": { "images": ["257", 0] }, 
//     "class_type": "PreviewImage", 
//     "_meta": { "title": "Preview Image" } 
//   },
//   "259": { 
//     "inputs": { 
//       "model_type": "flux", 
//       "rel_l1_thresh": 0.4, 
//       "start_percent": 0, 
//       "end_percent": 1, 
//       "cache_device": "cuda", 
//       "model": ["20", 0] 
//     }, 
//     "class_type": "TeaCache", 
//     "_meta": { "title": "TeaCache" } 
//   }
// };
const WORKFLOW_JSON = {
          "18": { "inputs": { "image": "clipspace/clipspace-mask-556781.3999999985.png [input]" }, "class_type": "LoadImage", "_meta": { "title": "Load destination (right-click to mask the area)" } },
          "19": { "inputs": { "width": ["101", 0], "height": ["101", 1], "position": "right-center", "x_offset": 0, "y_offset": 0, "image": ["100", 0] }, "class_type": "ImageCrop+", "_meta": { "title": "🔧 Image Crop" } },
          "20": { "inputs": { "unet_name": "flux1-fill-dev-fp8.safetensors", "weight_dtype": "default" }, "class_type": "UNETLoader", "_meta": { "title": "Load Diffusion Model" } },
          "22": { "inputs": { "image": ["61", 0] }, "class_type": "GetImageSize+", "_meta": { "title": "🔧 Get Image Size" } },
          "23": { "inputs": { "panel_width": ["22", 0], "panel_height": ["22", 1], "fill_color": "black", "fill_color_hex": "#000000" }, "class_type": "CR Color Panel", "_meta": { "title": "🌁 CR Color Panel" } },
          "26": { "inputs": { "clip_name1": "t5xxl_fp8_e4m3fn.safetensors", "clip_name2": "clip_l.safetensors", "type": "flux", "device": "cpu" }, "class_type": "DualCLIPLoader", "_meta": { "title": "DualCLIPLoader" } },
          "27": { "inputs": { "text": "a photograph of a watch on a hand, masterpiece, best quality, 8k uhd, sharp focus, professional lighting, photorealism" }, "class_type": "Text Multiline", "_meta": { "title": "Prompt 1" } },
          "29": { "inputs": { "delimiter": ", ", "clean_whitespace": "true", "text_a": ["86", 0], "text_b": ["31", 0], "text_c": ["27", 0] }, "class_type": "Text Concatenate", "_meta": { "title": "Text Concatenate" } },
          "31": { "inputs": { "style1": "None", "style2": "None", "style3": "None", "style4": "None" }, "class_type": "Prompt Multiple Styles Selector", "_meta": { "title": "Prompt Multiple Styles Selector" } },
          "33": { "inputs": { "guidance": 30, "conditioning": ["55", 0] }, "class_type": "FluxGuidance", "_meta": { "title": "FluxGuidance" } },
          "34": { "inputs": { "model": ["94", 0], "conditioning": ["33", 0] }, "class_type": "BasicGuider", "_meta": { "title": "BasicGuider" } },
          "37": { "inputs": { "image": "pngtree-transparent-watch-elegant-png-image_14021451.png" }, "class_type": "LoadImage", "_meta": { "title": "Insert object" } },
          "40": { "inputs": { "sampler_name": "dpmpp_2m" }, "class_type": "KSamplerSelect", "_meta": { "title": "KSamplerSelect" } },
          "41": { "inputs": { "vae_name": "ae.safetensors" }, "class_type": "VAELoader", "_meta": { "title": "Load VAE" } },
          "42": { "inputs": { "clip_name": "model.safetensors" }, "class_type": "CLIPVisionLoader", "_meta": { "title": "Load CLIP Vision" } },
          "44": { "inputs": { "style_model_name": "flux1-redux-dev.safetensors" }, "class_type": "StyleModelLoader", "_meta": { "title": "Load Style Model" } },
          "46": { "inputs": { "direction": "right", "match_image_size": false, "image1": ["23", 0], "image2": ["65", 0] }, "class_type": "ImageConcanate", "_meta": { "title": "Image Concatenate" } },
          "47": { "inputs": { "channel": "red", "image": ["46", 0] }, "class_type": "ImageToMask", "_meta": { "title": "Convert Image to Mask" } },
          "48": { "inputs": { "expand": 8, "incremental_expandrate": 0, "tapered_corners": false, "flip_input": false, "blur_radius": 8, "lerp_alpha": 1, "decay_factor": 1, "fill_holes": false, "mask": ["47", 0] }, "class_type": "GrowMaskWithBlur", "_meta": { "title": "Grow Mask With Blur" } },
          "50": { "inputs": { "images": ["46", 0] }, "class_type": "PreviewImage", "_meta": { "title": "Preview Image" } },
          "52": { "inputs": { "direction": "right", "match_image_size": false, "image1": ["61", 0], "image2": ["92", 1] }, "class_type": "ImageConcanate", "_meta": { "title": "Image Concatenate" } },
          "55": { "inputs": { "noise_mask": false, "positive": ["70", 0], "negative": ["70", 0], "vae": ["41", 0], "pixels": ["52", 0], "mask": ["48", 0] }, "class_type": "InpaintModelConditioning", "_meta": { "title": "InpaintModelConditioning" } },
          "57": { "inputs": { "PowerLoraLoaderHeaderWidget": { "type": "PowerLoraLoaderHeaderWidget" }, "➕ Add Lora": "", "model": ["259", 0], "clip": ["26", 0] }, "class_type": "Power Lora Loader (rgthree)", "_meta": { "title": "Power Lora Loader (rgthree)" } },
          "61": { "inputs": { "width": 16384, "height": ["64", 1], "interpolation": "lanczos", "method": "keep proportion", "condition": "always", "multiple_of": 0, "image": ["37", 0] }, "class_type": "ImageResize+", "_meta": { "title": "🔧 Image Resize" } },
          "64": { "inputs": { "image": ["92", 1] }, "class_type": "GetImageSize+", "_meta": { "title": "🔧 Get Image Size" } },
          "65": { "inputs": { "mask": ["92", 2] }, "class_type": "MaskToImage", "_meta": { "title": "Convert Mask to Image" } },
          "69": { "inputs": { "filename_prefix": "ComfyUI", "images": ["125", 0] }, "class_type": "SaveImage", "_meta": { "title": "Save Image" } },
          "70": { "inputs": { "conditioning_to": ["89", 0], "conditioning_from": ["244", 0] }, "class_type": "ConditioningConcat", "_meta": { "title": "Conditioning (Concat)" } },
          "84": { "inputs": { "images": ["52", 0] }, "class_type": "PreviewImage", "_meta": { "title": "Preview Image" } },
          "86": { "inputs": { "text": "" }, "class_type": "Text Multiline", "_meta": { "title": "Additional prompt" } },
          "89": { "inputs": { "text": ["29", 0], "clip": ["57", 1] }, "class_type": "CLIPTextEncode", "_meta": { "title": "CLIP Text Encode (Prompt)" } },
          "90": { "inputs": { "crop": "none", "clip_vision": ["42", 0], "image": ["61", 0] }, "class_type": "CLIPVisionEncode", "_meta": { "title": "CLIP Vision Encode" } },
          "92": { "inputs": { "context_expand_pixels": 20, "context_expand_factor": 1.2, "fill_mask_holes": true, "blur_mask_pixels": 8, "invert_mask": false, "blend_pixels": 8, "rescale_algorithm": "bicubic", "mode": "ranged size", "force_width": 1024, "force_height": 1024, "rescale_factor": 1, "min_width": 1, "min_height": 720, "max_width": 16384, "max_height": 720, "padding": 128, "image": ["18", 0], "mask": ["18", 1] }, "class_type": "InpaintCrop", "_meta": { "title": "(OLD 💀, use the new ✂️ Inpaint Crop node)" } },
          "93": { "inputs": { "model": ["57", 0] }, "class_type": "DifferentialDiffusion", "_meta": { "title": "Differential Diffusion" } },
          "94": { "inputs": { "max_shift": 1.15, "base_shift": 0.5, "width": ["97", 0], "height": ["97", 1], "model": ["93", 0] }, "class_type": "ModelSamplingFlux", "_meta": { "title": "ModelSamplingFlux" } },
          "97": { "inputs": { "image": ["52", 0] }, "class_type": "GetImageSize+", "_meta": { "title": "🔧 Get Image Size" } },
          "99": { "inputs": { "width": ["101", 0], "height": ["101", 1], "position": "right-center", "x_offset": 0, "y_offset": 0, "image": ["106", 0] }, "class_type": "ImageCrop+", "_meta": { "title": "🔧 Image Crop" } },
          "100": { "inputs": { "mask": ["48", 0] }, "class_type": "MaskToImage", "_meta": { "title": "Convert Mask to Image" } },
          "101": { "inputs": { "image": ["92", 1] }, "class_type": "GetImageSize+", "_meta": { "title": "🔧 Get Image Size" } },
          "106": { "inputs": { "samples": ["110", 0], "vae": ["41", 0] }, "class_type": "VAEDecode", "_meta": { "title": "VAE Decode" } },
          "107": { "inputs": { "channel": "red", "image": ["19", 0] }, "class_type": "ImageToMask", "_meta": { "title": "Convert Image to Mask" } },
          "109": { "inputs": { "rgthree_comparer": { "images": [ { "name": "A", "selected": true, "url": "/api/view?filename=rgthree.compare._temp_pdrhl_00013_.png&type=temp&subfolder=&rand=0.5100185779328218" }, { "name": "B", "selected": true, "url": "/api/view?filename=rgthree.compare._temp_pdrhl_00014_.png&type=temp&subfolder=&rand=0.35677228073625544" } ] }, "image_a": ["125", 0], "image_b": ["18", 0] }, "class_type": "Image Comparer (rgthree)", "_meta": { "title": "Image Comparer (rgthree)" } },
          "110": { "inputs": { "noise": ["116", 0], "guider": ["34", 0], "sampler": ["40", 0], "sigmas": ["129", 0], "latent_image": ["55", 2] }, "class_type": "SamplerCustomAdvanced", "_meta": { "title": "SamplerCustomAdvanced" } },
          "116": { "inputs": { "noise_seed": 1081117773832272 }, "class_type": "RandomNoise", "_meta": { "title": "RandomNoise" } },
          "118": { "inputs": { "model_name": "4x_NMKD-Siax_200k.pth" }, "class_type": "UpscaleModelLoader", "_meta": { "title": "Load Upscale Model" } },
          "120": { "inputs": { "brightness": 1.05, "contrast": 0.98, "saturation": 1.05, "image": ["99", 0] }, "class_type": "LayerColor: BrightnessContrastV2", "_meta": { "title": "LayerColor: Brightness Contrast V2" } },
          "121": { "inputs": { "upscale_by": 1.0000000000000002, "seed": 547228319685011, "steps": 10, "cfg": 1, "sampler_name": "euler", "scheduler": "normal", "denoise": 0.02, "mode_type": "Chess", "tile_width": 1024, "tile_height": 1024, "mask_blur": 8, "tile_padding": 32, "seam_fix_mode": "None", "seam_fix_denoise": 1, "seam_fix_width": 64, "seam_fix_mask_blur": 8, "seam_fix_padding": 16, "force_uniform_tiles": true, "tiled_decode": false, "image": ["123", 0], "model": ["94", 0], "positive": ["33", 0], "negative": ["33", 0], "vae": ["41", 0], "upscale_model": ["118", 0] }, "class_type": "UltimateSDUpscale", "_meta": { "title": "Ultimate SD Upscale" } },
          "123": { "inputs": { "x": 0, "y": 0, "resize_source": false, "destination": ["92", 1], "source": ["120", 0], "mask": ["107", 0] }, "class_type": "ImageCompositeMasked", "_meta": { "title": "ImageCompositeMasked" } },
          "125": { "inputs": { "rescale_algorithm": "bislerp", "stitch": ["92", 0], "inpainted_image": ["121", 0] }, "class_type": "InpaintStitch", "_meta": { "title": "(OLD 💀, use the new ✂️ Inpaint Stitch node)" } },
          "129": { "inputs": { "scheduler": "sgm_uniform", "steps": 20, "denoise": 1, "model": ["94", 0] }, "class_type": "BasicScheduler", "_meta": { "title": "BasicScheduler" } },
          "244": { "inputs": { "image_strength": "high", "conditioning": ["89", 0], "style_model": ["44", 0], "clip_vision_output": ["90", 0] }, "class_type": "StyleModelApplySimple", "_meta": { "title": "StyleModelApplySimple" } },
          "250": { "inputs": { "images": ["123", 0] }, "class_type": "PreviewImage", "_meta": { "title": "Preview Image" } },
          "254": { "inputs": { "images": ["121", 0] }, "class_type": "PreviewImage", "_meta": { "title": "Preview Image" } },
          "257": { "inputs": { "upscale_by": 2.0000000000000004, "seed": 536230148344323, "steps": 10, "cfg": 1, "sampler_name": "euler", "scheduler": "normal", "denoise": 0.02, "mode_type": "Chess", "tile_width": 1024, "tile_height": 1024, "mask_blur": 8, "tile_padding": 32, "seam_fix_mode": "None", "seam_fix_denoise": 1, "seam_fix_width": 64, "seam_fix_mask_blur": 8, "seam_fix_padding": 16, "force_uniform_tiles": true, "tiled_decode": false, "image": ["125", 0], "model": ["94", 0], "positive": ["33", 0], "negative": ["33", 0], "vae": ["41", 0], "upscale_model": ["118", 0] }, "class_type": "UltimateSDUpscale", "_meta": { "title": "Ultimate SD Upscale" } },
          "258": { "inputs": { "images": ["257", 0] }, "class_type": "PreviewImage", "_meta": { "title": "Preview Image" } },
          "259": { "inputs": { "model_type": "flux", "rel_l1_thresh": 0.4, "start_percent": 0, "end_percent": 1, "cache_device": "cuda", "model": ["20", 0] }, "class_type": "TeaCache", "_meta": { "title": "TeaCache" } }
        };
const ComfyUITab: React.FC<ComfyUITabProps> = ({ onError }) => {
  const [ngrokUrl, setNgrokUrl] = useState('');
  const [prompt, setPrompt] = useState('a photograph of a watch on a hand, masterpiece, best quality, 8k uhd, sharp focus, professional lighting, photorealism');
  const [destinationImage, setDestinationImage] = useState<File | null>(null);
  const [objectImage, setObjectImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('Status: Waiting for input...');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const destFileRef = useRef<HTMLInputElement>(null);
  const objFileRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const { toast } = useToast();

  const updateStatus = useCallback((message: string, isError = false) => {
    console.log(message);
    setStatus(message);
    if (isError) {
      onError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  }, [onError, toast]);

  const uploadImage = async (apiUrl: string, file: File): Promise<{ name: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('overwrite', 'true');
    formData.append('type', 'input');

    updateStatus(`Uploading ${file.name}...`);
    const response = await fetch(`${apiUrl}/upload/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error(`Failed to upload ${file.name}`);
    return response.json();
  };

  const getModifiedWorkflow = (workflow: WorkflowJSON, promptText: string, destinationImageName: string, objectImageName: string): WorkflowJSON => {
    const updatedWorkflow = JSON.parse(JSON.stringify(workflow));

    let promptNodeId: string | null = null;
    let destinationNodeId: string | null = null;
    let objectNodeId: string | null = null;

    for (const id in updatedWorkflow) {
      if (updatedWorkflow[id]._meta?.title === "Prompt 1") promptNodeId = id;
      if (updatedWorkflow[id]._meta?.title === "Load destination (right-click to mask the area)") destinationNodeId = id;
      if (updatedWorkflow[id]._meta?.title === "Insert object") objectNodeId = id;
    }

    if (promptNodeId) updatedWorkflow[promptNodeId].inputs.text = promptText;
    if (destinationNodeId) updatedWorkflow[destinationNodeId].inputs.image = destinationImageName;
    if (objectNodeId) updatedWorkflow[objectNodeId].inputs.image = objectImageName;

    return updatedWorkflow;
  };

  const queuePrompt = (apiUrl: string, clientId: string, workflowObject: WorkflowJSON) => {
    const payload = {
      client_id: clientId,
      prompt: workflowObject,
    };
    
    updateStatus('Queueing prompt...');
    return fetch(`${apiUrl}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  const startGeneration = async () => {
    if (!ngrokUrl || !prompt || !destinationImage || !objectImage) {
      updateStatus('Error: Please fill all fields and select both images.', true);
      return;
    }

    setIsGenerating(true);
    setResultImage(null);
    setProgress(0);

    try {
      const destFileInfo = await uploadImage(ngrokUrl, destinationImage);
      const objFileInfo = await uploadImage(ngrokUrl, objectImage);
      updateStatus('Uploads complete. Preparing workflow...');

      const modifiedWorkflow = getModifiedWorkflow(WORKFLOW_JSON, prompt, destFileInfo.name, objFileInfo.name);
      
      const clientId = Math.random().toString(36).substring(7);
      const wsUrl = ngrokUrl.replace('https', 'wss');
      
      wsRef.current = new WebSocket(`${wsUrl}/ws?clientId=${clientId}`);

      wsRef.current.onopen = () => {
        queuePrompt(ngrokUrl, clientId, modifiedWorkflow);
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'progress') {
          const { value, max } = data.data;
          const progressValue = Math.round((value / max) * 100);
          setProgress(progressValue);
          updateStatus(`Generating... ${progressValue}%`);
        } else if (data.type === 'executed') {
          updateStatus('Execution complete! Fetching image...');
          const output = data.data.output;
          
          let finalImageNodeOutput = null;
          if (output.images && output.images.length > 0) {
            finalImageNodeOutput = output;
          } else {
            finalImageNodeOutput = output['125'] || output['258'] || output['69'] || Object.values(output).find((o: any) => o.images);
          }

          if (finalImageNodeOutput && finalImageNodeOutput.images && finalImageNodeOutput.images.length > 0) {
            const finalImage = finalImageNodeOutput.images[0]; 
            const imageUrl = `${ngrokUrl}/view?filename=${encodeURIComponent(finalImage.filename)}&subfolder=${encodeURIComponent(finalImage.subfolder)}&type=${finalImage.type}`;
            
            setResultImage(imageUrl);
            updateStatus('Done!');
            setProgress(100);
          } else {
            updateStatus('Error: Could not find final image in output.\n\nFull output:\n' + JSON.stringify(output, null, 2), true);
            console.log("Full output:", output);
          }
          wsRef.current?.close();
        } else if (data.type === 'execution_error') {
          updateStatus(`Server Error: ${JSON.stringify(data.data)}`, true);
        }
      };
      
      wsRef.current.onclose = () => {
        setIsGenerating(false);
      };

      wsRef.current.onerror = (err) => {
        updateStatus('WebSocket error. Check console for details.', true);
        console.error('WebSocket Error:', err);
        setIsGenerating(false);
      };

    } catch (error) {
      updateStatus(`An error occurred: ${(error as Error).message}`, true);
      console.error(error);
      setIsGenerating(false);
    }
  };

  const handleDestinationImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDestinationImage(file);
  };

  const handleObjectImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setObjectImage(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="bg-black/40 border-primary/20 backdrop-blur-sm">
        <CardHeader className="border-b border-primary/10">
          <CardTitle className="text-primary flex items-center gap-2">
            ComfyUI Frontend Connector
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="ngrok-url" className="text-foreground">Ngrok URL</Label>
              <Input
                id="ngrok-url"
                type="text"
                placeholder="e.g., https://your-id.ngrok-free.app"
                value={ngrokUrl}
                onChange={(e) => setNgrokUrl(e.target.value)}
                className="bg-black/20 border-primary/20 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-foreground">Text Prompt</Label>
              <Textarea
                id="prompt"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-black/20 border-primary/20 text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="destination-image" className="text-foreground">Destination Image (with mask)</Label>
                <div className="relative">
                  <Input
                    ref={destFileRef}
                    id="destination-image"
                    type="file"
                    accept="image/*"
                    onChange={handleDestinationImageChange}
                    className="bg-black/20 border-primary/20 text-foreground file:bg-primary file:text-primary-foreground file:border-0 file:rounded-sm file:px-3 file:py-1"
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                {destinationImage && (
                  <p className="text-sm text-muted-foreground">Selected: {destinationImage.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="object-image" className="text-foreground">Object to Insert</Label>
                <div className="relative">
                  <Input
                    ref={objFileRef}
                    id="object-image"
                    type="file"
                    accept="image/*"
                    onChange={handleObjectImageChange}
                    className="bg-black/20 border-primary/20 text-foreground file:bg-primary file:text-primary-foreground file:border-0 file:rounded-sm file:px-3 file:py-1"
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                {objectImage && (
                  <p className="text-sm text-muted-foreground">Selected: {objectImage.name}</p>
                )}
              </div>
            </div>

            <Button
              onClick={startGeneration}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Generate Image'
              )}
            </Button>

            {/* Status Display */}
            <div className="bg-black/20 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Status</span>
                {isGenerating && progress > 0 && (
                  <span className="text-sm text-primary">{progress}%</span>
                )}
              </div>
              {isGenerating && progress > 0 && (
                <div className="w-full bg-black/30 rounded-full h-2 mb-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground font-mono whitespace-pre-wrap">
                {status}
              </p>
            </div>

            {/* Result Display */}
            {resultImage && (
              <Card className="bg-black/20 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={resultImage}
                    alt="Generated Image"
                    className="w-full rounded-lg border border-primary/20"
                    onLoad={() => {
                      toast({
                        title: "Success",
                        description: "Image generated successfully!",
                      });
                    }}
                    onError={() => {
                      updateStatus('Error loading generated image', true);
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComfyUITab;
