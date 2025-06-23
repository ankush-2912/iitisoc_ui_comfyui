
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brush, Eraser, RotateCcw, Undo2, Redo2, Eye, EyeOff, ZoomIn, ZoomOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MaskingCanvasProps {
  inputImage: string;
  mode: 'inpainting' | 'outpainting';
  onMaskChange: (maskData: string | null) => void;
}

const MaskingCanvas = ({ inputImage, mode, onMaskChange }: MaskingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState(20);
  const [showMask, setShowMask] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Canvas size controls for outpainting
  const [canvasWidth, setCanvasWidth] = useState(512);
  const [canvasHeight, setCanvasHeight] = useState(512);
  const [extensionPadding, setExtensionPadding] = useState(128);
  const [originalImageDimensions, setOriginalImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (canvasRef.current && inputImage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        setOriginalImageDimensions({ width: img.width, height: img.height });
        
        if (mode === 'outpainting') {
          // For outpainting, create extended canvas
          const extendedWidth = img.width + (extensionPadding * 2);
          const extendedHeight = img.height + (extensionPadding * 2);
          
          canvas.width = extendedWidth;
          canvas.height = extendedHeight;
          setCanvasWidth(extendedWidth);
          setCanvasHeight(extendedHeight);
          
          // Clear canvas and draw image in center
          ctx.fillStyle = '#1e1e2f';
          ctx.fillRect(0, 0, extendedWidth, extendedHeight);
          ctx.drawImage(img, extensionPadding, extensionPadding);
          
          // Draw extension area indicators
          ctx.strokeStyle = 'rgba(147, 51, 234, 0.5)';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(extensionPadding, extensionPadding, img.width, img.height);
        } else {
          // For inpainting, use original image size
          canvas.width = img.width;
          canvas.height = img.height;
          setCanvasWidth(img.width);
          setCanvasHeight(img.height);
          ctx.drawImage(img, 0, 0);
        }
        
        saveToHistory();
      };
      img.src = inputImage;
    }
  }, [inputImage, mode, extensionPadding]);

  const saveToHistory = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(dataUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onMaskChange(dataUrl);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      restoreFromHistory(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      restoreFromHistory(historyIndex + 1);
    }
  };

  const restoreFromHistory = (index: number) => {
    if (!canvasRef.current || !history[index]) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      onMaskChange(canvas.toDataURL());
    };
    img.src = history[index];
  };

  const resetMask = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      if (mode === 'outpainting') {
        const extendedWidth = originalImageDimensions.width + (extensionPadding * 2);
        const extendedHeight = originalImageDimensions.height + (extensionPadding * 2);
        
        canvas.width = extendedWidth;
        canvas.height = extendedHeight;
        
        ctx.fillStyle = '#1e1e2f';
        ctx.fillRect(0, 0, extendedWidth, extendedHeight);
        ctx.drawImage(img, extensionPadding, extensionPadding);
        
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(extensionPadding, extensionPadding, originalImageDimensions.width, originalImageDimensions.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      saveToHistory();
    };
    img.src = inputImage;
  };

  const updateCanvasSize = () => {
    if (!canvasRef.current || mode !== 'outpainting') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save current canvas state
    const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Resize canvas
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Restore image data (centered)
    const offsetX = (canvasWidth - originalImageDimensions.width) / 2;
    const offsetY = (canvasHeight - originalImageDimensions.height) / 2;
    
    ctx.fillStyle = '#1e1e2f';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, offsetX, offsetY);
      saveToHistory();
    };
    img.src = inputImage;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    ctx.globalCompositeOperation = tool === 'brush' ? 'source-over' : 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = tool === 'brush' ? 'rgba(255, 0, 0, 0.5)' : 'transparent';
    ctx.fill();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brush className="w-5 h-5" />
          Step 3: Masking Canvas
          <Badge variant="secondary" className="ml-auto bg-slate-700 text-slate-300">
            {mode === 'inpainting' ? 'Paint areas to replace' : 'Paint areas to extend'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Canvas Size Controls for Outpainting */}
        {mode === 'outpainting' && (
          <Card className="bg-slate-900/50 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Canvas Size Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">Canvas Width</Label>
                  <Input
                    type="number"
                    value={canvasWidth}
                    onChange={(e) => setCanvasWidth(parseInt(e.target.value) || 512)}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">Canvas Height</Label>
                  <Input
                    type="number"
                    value={canvasHeight}
                    onChange={(e) => setCanvasHeight(parseInt(e.target.value) || 512)}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 text-sm">Extension Padding</Label>
                  <span className="text-slate-400 text-sm">{extensionPadding}px</span>
                </div>
                <Slider
                  value={[extensionPadding]}
                  onValueChange={(value) => setExtensionPadding(value[0])}
                  min={64}
                  max={256}
                  step={32}
                  className="cursor-pointer"
                />
              </div>
              
              <Button
                onClick={updateCanvasSize}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Apply Canvas Size
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tools */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <Button
              onClick={() => setTool('brush')}
              variant={tool === 'brush' ? 'default' : 'outline'}
              size="sm"
              className={tool === 'brush' ? 'bg-purple-600' : 'bg-slate-700 border-slate-600'}
            >
              <Brush className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setTool('eraser')}
              variant={tool === 'eraser' ? 'default' : 'outline'}
              size="sm"
              className={tool === 'eraser' ? 'bg-purple-600' : 'bg-slate-700 border-slate-600'}
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-300 text-sm">Brush Size:</span>
            <div className="w-24">
              <Slider
                value={[brushSize]}
                onValueChange={(value) => setBrushSize(value[0])}
                min={5}
                max={50}
                step={1}
                className="cursor-pointer"
              />
            </div>
            <span className="text-slate-400 text-sm">{brushSize}px</span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={undo}
              disabled={historyIndex <= 0}
              variant="outline"
              size="sm"
              className="bg-slate-700 border-slate-600 disabled:opacity-50"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              variant="outline"
              size="sm"
              className="bg-slate-700 border-slate-600 disabled:opacity-50"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={resetMask}
              variant="outline"
              size="sm"
              className="bg-slate-700 border-slate-600"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowMask(!showMask)}
              variant="outline"
              size="sm"
              className="bg-slate-700 border-slate-600"
            >
              {showMask ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              onClick={() => setZoom(Math.min(zoom + 0.2, 3))}
              variant="outline"
              size="sm"
              className="bg-slate-700 border-slate-600"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
              variant="outline"
              size="sm"
              className="bg-slate-700 border-slate-600"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex justify-center overflow-auto bg-slate-900/50 rounded-lg p-4">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{ 
              transform: `scale(${zoom})`,
              cursor: tool === 'brush' ? 'crosshair' : 'pointer',
              opacity: showMask ? 1 : 0.7
            }}
            className="border border-slate-600 rounded max-w-full"
          />
        </div>

        <div className="text-center text-slate-400 text-sm">
          Click and drag to {tool === 'brush' ? 'paint mask' : 'erase mask'} • 
          Zoom: {Math.round(zoom * 100)}% • 
          Canvas: {canvasWidth}x{canvasHeight}
          {mode === 'outpainting' && (
            <span> • Original: {originalImageDimensions.width}x{originalImageDimensions.height}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaskingCanvas;
