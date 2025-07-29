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
    "1": {
        "inputs": {
            "image": "shoppingwatch.webp"
        },
        "class_type": "LoadImage",
        "_meta": {
            "title": "Insert object"
        }
    },
    "2": {
        "inputs": {
            "image": "clipspace/clipspace-mask-260828.39999997616.png [input]"
        },
        "class_type": "LoadImage",
        "_meta": {
            "title": "Insert hand"
        }
    },
    "5": {
        "inputs": {
            "image": [
                "40",
                1
            ]
        },
        "class_type": "GetImageSize+",
        "_meta": {
            "title": "🔧 Get Image Size"
        }
    },
    "6": {
        "inputs": {
            "width": 16384,
            "height": [
                "5",
                1
            ],
            "interpolation": "lanczos",
            "method": "keep proportion",
            "condition": "always",
            "multiple_of": 0,
            "image": [
                "126",
                0
            ]
        },
        "class_type": "ImageResize+",
        "_meta": {
            "title": "🔧 Image Resize"
        }
    },
    "7": {
        "inputs": {
            "direction": "right",
            "match_image_size": false,
            "image1": [
                "6",
                0
            ],
            "image2": [
                "40",
                1
            ]
        },
        "class_type": "ImageConcanate",
        "_meta": {
            "title": "Image Concatenate"
        }
    },
    "8": {
        "inputs": {
            "images": [
                "7",
                0
            ]
        },
        "class_type": "PreviewImage",
        "_meta": {
            "title": "Preview Image"
        }
    },
    "9": {
        "inputs": {
            "image": [
                "6",
                0
            ]
        },
        "class_type": "GetImageSize+",
        "_meta": {
            "title": "🔧 Get Image Size"
        }
    },
    "10": {
        "inputs": {
            "panel_width": [
                "9",
                0
            ],
            "panel_height": [
                "9",
                1
            ],
            "fill_color": "black",
            "fill_color_hex": "#000000"
        },
        "class_type": "CR Color Panel",
        "_meta": {
            "title": "🌁 CR Color Panel"
        }
    },
    "11": {
        "inputs": {
            "direction": "right",
            "match_image_size": false,
            "image1": [
                "10",
                0
            ],
            "image2": [
                "13",
                0
            ]
        },
        "class_type": "ImageConcanate",
        "_meta": {
            "title": "Image Concatenate"
        }
    },
    "12": {
        "inputs": {
            "channel": "red",
            "image": [
                "11",
                0
            ]
        },
        "class_type": "ImageToMask",
        "_meta": {
            "title": "Convert Image to Mask"
        }
    },
    "13": {
        "inputs": {
            "mask": [
                "40",
                2
            ]
        },
        "class_type": "MaskToImage",
        "_meta": {
            "title": "Convert Mask to Image"
        }
    },
    "16": {
        "inputs": {
            "images": [
                "11",
                0
            ]
        },
        "class_type": "PreviewImage",
        "_meta": {
            "title": "Preview Image"
        }
    },
    "17": {
        "inputs": {
            "expand": 8,
            "incremental_expandrate": 0,
            "tapered_corners": false,
            "flip_input": false,
            "blur_radius": 8,
            "lerp_alpha": 1,
            "decay_factor": 1,
            "fill_holes": false,
            "mask": [
                "12",
                0
            ]
        },
        "class_type": "GrowMaskWithBlur",
        "_meta": {
            "title": "Grow Mask With Blur"
        }
    },
    "21": {
        "inputs": {
            "max_shift": 1.15,
            "base_shift": 0.5,
            "width": [
                "22",
                0
            ],
            "height": [
                "22",
                1
            ],
            "model": [
                "29",
                0
            ]
        },
        "class_type": "ModelSamplingFlux",
        "_meta": {
            "title": "ModelSamplingFlux"
        }
    },
    "22": {
        "inputs": {
            "image": [
                "7",
                0
            ]
        },
        "class_type": "GetImageSize+",
        "_meta": {
            "title": "🔧 Get Image Size"
        }
    },
    "23": {
        "inputs": {
            "noise_mask": false,
            "positive": [
                "24",
                0
            ],
            "negative": [
                "24",
                0
            ],
            "vae": [
                "35",
                0
            ],
            "pixels": [
                "7",
                0
            ],
            "mask": [
                "17",
                0
            ]
        },
        "class_type": "InpaintModelConditioning",
        "_meta": {
            "title": "InpaintModelConditioning"
        }
    },
    "24": {
        "inputs": {
            "conditioning_to": [
                "26",
                0
            ],
            "conditioning_from": [
                "25",
                0
            ]
        },
        "class_type": "ConditioningConcat",
        "_meta": {
            "title": "Conditioning (Concat)"
        }
    },
    "25": {
        "inputs": {
            "image_strength": "high",
            "conditioning": [
                "26",
                0
            ],
            "style_model": [
                "33",
                0
            ],
            "clip_vision_output": [
                "27",
                0
            ]
        },
        "class_type": "StyleModelApplySimple",
        "_meta": {
            "title": "StyleModelApplySimple"
        }
    },
    "26": {
        "inputs": {
            "text": [
                "39",
                0
            ],
            "clip": [
                "28",
                1
            ]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
            "title": "CLIP Text Encode (Prompt)"
        }
    },
    "27": {
        "inputs": {
            "crop": "none",
            "clip_vision": [
                "34",
                0
            ],
            "image": [
                "126",
                0
            ]
        },
        "class_type": "CLIPVisionEncode",
        "_meta": {
            "title": "CLIP Vision Encode"
        }
    },
    "28": {
        "inputs": {
            "PowerLoraLoaderHeaderWidget": {
                "type": "PowerLoraLoaderHeaderWidget"
            },
            "lora_1": {
                "on": false,
                "lora": "comfyui_portrait_lora64.safetensors",
                "strength": 0.6
            },
            "lora_2": {
                "on": false,
                "lora": "Phlux.safetensors",
                "strength": 0.6
            },
            "lora_3": {
                "on": false,
                "lora": "diffusion_pytorch_model.safetensors",
                "strength": 0.6
            },
            "lora_4": {
                "on": false,
                "lora": "comfyui_portrait_lora64.safetensors",
                "strength": 0.6
            },
            "lora_5": {
                "on": true,
                "lora": "pytorch_lora_weights.safetensors",
                "strength": 0.6
            },
            "➕ Add Lora": "",
            "model": [
                "30",
                0
            ],
            "clip": [
                "32",
                0
            ]
        },
        "class_type": "Power Lora Loader (rgthree)",
        "_meta": {
            "title": "Power Lora Loader (rgthree)"
        }
    },
    "29": {
        "inputs": {
            "model": [
                "28",
                0
            ]
        },
        "class_type": "DifferentialDiffusion",
        "_meta": {
            "title": "Differential Diffusion"
        }
    },
    "30": {
        "inputs": {
            "model_type": "flux",
            "rel_l1_thresh": 0.4,
            "start_percent": 0,
            "end_percent": 1,
            "cache_device": "cpu",
            "model": [
                "31",
                0
            ]
        },
        "class_type": "TeaCache",
        "_meta": {
            "title": "TeaCache"
        }
    },
    "31": {
        "inputs": {
            "unet_name": "flux1-fill-dev-fp8.safetensors",
            "weight_dtype": "default"
        },
        "class_type": "UNETLoader",
        "_meta": {
            "title": "Load Diffusion Model"
        }
    },
    "32": {
        "inputs": {
            "clip_name1": "t5xxl_fp8_e4m3fn.safetensors",
            "clip_name2": "clip_l.safetensors",
            "type": "flux",
            "device": "cpu"
        },
        "class_type": "DualCLIPLoader",
        "_meta": {
            "title": "DualCLIPLoader"
        }
    },
    "33": {
        "inputs": {
            "style_model_name": "flux1-redux-dev.safetensors"
        },
        "class_type": "StyleModelLoader",
        "_meta": {
            "title": "Load Style Model"
        }
    },
    "34": {
        "inputs": {
            "clip_name": "sigclip_vision_patch14_384.safetensors"
        },
        "class_type": "CLIPVisionLoader",
        "_meta": {
            "title": "Load CLIP Vision"
        }
    },
    "35": {
        "inputs": {
            "vae_name": "ae.safetensors"
        },
        "class_type": "VAELoader",
        "_meta": {
            "title": "Load VAE"
        }
    },
    "37": {
        "inputs": {
            "text": "a photograph of a watch on a hand with detailed text on watch"
        },
        "class_type": "Text Multiline",
        "_meta": {
            "title": "Prompt 1"
        }
    },
    "38": {
        "inputs": {
            "text": "The hand is in a natural, elegant pose, with visible skin texture and subtle veins. The lighting is professional and studio-grade, creating soft shadows that define the contours of the watch and hand, highlighting reflections on metallic surfaces. Masterpiece, best quality, 8k UHD, sharp focus, extreme detail, super-resolution, professional studio photography."
        },
        "class_type": "Text Multiline",
        "_meta": {
            "title": "Additional prompt"
        }
    },
    "39": {
        "inputs": {
            "delimiter": ", ",
            "clean_whitespace": "true",
            "text_a": [
                "38",
                0
            ],
            "text_b": [
                "37",
                0
            ]
        },
        "class_type": "Text Concatenate",
        "_meta": {
            "title": "Text Concatenate"
        }
    },
    "40": {
        "inputs": {
            "downscale_algorithm": "bilinear",
            "upscale_algorithm": "bicubic",
            "preresize": false,
            "preresize_mode": "ensure minimum resolution",
            "preresize_min_width": 1024,
            "preresize_min_height": 1024,
            "preresize_max_width": 16384,
            "preresize_max_height": 16384,
            "mask_fill_holes": true,
            "mask_expand_pixels": 0,
            "mask_invert": false,
            "mask_blend_pixels": 32,
            "mask_hipass_filter": 0.1,
            "extend_for_outpainting": false,
            "extend_up_factor": 1,
            "extend_down_factor": 1,
            "extend_left_factor": 1,
            "extend_right_factor": 1,
            "context_from_mask_extend_factor": 1.2000000000000002,
            "output_resize_to_target_size": true,
            "output_target_width": 1080,
            "output_target_height": 1080,
            "output_padding": "128",
            "image": [
                "129",
                0
            ],
            "mask": [
                "115",
                0
            ]
        },
        "class_type": "InpaintCropImproved",
        "_meta": {
            "title": "✂ Inpaint Crop (Improved)"
        }
    },
    "43": {
        "inputs": {
            "guidance": 50,
            "conditioning": [
                "23",
                0
            ]
        },
        "class_type": "FluxGuidance",
        "_meta": {
            "title": "FluxGuidance"
        }
    },
    "44": {
        "inputs": {
            "scheduler": "sgm_uniform",
            "steps": 30,
            "denoise": 1,
            "model": [
                "21",
                0
            ]
        },
        "class_type": "BasicScheduler",
        "_meta": {
            "title": "BasicScheduler"
        }
    },
    "45": {
        "inputs": {
            "sampler_name": "dpmpp_2m"
        },
        "class_type": "KSamplerSelect",
        "_meta": {
            "title": "KSamplerSelect"
        }
    },
    "46": {
        "inputs": {
            "model": [
                "21",
                0
            ],
            "conditioning": [
                "43",
                0
            ]
        },
        "class_type": "BasicGuider",
        "_meta": {
            "title": "BasicGuider"
        }
    },
    "47": {
        "inputs": {
            "noise_seed": 464171942252836
        },
        "class_type": "RandomNoise",
        "_meta": {
            "title": "RandomNoise"
        }
    },
    "50": {
        "inputs": {
            "noise": [
                "47",
                0
            ],
            "guider": [
                "46",
                0
            ],
            "sampler": [
                "45",
                0
            ],
            "sigmas": [
                "44",
                0
            ],
            "latent_image": [
                "23",
                2
            ]
        },
        "class_type": "SamplerCustomAdvanced",
        "_meta": {
            "title": "SamplerCustomAdvanced"
        }
    },
    "61": {
        "inputs": {
            "samples": [
                "50",
                0
            ],
            "vae": [
                "35",
                0
            ]
        },
        "class_type": "VAEDecode",
        "_meta": {
            "title": "VAE Decode"
        }
    },
    "62": {
        "inputs": {
            "image": [
                "40",
                1
            ]
        },
        "class_type": "GetImageSize+",
        "_meta": {
            "title": "🔧 Get Image Size"
        }
    },
    "63": {
        "inputs": {
            "mask": [
                "17",
                0
            ]
        },
        "class_type": "MaskToImage",
        "_meta": {
            "title": "Convert Mask to Image"
        }
    },
    "64": {
        "inputs": {
            "width": [
                "62",
                0
            ],
            "height": [
                "62",
                1
            ],
            "position": "right-center",
            "x_offset": 0,
            "y_offset": 0,
            "image": [
                "61",
                0
            ]
        },
        "class_type": "ImageCrop+",
        "_meta": {
            "title": "🔧 Image Crop"
        }
    },
    "65": {
        "inputs": {
            "width": [
                "62",
                0
            ],
            "height": [
                "62",
                1
            ],
            "position": "right-center",
            "x_offset": 0,
            "y_offset": 0,
            "image": [
                "63",
                0
            ]
        },
        "class_type": "ImageCrop+",
        "_meta": {
            "title": "🔧 Image Crop"
        }
    },
    "66": {
        "inputs": {
            "brightness": 1.05,
            "contrast": 0.98,
            "saturation": 1.05,
            "image": [
                "64",
                0
            ]
        },
        "class_type": "LayerColor: BrightnessContrastV2",
        "_meta": {
            "title": "LayerColor: Brightness Contrast V2"
        }
    },
    "67": {
        "inputs": {
            "channel": "red",
            "image": [
                "65",
                0
            ]
        },
        "class_type": "ImageToMask",
        "_meta": {
            "title": "Convert Image to Mask"
        }
    },
    "68": {
        "inputs": {
            "x": 0,
            "y": 0,
            "resize_source": false,
            "destination": [
                "40",
                1
            ],
            "source": [
                "66",
                0
            ],
            "mask": [
                "67",
                0
            ]
        },
        "class_type": "ImageCompositeMasked",
        "_meta": {
            "title": "ImageCompositeMasked"
        }
    },
    "70": {
        "inputs": {
            "images": [
                "68",
                0
            ]
        },
        "class_type": "PreviewImage",
        "_meta": {
            "title": "Preview Image"
        }
    },
    "75": {
        "inputs": {
            "rgthree_comparer": {
                "images": [
                    {
                        "name": "A",
                        "selected": true,
                        "url": "/api/view?filename=rgthree.compare.temp_dvqen_00001.png&type=temp&subfolder=&rand=0.5047953768715499"
                    },
                    {
                        "name": "B",
                        "selected": true,
                        "url": "/api/view?filename=rgthree.compare.temp_dvqen_00002.png&type=temp&subfolder=&rand=0.1571818554788269"
                    }
                ]
            },
            "image_a": [
                "92",
                0
            ],
            "image_b": [
                "129",
                0
            ]
        },
        "class_type": "Image Comparer (rgthree)",
        "_meta": {
            "title": "Image Comparer (rgthree)"
        }
    },
    "76": {
        "inputs": {
            "stitcher": [
                "40",
                0
            ],
            "inpainted_image": [
                "68",
                0
            ]
        },
        "class_type": "InpaintStitchImproved",
        "_meta": {
            "title": "✂ Inpaint Stitch (Improved)"
        }
    },
    "82": {
        "inputs": {
            "model_name": "4x_NMKD-Siax_200k.pth"
        },
        "class_type": "UpscaleModelLoader",
        "_meta": {
            "title": "Load Upscale Model"
        }
    },
    "91": {
        "inputs": {
            "images": [
                "76",
                0
            ]
        },
        "class_type": "PreviewImage",
        "_meta": {
            "title": "Preview Image"
        }
    },
    "92": {
        "inputs": {
            "upscale_model": [
                "82",
                0
            ],
            "image": [
                "76",
                0
            ]
        },
        "class_type": "ImageUpscaleWithModel",
        "_meta": {
            "title": "Upscale Image (using Model)"
        }
    },
    "113": {
        "inputs": {
            "mask": [
                "2",
                1
            ]
        },
        "class_type": "MaskToImage",
        "_meta": {
            "title": "Convert Mask to Image"
        }
    },
    "115": {
        "inputs": {
            "channel": "red",
            "image": [
                "128",
                0
            ]
        },
        "class_type": "ImageToMask",
        "_meta": {
            "title": "Convert Image to Mask"
        }
    },
    "123": {
        "inputs": {
            "images": [
                "1",
                0
            ]
        },
        "class_type": "PreviewImage",
        "_meta": {
            "title": "Initial image"
        }
    },
    "126": {
        "inputs": {
            "upscale_model": "4x_NMKD-Siax_200k.pth",
            "resampling_method": "lanczos",
            "supersample": "true",
            "image": [
                "141",
                0
            ]
        },
        "class_type": "CR Upscale Image",
        "_meta": {
            "title": "🔍 CR Upscale Image"
        }
    },
    "128": {
        "inputs": {
            "upscale_model": "4x_NMKD-Siax_200k.pth",
            "resampling_method": "lanczos",
            "supersample": "true",
            "image": [
                "113",
                0
            ]
        },
        "class_type": "CR Upscale Image",
        "_meta": {
            "title": "🔍 CR Upscale Image"
        }
    },
    "129": {
        "inputs": {
            "upscale_model": "4x_NMKD-Siax_200k.pth",
            "resampling_method": "lanczos",
            "supersample": "true",
            "image": [
                "2",
                0
            ]
        },
        "class_type": "CR Upscale Image",
        "_meta": {
            "title": "🔍 CR Upscale Image"
        }
    },
    "130": {
        "inputs": {
            "images": [
                "129",
                0
            ]
        },
        "class_type": "PreviewImage",
        "_meta": {
            "title": "Preview Image"
        }
    },
    "131": {
        "inputs": {
            "upscale_model": "4x_NMKD-Siax_200k.pth",
            "resampling_method": "lanczos",
            "supersample": "true",
            "image": [
                "76",
                0
            ]
        },
        "class_type": "CR Upscale Image",
        "_meta": {
            "title": "🔍 CR Upscale Image"
        }
    },
    "132": {
        "inputs": {
            "images": [
                "131",
                0
            ]
        },
        "class_type": "PreviewImage",
        "_meta": {
            "title": "Final Image"
        }
    },
    "137": {
        "inputs": {
            "any_value": [
                "5",
                1
            ]
        },
        "class_type": "Show any to JSON [Crystools]",
        "_meta": {
            "title": "🪛 Show any to JSON"
        }
    },
    "139": {
        "inputs": {
            "any_value": [
                "6",
                1
            ]
        },
        "class_type": "Show any to JSON [Crystools]",
        "_meta": {
            "title": "🪛 Show any to JSON"
        }
    },
    "141": {
        "inputs": {
            "image": [
                "143",
                0
            ]
        },
        "class_type": "ImageRemoveAlpha+",
        "_meta": {
            "title": "🔧 Image Remove Alpha"
        }
    },
    "143": {
        "inputs": {
            "transparency": true,
            "model": "u2net",
            "post_processing": false,
            "only_mask": false,
            "alpha_matting": false,
            "alpha_matting_foreground_threshold": 240,
            "alpha_matting_background_threshold": 10,
            "alpha_matting_erode_size": 10,
            "background_color": "none",
            "images": [
                "1",
                0
            ]
        },
        "class_type": "Image Rembg (Remove Background)",
        "_meta": {
            "title": "Image Rembg (Remove Background)"
        }
    },
    "144": {
        "inputs": {
            "images": [
                "126",
                0
            ]
        },
        "class_type": "PreviewImage",
        "_meta": {
            "title": "Preview Image"
        }
    },
    "145": {
        "inputs": {
            "any_value": [
                "40",
                0
            ]
        },
        "class_type": "Show any to JSON [Crystools]",
        "_meta": {
            "title": "🪛 Show any to JSON"
        }
    }
};
const ComfyUITab: React.FC<ComfyUITabProps> = ({ onError }) => {
    const [ngrokUrl, setNgrokUrl] = useState('');
    const [prompt, setPrompt] = useState('a photograph of a watch on a hand with detailed text on watch');
    const [additionalPrompt, setAdditionalPrompt] = useState('The hand is in a natural, elegant pose, with visible skin texture and subtle veins. The lighting is professional and studio-grade, creating soft shadows that define the contours of the watch and hand, highlighting reflections on metallic surfaces. Masterpiece, best quality, 8k UHD, sharp focus, extreme detail, super-resolution, professional studio photography.');
    const [handImage, setHandImage] = useState<File | null>(null);
    const [objectImage, setObjectImage] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState('Status: Waiting for input...');
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const handFileRef = useRef<HTMLInputElement>(null);
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

    const getModifiedWorkflow = (
        workflow: WorkflowJSON,
        prompt1: string,
        prompt2: string,
        handImageName: string,
        objectImageName: string
    ): WorkflowJSON => {
        const updatedWorkflow = JSON.parse(JSON.stringify(workflow));

        let prompt1NodeId: string | null = null;
        let prompt2NodeId: string | null = null;
        let handNodeId: string | null = null;
        let objectNodeId: string | null = null;

        for (const id in updatedWorkflow) {
            const title = updatedWorkflow[id]._meta?.title;
            if (title === "Prompt 1") prompt1NodeId = id;
            if (title === "Additional prompt") prompt2NodeId = id;
            if (title === "Insert hand") handNodeId = id;
            if (title === "Insert object") objectNodeId = id;
        }

        if (prompt1NodeId) updatedWorkflow[prompt1NodeId].inputs.text = prompt1;
        if (prompt2NodeId) updatedWorkflow[prompt2NodeId].inputs.text = prompt2;
        if (handNodeId) updatedWorkflow[handNodeId].inputs.image = handImageName;
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
        if (!ngrokUrl || !prompt || !handImage || !objectImage) {
            updateStatus('Error: Please fill all fields and select both images.', true);
            return;
        }

        setIsGenerating(true);
        setResultImage(null);
        setProgress(0);

        try {
            const handFileInfo = await uploadImage(ngrokUrl, handImage);
            const objFileInfo = await uploadImage(ngrokUrl, objectImage);
            updateStatus('Uploads complete. Preparing workflow...');

            const modifiedWorkflow = getModifiedWorkflow(WORKFLOW_JSON, prompt, additionalPrompt, handFileInfo.name, objFileInfo.name);

            const clientId = Math.random().toString(36).substring(7);
            const wsUrl = ngrokUrl.replace(/^http/, 'ws');

            wsRef.current = new WebSocket(`${wsUrl}/ws?clientId=${clientId}`);

            wsRef.current.onopen = () => {
                queuePrompt(ngrokUrl, clientId, modifiedWorkflow);
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === 'executed') {
                        const executedNodeId = data.data.node;
                        const finalNodeId = Object.keys(WORKFLOW_JSON).find(
                            id => WORKFLOW_JSON[id]._meta?.title === 'Final Image'
                        );

                        if (executedNodeId === finalNodeId) {
                            // The 'output' object from the server IS the data for our final node.
                            const output = data.data ? data.data.output : undefined;

                            // The fix is here: We check 'output.images' directly.
                            if (output && output.images && output.images.length > 0) {
                                // SUCCESS!
                                updateStatus('Execution complete! Fetching image...');
                                const finalImage = output.images[0];
                                const imageUrl = `${ngrokUrl}/view?filename=${encodeURIComponent(finalImage.filename)}&subfolder=${encodeURIComponent(finalImage.subfolder)}&type=${finalImage.type}`;

                                setResultImage(imageUrl);
                                updateStatus('Done!');
                                setProgress(100);
                            } else {
                                // This should no longer be triggered.
                                updateStatus(`Error: Final node ${finalNodeId} executed, but a logic error occurred while parsing the output.`, true);
                                console.error("The final data packet was received but could not be parsed correctly:", data);
                            }

                            wsRef.current?.close();
                        }
                    } else if (data.type === 'progress') {
                        const { value, max } = data.data;
                        const progressValue = Math.round((value / max) * 100);
                        setProgress(progressValue);
                        updateStatus(`Generating... ${progressValue}%`);
                    }
                } catch (e) {
                    console.error("Error processing WebSocket message:", e);
                    console.error("The problematic raw message was:", event.data);
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

    const handleHandImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setHandImage(file);
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
                                rows={2}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="bg-black/20 border-primary/20 text-foreground placeholder:text-muted-foreground resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="additional-prompt" className="text-foreground">Additional Prompt</Label>
                            <Textarea
                                id="additional-prompt"
                                rows={4}
                                value={additionalPrompt}
                                onChange={(e) => setAdditionalPrompt(e.target.value)}
                                className="bg-black/20 border-primary/20 text-foreground placeholder:text-muted-foreground resize-none"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="hand-image" className="text-foreground">Insert Hand Image</Label>
                                <div className="relative">
                                    <Input
                                        ref={handFileRef}
                                        id="hand-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleHandImageChange}
                                        className="bg-black/20 border-primary/20 text-foreground file:bg-primary file:text-primary-foreground file:border-0 file:rounded-sm file:px-3 file:py-1"
                                    />
                                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                </div>
                                {handImage && (
                                    <p className="text-sm text-muted-foreground">Selected: {handImage.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="object-image" className="text-foreground">Insert Object Image</Label>
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


