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

const WORKFLOW_JSON: WorkflowJSON = {
  "257": { 
    "inputs": { 
      "upscale_by": 2.0000000000000004, 
      "seed": 536230148344323, 
      "steps": 10, 
      "cfg": 1, 
      "sampler_name": "euler", 
      "scheduler": "normal", 
      "denoise": 0.02, 
      "mode_type": "Chess", 
      "tile_width": 1024, 
      "tile_height": 1024, 
      "mask_blur": 8, 
      "tile_padding": 32, 
      "seam_fix_mode": "None", 
      "seam_fix_denoise": 1, 
      "seam_fix_width": 64, 
      "seam_fix_mask_blur": 8, 
      "seam_fix_padding": 16, 
      "force_uniform_tiles": true, 
      "tiled_decode": false, 
      "image": ["125", 0], 
      "model": ["94", 0], 
      "positive": ["33", 0], 
      "negative": ["33", 0], 
      "vae": ["41", 0], 
      "upscale_model": ["118", 0] 
    }, 
    "class_type": "UltimateSDUpscale", 
    "_meta": { "title": "Ultimate SD Upscale" } 
  },
  "258": { 
    "inputs": { "images": ["257", 0] }, 
    "class_type": "PreviewImage", 
    "_meta": { "title": "Preview Image" } 
  },
  "259": { 
    "inputs": { 
      "model_type": "flux", 
      "rel_l1_thresh": 0.4, 
      "start_percent": 0, 
      "end_percent": 1, 
      "cache_device": "cuda", 
      "model": ["20", 0] 
    }, 
    "class_type": "TeaCache", 
    "_meta": { "title": "TeaCache" } 
  }
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