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
const Workflow_JSON: WorkflowJSON = {{
  "id": "4fddaf42-26be-4f5c-bf24-4d6511623fb8",
  "revision": 0,
  "last_node_id": 263,
  "last_link_id": 337,
  "nodes": [
    {
      "id": 13,
      "type": "Reroute",
      "pos": [
        28252.77734375,
        7748.89794921875
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 31,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 271
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "links": [
            60,
            85
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 15,
      "type": "Reroute",
      "pos": [
        28252.77734375,
        7158.89794921875
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 62,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 268
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "links": [
            32
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 17,
      "type": "Reroute",
      "pos": [
        28252.77734375,
        6968.89794921875
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 30,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "widget": {
            "name": "value"
          },
          "link": 269
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "STRING",
          "links": [
            26
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 22,
      "type": "GetImageSize+",
      "pos": [
        29812.77734375,
        7608.89794921875
      ],
      "size": [
        160,
        66
      ],
      "flags": {},
      "order": 64,
      "mode": 0,
      "inputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "link": 17
        }
      ],
      "outputs": [
        {
          "name": "width",
          "type": "INT",
          "slot_index": 0,
          "links": [
            18
          ]
        },
        {
          "name": "height",
          "type": "INT",
          "slot_index": 1,
          "links": [
            19
          ]
        },
        {
          "name": "count",
          "type": "INT",
          "slot_index": 2,
          "links": null
        }
      ],
      "properties": {
        "cnr_id": "comfyui_essentials",
        "ver": "1.1.0",
        "Node name for S&R": "GetImageSize+"
      },
      "widgets_values": [],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 23,
      "type": "CR Color Panel",
      "pos": [
        30032.77734375,
        7608.89794921875
      ],
      "size": [
        210,
        150
      ],
      "flags": {
        "collapsed": false
      },
      "order": 65,
      "mode": 0,
      "inputs": [
        {
          "label": "panel_width",
          "name": "panel_width",
          "type": "INT",
          "widget": {
            "name": "panel_width"
          },
          "link": 18
        },
        {
          "label": "panel_height",
          "name": "panel_height",
          "type": "INT",
          "widget": {
            "name": "panel_height"
          },
          "link": 19
        }
      ],
      "outputs": [
        {
          "label": "image",
          "name": "image",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            34
          ]
        },
        {
          "label": "show_help",
          "name": "show_help",
          "type": "STRING"
        }
      ],
      "properties": {
        "cnr_id": "ComfyUI_Comfyroll_CustomNodes",
        "ver": "d78b780ae43fcf8c6b7c6505e6ffb4584281ceca",
        "Node name for S&R": "CR Color Panel"
      },
      "widgets_values": [
        512,
        512,
        "black",
        "#000000"
      ],
      "color": "#232",
      "bgcolor": "#353"
    },
    {
      "id": 29,
      "type": "Text Concatenate",
      "pos": [
        28772.77734375,
        7238.89794921875
      ],
      "size": [
        220,
        142
      ],
      "flags": {},
      "order": 40,
      "mode": 0,
      "inputs": [
        {
          "name": "text_a",
          "shape": 7,
          "type": "STRING",
          "link": 23
        },
        {
          "name": "text_b",
          "shape": 7,
          "type": "STRING",
          "link": 24
        },
        {
          "name": "text_c",
          "shape": 7,
          "type": "STRING",
          "link": 25
        },
        {
          "name": "text_d",
          "shape": 7,
          "type": "STRING",
          "link": null
        }
      ],
      "outputs": [
        {
          "name": "STRING",
          "type": "STRING",
          "slot_index": 0,
          "links": [
            151
          ]
        }
      ],
      "properties": {
        "cnr_id": "was-ns",
        "ver": "3.0.0",
        "Node name for S&R": "Text Concatenate"
      },
      "widgets_values": [
        ", ",
        "true"
      ],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 30,
      "type": "Reroute",
      "pos": [
        28432.77734375,
        7278.89794921875
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 35,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "widget": {
            "name": "value"
          },
          "link": 26
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "STRING",
          "links": [
            25
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 56,
      "type": "Reroute",
      "pos": [
        33020,
        7730
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 78,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 48
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "LATENT",
          "links": [
            117
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 59,
      "type": "Reroute",
      "pos": [
        31900,
        7730
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 29,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 52
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "VAE",
          "links": [
            45,
            53
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 62,
      "type": "Reroute",
      "pos": [
        29572.77734375,
        7608.89794921875
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 81,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 56
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "links": [
            17
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 65,
      "type": "MaskToImage",
      "pos": [
        30082.77734375,
        8198.8974609375
      ],
      "size": [
        184.62362670898438,
        26
      ],
      "flags": {
        "collapsed": false
      },
      "order": 52,
      "mode": 0,
      "inputs": [
        {
          "label": "mask",
          "name": "mask",
          "type": "MASK",
          "link": 59
        }
      ],
      "outputs": [
        {
          "label": "IMAGE",
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            35
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "MaskToImage"
      },
      "widgets_values": [],
      "color": "#232",
      "bgcolor": "#353"
    },
    {
      "id": 85,
      "type": "Reroute",
      "pos": [
        32060,
        7700
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 85,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 80
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "CONDITIONING",
          "links": [
            43,
            44
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 88,
      "type": "Note",
      "pos": [
        29552.77734375,
        7898.89794921875
      ],
      "size": [
        210,
        90
      ],
      "flags": {},
      "order": 0,
      "mode": 0,
      "inputs": [],
      "outputs": [],
      "title": "Tips",
      "properties": {},
      "widgets_values": [
        "if you encounter ImageConcatenate error about dimension,\n\nSet match_image_size = true."
      ],
      "color": "#322",
      "bgcolor": "#533"
    },
    {
      "id": 94,
      "type": "ModelSamplingFlux",
      "pos": [
        32320,
        7050
      ],
      "size": [
        210,
        130
      ],
      "flags": {},
      "order": 87,
      "mode": 0,
      "inputs": [
        {
          "name": "model",
          "type": "MODEL",
          "link": 90
        },
        {
          "name": "width",
          "type": "INT",
          "widget": {
            "name": "width"
          },
          "link": 91
        },
        {
          "name": "height",
          "type": "INT",
          "widget": {
            "name": "height"
          },
          "link": 92
        }
      ],
      "outputs": [
        {
          "name": "MODEL",
          "type": "MODEL",
          "slot_index": 0,
          "links": [
            94,
            96
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "ModelSamplingFlux"
      },
      "widgets_values": [
        1.15,
        0.5,
        1024,
        1024
      ],
      "color": "#323",
      "bgcolor": "#535"
    },
    {
      "id": 95,
      "type": "Reroute",
      "pos": [
        32190,
        6980
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 45,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 93
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "MODEL",
          "links": [
            90
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 97,
      "type": "GetImageSize+",
      "pos": [
        32120,
        7070
      ],
      "size": [
        159.50155639648438,
        66
      ],
      "flags": {},
      "order": 89,
      "mode": 0,
      "inputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "link": 95
        }
      ],
      "outputs": [
        {
          "name": "width",
          "type": "INT",
          "slot_index": 0,
          "links": [
            91
          ]
        },
        {
          "name": "height",
          "type": "INT",
          "slot_index": 1,
          "links": [
            92
          ]
        },
        {
          "name": "count",
          "type": "INT",
          "slot_index": 2,
          "links": null
        }
      ],
      "properties": {
        "cnr_id": "comfyui_essentials",
        "ver": "1.1.0",
        "Node name for S&R": "GetImageSize+"
      },
      "widgets_values": [],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 111,
      "type": "Reroute",
      "pos": [
        32830,
        7210
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 98,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 118
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "MODEL",
          "links": [
            29
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 55,
      "type": "InpaintModelConditioning",
      "pos": [
        32180,
        7690
      ],
      "size": [
        210,
        138
      ],
      "flags": {},
      "order": 77,
      "mode": 0,
      "inputs": [
        {
          "label": "positive",
          "name": "positive",
          "type": "CONDITIONING",
          "link": 43
        },
        {
          "label": "negative",
          "name": "negative",
          "type": "CONDITIONING",
          "link": 44
        },
        {
          "label": "vae",
          "name": "vae",
          "type": "VAE",
          "link": 45
        },
        {
          "label": "pixels",
          "name": "pixels",
          "type": "IMAGE",
          "link": 154
        },
        {
          "label": "mask",
          "name": "mask",
          "type": "MASK",
          "link": 47
        }
      ],
      "outputs": [
        {
          "label": "positive",
          "name": "positive",
          "type": "CONDITIONING",
          "slot_index": 0,
          "links": [
            28
          ]
        },
        {
          "label": "negative",
          "name": "negative",
          "type": "CONDITIONING",
          "slot_index": 1,
          "links": []
        },
        {
          "label": "latent",
          "name": "latent",
          "type": "LATENT",
          "slot_index": 2,
          "links": [
            48
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "InpaintModelConditioning"
      },
      "widgets_values": [
        false
      ],
      "color": "#332922",
      "bgcolor": "#593930"
    },
    {
      "id": 58,
      "type": "Reroute",
      "pos": [
        31900,
        7750
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 79,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 153
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            95,
            154
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 50,
      "type": "PreviewImage",
      "pos": [
        30550,
        7950
      ],
      "size": [
        320,
        270
      ],
      "flags": {
        "collapsed": false
      },
      "order": 74,
      "mode": 0,
      "inputs": [
        {
          "name": "images",
          "type": "IMAGE",
          "link": 38
        }
      ],
      "outputs": [],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "PreviewImage"
      },
      "widgets_values": []
    },
    {
      "id": 48,
      "type": "GrowMaskWithBlur",
      "pos": [
        30880,
        7860
      ],
      "size": [
        240,
        246
      ],
      "flags": {},
      "order": 73,
      "mode": 0,
      "inputs": [
        {
          "name": "mask",
          "type": "MASK",
          "link": 37
        }
      ],
      "outputs": [
        {
          "name": "mask",
          "type": "MASK",
          "slot_index": 0,
          "links": [
            149
          ]
        },
        {
          "name": "mask_inverted",
          "type": "MASK",
          "links": null
        }
      ],
      "properties": {
        "cnr_id": "comfyui-kjnodes",
        "ver": "1.1.3",
        "Node name for S&R": "GrowMaskWithBlur"
      },
      "widgets_values": [
        8,
        0,
        false,
        false,
        8,
        1,
        1,
        false
      ],
      "color": "#232",
      "bgcolor": "#353"
    },
    {
      "id": 47,
      "type": "ImageToMask",
      "pos": [
        30580,
        7860
      ],
      "size": [
        210,
        58
      ],
      "flags": {
        "collapsed": false
      },
      "order": 72,
      "mode": 0,
      "inputs": [
        {
          "label": "image",
          "name": "image",
          "type": "IMAGE",
          "link": 36
        }
      ],
      "outputs": [
        {
          "label": "MASK",
          "name": "MASK",
          "type": "MASK",
          "slot_index": 0,
          "links": [
            37
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "ImageToMask"
      },
      "widgets_values": [
        "red"
      ],
      "color": "#232",
      "bgcolor": "#353"
    },
    {
      "id": 46,
      "type": "ImageConcanate",
      "pos": [
        30320,
        7860
      ],
      "size": [
        210,
        102
      ],
      "flags": {},
      "order": 71,
      "mode": 0,
      "inputs": [
        {
          "label": "image1",
          "name": "image1",
          "type": "IMAGE",
          "link": 34
        },
        {
          "label": "image2",
          "name": "image2",
          "type": "IMAGE",
          "link": 35
        }
      ],
      "outputs": [
        {
          "label": "IMAGE",
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            36,
            38
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfyui-kjnodes",
        "ver": "1.1.3",
        "Node name for S&R": "ImageConcanate"
      },
      "widgets_values": [
        "right",
        false
      ],
      "color": "#232",
      "bgcolor": "#353"
    },
    {
      "id": 86,
      "type": "Text Multiline",
      "pos": [
        28432.77734375,
        6928.89794921875
      ],
      "size": [
        270,
        130
      ],
      "flags": {},
      "order": 1,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "STRING",
          "type": "STRING",
          "slot_index": 0,
          "links": [
            23
          ]
        }
      ],
      "title": "Additional prompt",
      "properties": {
        "cnr_id": "was-ns",
        "ver": "3.0.0",
        "Node name for S&R": "Text Multiline"
      },
      "widgets_values": [
        ""
      ],
      "color": "#323",
      "bgcolor": "#535"
    },
    {
      "id": 57,
      "type": "Power Lora Loader (rgthree)",
      "pos": [
        30770,
        6980
      ],
      "size": [
        360,
        250
      ],
      "flags": {},
      "order": 33,
      "mode": 0,
      "inputs": [
        {
          "dir": 3,
          "name": "model",
          "type": "MODEL",
          "link": 328
        },
        {
          "dir": 3,
          "name": "clip",
          "type": "CLIP",
          "link": 185
        }
      ],
      "outputs": [
        {
          "dir": 4,
          "name": "MODEL",
          "shape": 3,
          "type": "MODEL",
          "slot_index": 0,
          "links": [
            89
          ]
        },
        {
          "dir": 4,
          "name": "CLIP",
          "shape": 3,
          "type": "CLIP",
          "slot_index": 1,
          "links": [
            81
          ]
        }
      ],
      "properties": {
        "cnr_id": "rgthree-comfy",
        "ver": "1.0.2507112302",
        "Show Strengths": "Single Strength"
      },
      "widgets_values": [
        {},
        {
          "type": "PowerLoraLoaderHeaderWidget"
        },
        {},
        ""
      ],
      "color": "#2a363b",
      "bgcolor": "#3f5159"
    },
    {
      "id": 90,
      "type": "CLIPVisionEncode",
      "pos": [
        31120,
        7500
      ],
      "size": [
        260,
        78
      ],
      "flags": {
        "collapsed": false
      },
      "order": 86,
      "mode": 0,
      "inputs": [
        {
          "label": "clip_vision",
          "name": "clip_vision",
          "type": "CLIP_VISION",
          "link": 83
        },
        {
          "label": "image",
          "name": "image",
          "type": "IMAGE",
          "link": 262
        }
      ],
      "outputs": [
        {
          "label": "CLIP_VISION_OUTPUT",
          "name": "CLIP_VISION_OUTPUT",
          "type": "CLIP_VISION_OUTPUT",
          "slot_index": 0,
          "links": [
            280
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "CLIPVisionEncode"
      },
      "widgets_values": [
        "none"
      ],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 70,
      "type": "ConditioningConcat",
      "pos": [
        31700,
        7220
      ],
      "size": [
        253.60000610351562,
        46
      ],
      "flags": {},
      "order": 83,
      "mode": 0,
      "inputs": [
        {
          "name": "conditioning_to",
          "type": "CONDITIONING",
          "link": 64
        },
        {
          "name": "conditioning_from",
          "type": "CONDITIONING",
          "link": 278
        }
      ],
      "outputs": [
        {
          "name": "CONDITIONING",
          "type": "CONDITIONING",
          "slot_index": 0,
          "links": [
            80
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "ConditioningConcat"
      },
      "widgets_values": [],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 51,
      "type": "Reroute",
      "pos": [
        31280,
        7860
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 75,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 149
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "MASK",
          "links": [
            27,
            104
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 32,
      "type": "Reroute",
      "pos": [
        31400,
        7770
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 66,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 27
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "MASK",
          "links": [
            47
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 77,
      "type": "Reroute",
      "pos": [
        31280,
        7910
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 58,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 72
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "links": [
            146
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 12,
      "type": "Reroute",
      "pos": [
        30980,
        8230
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 56,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 11
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "links": [
            72
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 8,
      "type": "Reroute",
      "pos": [
        30980,
        8290
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 41,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 7
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            73
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 78,
      "type": "Reroute",
      "pos": [
        31280,
        7970
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 48,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 73
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "links": [
            148
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 76,
      "type": "Reroute",
      "pos": [
        35630,
        7970
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 54,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 148
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "links": [
            112
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 91,
      "type": "PrimitiveNode",
      "pos": [
        28262.77734375,
        7828.89794921875
      ],
      "size": [
        240,
        82
      ],
      "flags": {},
      "order": 2,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "INT",
          "type": "INT",
          "widget": {
            "name": "max_height"
          },
          "slot_index": 0,
          "links": [
            87,
            88
          ]
        }
      ],
      "title": "Height",
      "properties": {
        "Run widget replace on values": false
      },
      "widgets_values": [
        720,
        "fixed"
      ],
      "color": "#323",
      "bgcolor": "#535"
    },
    {
      "id": 52,
      "type": "ImageConcanate",
      "pos": [
        29552.77734375,
        7748.89794921875
      ],
      "size": [
        210,
        102
      ],
      "flags": {},
      "order": 76,
      "mode": 0,
      "inputs": [
        {
          "label": "image1",
          "name": "image1",
          "type": "IMAGE",
          "link": 40
        },
        {
          "label": "image2",
          "name": "image2",
          "type": "IMAGE",
          "link": 288
        }
      ],
      "outputs": [
        {
          "label": "IMAGE",
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            79,
            153
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfyui-kjnodes",
        "ver": "1.1.3",
        "Node name for S&R": "ImageConcanate"
      },
      "widgets_values": [
        "right",
        false
      ],
      "color": "#223",
      "bgcolor": "#335"
    },
    {
      "id": 61,
      "type": "ImageResize+",
      "pos": [
        29292.77734375,
        7518.89794921875
      ],
      "size": [
        220,
        218
      ],
      "flags": {},
      "order": 80,
      "mode": 0,
      "inputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "link": 275
        },
        {
          "name": "height",
          "type": "INT",
          "widget": {
            "name": "height"
          },
          "link": 55
        }
      ],
      "outputs": [
        {
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            40,
            56,
            262
          ]
        },
        {
          "name": "width",
          "type": "INT",
          "slot_index": 1,
          "links": []
        },
        {
          "name": "height",
          "type": "INT",
          "slot_index": 2,
          "links": []
        }
      ],
      "properties": {
        "cnr_id": "comfyui_essentials",
        "ver": "1.1.0",
        "Node name for S&R": "ImageResize+"
      },
      "widgets_values": [
        16384,
        512,
        "lanczos",
        "keep proportion",
        "always",
        0
      ],
      "color": "#223",
      "bgcolor": "#335"
    },
    {
      "id": 64,
      "type": "GetImageSize+",
      "pos": [
        29110,
        7590
      ],
      "size": [
        159.50155639648438,
        66
      ],
      "flags": {},
      "order": 50,
      "mode": 0,
      "inputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "link": 289
        }
      ],
      "outputs": [
        {
          "name": "width",
          "type": "INT",
          "slot_index": 0,
          "links": []
        },
        {
          "name": "height",
          "type": "INT",
          "slot_index": 1,
          "links": [
            55
          ]
        },
        {
          "name": "count",
          "type": "INT",
          "links": null
        }
      ],
      "properties": {
        "cnr_id": "comfyui_essentials",
        "ver": "1.1.0",
        "Node name for S&R": "GetImageSize+"
      },
      "widgets_values": [],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 93,
      "type": "DifferentialDiffusion",
      "pos": [
        31180,
        6980
      ],
      "size": [
        184.8000030517578,
        26
      ],
      "flags": {},
      "order": 38,
      "mode": 0,
      "inputs": [
        {
          "label": "model",
          "name": "model",
          "type": "MODEL",
          "link": 89
        }
      ],
      "outputs": [
        {
          "label": "MODEL",
          "name": "MODEL",
          "type": "MODEL",
          "slot_index": 0,
          "links": [
            93
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "DifferentialDiffusion"
      },
      "widgets_values": [],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 128,
      "type": "Reroute",
      "pos": [
        28060,
        6970
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 24,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "widget": {
            "name": "value"
          },
          "link": 139
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "STRING",
          "slot_index": 0,
          "links": [
            269
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 24,
      "type": "Reroute",
      "pos": [
        28060,
        7750
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 26,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 20
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            271
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 25,
      "type": "Reroute",
      "pos": [
        28060,
        7770
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 27,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 21
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "MASK",
          "slot_index": 0,
          "links": [
            272
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 14,
      "type": "Reroute",
      "pos": [
        28252.77734375,
        7768.89794921875
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 32,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 272
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "MASK",
          "slot_index": 0,
          "links": [
            273
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 36,
      "type": "Reroute",
      "pos": [
        28430,
        7520
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 70,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 32
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            275
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 89,
      "type": "CLIPTextEncode",
      "pos": [
        31170,
        7220
      ],
      "size": [
        210.29940795898438,
        88
      ],
      "flags": {
        "collapsed": false
      },
      "order": 47,
      "mode": 0,
      "inputs": [
        {
          "label": "clip",
          "name": "clip",
          "type": "CLIP",
          "link": 81
        },
        {
          "label": "text",
          "name": "text",
          "type": "STRING",
          "widget": {
            "name": "text"
          },
          "link": 151
        }
      ],
      "outputs": [
        {
          "label": "CONDITIONING",
          "name": "CONDITIONING",
          "type": "CONDITIONING",
          "slot_index": 0,
          "links": [
            64,
            277
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "CLIPTextEncode"
      },
      "widgets_values": [
        ""
      ],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 41,
      "type": "VAELoader",
      "pos": [
        30290,
        7610
      ],
      "size": [
        230,
        58
      ],
      "flags": {},
      "order": 3,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "label": "VAE",
          "name": "VAE",
          "type": "VAE",
          "slot_index": 0,
          "links": [
            42
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "VAELoader"
      },
      "widgets_values": [
        "ae.safetensors"
      ],
      "color": "#2a363b",
      "bgcolor": "#3f5159"
    },
    {
      "id": 7,
      "type": "Note",
      "pos": [
        28560,
        7620
      ],
      "size": [
        300,
        88
      ],
      "flags": {},
      "order": 4,
      "mode": 0,
      "inputs": [],
      "outputs": [],
      "title": "Tips",
      "properties": {},
      "widgets_values": [
        "Change context_expand_factor to specify how large the image should be cropped. (larger for more context, but less resolution.)"
      ],
      "color": "#322",
      "bgcolor": "#533"
    },
    {
      "id": 245,
      "type": "Reroute",
      "pos": [
        29000,
        7770
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 43,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 287
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            288,
            289,
            290
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 246,
      "type": "Reroute",
      "pos": [
        30980,
        8320
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 49,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 291
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "STITCH",
          "slot_index": 0,
          "links": [
            292
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 247,
      "type": "Reroute",
      "pos": [
        31280,
        8000
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 55,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 292
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "STITCH",
          "slot_index": 0,
          "links": [
            293
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 124,
      "type": "Reroute",
      "pos": [
        34310,
        7500
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 102,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 134
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "MASK",
          "links": [
            133
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 69,
      "type": "SaveImage",
      "pos": [
        35840,
        7210
      ],
      "size": [
        315,
        58
      ],
      "flags": {
        "collapsed": true
      },
      "order": 82,
      "mode": 0,
      "inputs": [
        {
          "name": "images",
          "type": "IMAGE",
          "link": 285
        }
      ],
      "outputs": [],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44"
      },
      "widgets_values": [
        "ComfyUI"
      ]
    },
    {
      "id": 116,
      "type": "RandomNoise",
      "pos": [
        32860,
        7070
      ],
      "size": [
        270,
        82
      ],
      "flags": {},
      "order": 5,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "NOISE",
          "type": "NOISE",
          "slot_index": 0,
          "links": [
            113
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "RandomNoise"
      },
      "widgets_values": [
        639164538428655,
        "randomize"
      ],
      "color": "#323",
      "bgcolor": "#535"
    },
    {
      "id": 34,
      "type": "BasicGuider",
      "pos": [
        32970,
        7210
      ],
      "size": [
        161.1999969482422,
        46
      ],
      "flags": {},
      "order": 68,
      "mode": 0,
      "inputs": [
        {
          "name": "model",
          "type": "MODEL",
          "link": 29
        },
        {
          "name": "conditioning",
          "type": "CONDITIONING",
          "link": 30
        }
      ],
      "outputs": [
        {
          "name": "GUIDER",
          "type": "GUIDER",
          "slot_index": 0,
          "links": [
            114
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "BasicGuider"
      },
      "widgets_values": [],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 40,
      "type": "KSamplerSelect",
      "pos": [
        32880,
        7310
      ],
      "size": [
        250,
        58
      ],
      "flags": {},
      "order": 6,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "SAMPLER",
          "type": "SAMPLER",
          "slot_index": 0,
          "links": [
            115
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "KSamplerSelect"
      },
      "widgets_values": [
        "dpmpp_2m"
      ],
      "color": "#323",
      "bgcolor": "#535"
    },
    {
      "id": 129,
      "type": "BasicScheduler",
      "pos": [
        32870,
        7420
      ],
      "size": [
        260,
        106
      ],
      "flags": {},
      "order": 104,
      "mode": 0,
      "inputs": [
        {
          "name": "model",
          "type": "MODEL",
          "link": 140
        }
      ],
      "outputs": [
        {
          "name": "SIGMAS",
          "type": "SIGMAS",
          "slot_index": 0,
          "links": [
            116
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "BasicScheduler"
      },
      "widgets_values": [
        "sgm_uniform",
        20,
        1
      ],
      "color": "#323",
      "bgcolor": "#535"
    },
    {
      "id": 120,
      "type": "LayerColor: BrightnessContrastV2",
      "pos": [
        34060,
        7270
      ],
      "size": [
        285.6000061035156,
        106
      ],
      "flags": {},
      "order": 99,
      "mode": 0,
      "inputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "link": 123
        }
      ],
      "outputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            132
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfyui_layerstyle",
        "ver": "1.0.90",
        "Node name for S&R": "LayerColor: BrightnessContrastV2"
      },
      "widgets_values": [
        1.05,
        0.98,
        1.05
      ],
      "color": "rgba(27, 89, 123, 0.7)"
    },
    {
      "id": 99,
      "type": "ImageCrop+",
      "pos": [
        33830,
        7270
      ],
      "size": [
        210,
        194
      ],
      "flags": {},
      "order": 91,
      "mode": 0,
      "inputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "link": 97
        },
        {
          "name": "width",
          "type": "INT",
          "widget": {
            "name": "width"
          },
          "link": 98
        },
        {
          "name": "height",
          "type": "INT",
          "widget": {
            "name": "height"
          },
          "link": 99
        }
      ],
      "outputs": [
        {
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            123
          ]
        },
        {
          "name": "x",
          "type": "INT",
          "slot_index": 1,
          "links": null
        },
        {
          "name": "y",
          "type": "INT",
          "links": null
        }
      ],
      "properties": {
        "cnr_id": "comfyui_essentials",
        "ver": "1.1.0",
        "Node name for S&R": "ImageCrop+"
      },
      "widgets_values": [
        256,
        256,
        "right-center",
        0,
        0
      ],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 107,
      "type": "ImageToMask",
      "pos": [
        34070,
        7500
      ],
      "size": [
        210,
        58
      ],
      "flags": {},
      "order": 95,
      "mode": 0,
      "inputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "link": 110
        }
      ],
      "outputs": [
        {
          "name": "MASK",
          "type": "MASK",
          "links": [
            134
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "ImageToMask"
      },
      "widgets_values": [
        "red"
      ],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 19,
      "type": "ImageCrop+",
      "pos": [
        33830,
        7500
      ],
      "size": [
        210,
        194
      ],
      "flags": {
        "collapsed": false
      },
      "order": 63,
      "mode": 0,
      "inputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "link": 14
        },
        {
          "name": "width",
          "type": "INT",
          "widget": {
            "name": "width"
          },
          "link": 15
        },
        {
          "name": "height",
          "type": "INT",
          "widget": {
            "name": "height"
          },
          "link": 16
        }
      ],
      "outputs": [
        {
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            110
          ]
        },
        {
          "name": "x",
          "type": "INT",
          "slot_index": 1,
          "links": null
        },
        {
          "name": "y",
          "type": "INT",
          "links": null
        }
      ],
      "properties": {
        "cnr_id": "comfyui_essentials",
        "ver": "1.1.0",
        "Node name for S&R": "ImageCrop+"
      },
      "widgets_values": [
        256,
        256,
        "right-center",
        0,
        0
      ],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 100,
      "type": "MaskToImage",
      "pos": [
        33550,
        7500
      ],
      "size": [
        184.62362670898438,
        26
      ],
      "flags": {},
      "order": 92,
      "mode": 0,
      "inputs": [
        {
          "name": "mask",
          "type": "MASK",
          "link": 100
        }
      ],
      "outputs": [
        {
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            14
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "MaskToImage"
      },
      "widgets_values": [],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 122,
      "type": "Reroute",
      "pos": [
        34180,
        7910
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 61,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 130
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            131
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 96,
      "type": "Reroute",
      "pos": [
        32670,
        7050
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 88,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 94
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "MODEL",
          "slot_index": 0,
          "links": [
            118,
            295
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 98,
      "type": "Reroute",
      "pos": [
        32580,
        7420
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 90,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 96
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "MODEL",
          "links": [
            140
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 33,
      "type": "FluxGuidance",
      "pos": [
        32570,
        7230
      ],
      "size": [
        211.60000610351562,
        58
      ],
      "flags": {},
      "order": 67,
      "mode": 0,
      "inputs": [
        {
          "label": "conditioning",
          "name": "conditioning",
          "type": "CONDITIONING",
          "link": 28
        }
      ],
      "outputs": [
        {
          "label": "CONDITIONING",
          "name": "CONDITIONING",
          "type": "CONDITIONING",
          "slot_index": 0,
          "links": [
            30,
            306
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "FluxGuidance"
      },
      "widgets_values": [
        30
      ],
      "color": "#323",
      "bgcolor": "#535"
    },
    {
      "id": 123,
      "type": "ImageCompositeMasked",
      "pos": [
        34430,
        7250
      ],
      "size": [
        210,
        146
      ],
      "flags": {},
      "order": 101,
      "mode": 0,
      "inputs": [
        {
          "name": "destination",
          "type": "IMAGE",
          "link": 131
        },
        {
          "name": "source",
          "type": "IMAGE",
          "link": 132
        },
        {
          "name": "mask",
          "shape": 7,
          "type": "MASK",
          "link": 133
        }
      ],
      "outputs": [
        {
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            282,
            307
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "ImageCompositeMasked"
      },
      "widgets_values": [
        0,
        0,
        false
      ],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 45,
      "type": "Note",
      "pos": [
        31410,
        7440
      ],
      "size": [
        270,
        100
      ],
      "flags": {},
      "order": 7,
      "mode": 0,
      "inputs": [],
      "outputs": [],
      "title": "Tips",
      "properties": {},
      "widgets_values": [
        "Image Strength\n\nHighest = keep the tone color of subject\nHigh = tone color fits better\nMedium = like High, sometimes better"
      ],
      "color": "#322",
      "bgcolor": "#533"
    },
    {
      "id": 87,
      "type": "Note",
      "pos": [
        30320,
        8000
      ],
      "size": [
        210,
        90
      ],
      "flags": {},
      "order": 8,
      "mode": 0,
      "inputs": [],
      "outputs": [],
      "title": "Tips",
      "properties": {},
      "widgets_values": [
        "if you encounter ImageConcatenate error about dimension,\n\nSet match_image_size = true."
      ],
      "color": "#322",
      "bgcolor": "#533"
    },
    {
      "id": 60,
      "type": "Reroute",
      "pos": [
        32030,
        7830
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 34,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 53
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "VAE",
          "links": [
            103
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 110,
      "type": "SamplerCustomAdvanced",
      "pos": [
        33190,
        7270
      ],
      "size": [
        236.8000030517578,
        106
      ],
      "flags": {},
      "order": 97,
      "mode": 0,
      "inputs": [
        {
          "name": "noise",
          "type": "NOISE",
          "link": 113
        },
        {
          "name": "guider",
          "type": "GUIDER",
          "link": 114
        },
        {
          "name": "sampler",
          "type": "SAMPLER",
          "link": 115
        },
        {
          "name": "sigmas",
          "type": "SIGMAS",
          "link": 116
        },
        {
          "name": "latent_image",
          "type": "LATENT",
          "link": 117
        }
      ],
      "outputs": [
        {
          "name": "output",
          "type": "LATENT",
          "slot_index": 0,
          "links": [
            108
          ]
        },
        {
          "name": "denoised_output",
          "type": "LATENT",
          "links": null
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "SamplerCustomAdvanced"
      },
      "widgets_values": [],
      "color": "#233",
      "bgcolor": "#355"
    },
    {
      "id": 143,
      "type": "Reroute",
      "pos": [
        30610,
        7000
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 25,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 179
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "CLIP",
          "slot_index": 0,
          "links": [
            185
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 43,
      "type": "Reroute",
      "pos": [
        30670,
        7500
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 22,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 33
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "CLIP_VISION",
          "links": [
            83
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 53,
      "type": "Reroute",
      "pos": [
        30550,
        7730
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 21,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 42
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "VAE",
          "slot_index": 0,
          "links": [
            52
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 67,
      "type": "Reroute",
      "pos": [
        29290,
        8230
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 51,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 290
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "links": [
            11
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 68,
      "type": "Reroute",
      "pos": [
        29040,
        8200
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 44,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 62
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "MASK",
          "slot_index": 0,
          "links": [
            59
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 63,
      "type": "Reroute",
      "pos": [
        29180,
        8320
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 42,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 57
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "STITCH",
          "slot_index": 0,
          "links": [
            291
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 66,
      "type": "Reroute",
      "pos": [
        28540,
        8290
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 36,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 60
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "links": [
            7
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 103,
      "type": "Reroute",
      "pos": [
        33270,
        7830
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 39,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 103
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "VAE",
          "slot_index": 0,
          "links": [
            194
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 150,
      "type": "Reroute",
      "pos": [
        33500,
        7290
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 46,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 194
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "VAE",
          "slot_index": 0,
          "links": [
            193,
            197
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 101,
      "type": "GetImageSize+",
      "pos": [
        33550,
        7380
      ],
      "size": [
        159.50155639648438,
        66
      ],
      "flags": {},
      "order": 60,
      "mode": 0,
      "inputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "link": 101
        }
      ],
      "outputs": [
        {
          "name": "width",
          "type": "INT",
          "slot_index": 0,
          "links": [
            15,
            98
          ]
        },
        {
          "name": "height",
          "type": "INT",
          "slot_index": 1,
          "links": [
            16,
            99
          ]
        },
        {
          "name": "count",
          "type": "INT",
          "slot_index": 2,
          "links": null
        }
      ],
      "properties": {
        "cnr_id": "comfyui_essentials",
        "ver": "1.1.0",
        "Node name for S&R": "GetImageSize+"
      },
      "widgets_values": [],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 104,
      "type": "Reroute",
      "pos": [
        33380,
        7860
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 93,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 104
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "MASK",
          "slot_index": 0,
          "links": [
            100
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 102,
      "type": "Reroute",
      "pos": [
        33300,
        7910
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 59,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 146
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "links": [
            101,
            130
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 106,
      "type": "VAEDecode",
      "pos": [
        33640,
        7270
      ],
      "size": [
        140,
        46
      ],
      "flags": {},
      "order": 94,
      "mode": 0,
      "inputs": [
        {
          "label": "samples",
          "name": "samples",
          "type": "LATENT",
          "link": 108
        },
        {
          "label": "vae",
          "name": "vae",
          "type": "VAE",
          "link": 193
        }
      ],
      "outputs": [
        {
          "label": "IMAGE",
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            97
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "VAEDecode"
      },
      "widgets_values": [],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 248,
      "type": "Reroute",
      "pos": [
        35340,
        8000
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 57,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 293
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "STITCH",
          "slot_index": 0,
          "links": [
            294
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 244,
      "type": "StyleModelApplySimple",
      "pos": [
        31410,
        7300
      ],
      "size": [
        270,
        100
      ],
      "flags": {},
      "order": 107,
      "mode": 0,
      "inputs": [
        {
          "name": "conditioning",
          "type": "CONDITIONING",
          "link": 277
        },
        {
          "name": "style_model",
          "type": "STYLE_MODEL",
          "link": 279
        },
        {
          "name": "clip_vision_output",
          "type": "CLIP_VISION_OUTPUT",
          "link": 280
        }
      ],
      "outputs": [
        {
          "name": "CONDITIONING",
          "type": "CONDITIONING",
          "slot_index": 0,
          "links": [
            278
          ]
        }
      ],
      "properties": {
        "cnr_id": "ComfyUI_AdvancedRefluxControl",
        "ver": "2b95c2c866399ca1914b4da486fe52808f7a9c60",
        "Node name for S&R": "StyleModelApplySimple"
      },
      "widgets_values": [
        "high"
      ],
      "color": "#332922",
      "bgcolor": "#593930"
    },
    {
      "id": 21,
      "type": "Note",
      "pos": [
        28260,
        7960
      ],
      "size": [
        240,
        88
      ],
      "flags": {},
      "order": 9,
      "mode": 0,
      "inputs": [],
      "outputs": [],
      "title": "Tips",
      "properties": {},
      "widgets_values": [
        "This parameter will fix the height at 720. The maximum width or height of any loaded image should NOT be larger than 16384"
      ],
      "color": "#322",
      "bgcolor": "#533"
    },
    {
      "id": 42,
      "type": "CLIPVisionLoader",
      "pos": [
        30290,
        7430
      ],
      "size": [
        360,
        58
      ],
      "flags": {},
      "order": 10,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "label": "CLIP_VISION",
          "name": "CLIP_VISION",
          "type": "CLIP_VISION",
          "slot_index": 0,
          "links": [
            33
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "CLIPVisionLoader"
      },
      "widgets_values": [
        "model.safetensors"
      ],
      "color": "#2a363b",
      "bgcolor": "#3f5159"
    },
    {
      "id": 31,
      "type": "Prompt Multiple Styles Selector",
      "pos": [
        28432.77734375,
        7118.89794921875
      ],
      "size": [
        270,
        150
      ],
      "flags": {},
      "order": 11,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "positive_string",
          "type": "STRING",
          "slot_index": 0,
          "links": [
            24
          ]
        },
        {
          "name": "negative_string",
          "type": "STRING",
          "links": null
        }
      ],
      "properties": {
        "cnr_id": "was-ns",
        "ver": "3.0.0",
        "Node name for S&R": "Prompt Multiple Styles Selector"
      },
      "widgets_values": [
        "None",
        "None",
        "None",
        "None"
      ],
      "color": "#323",
      "bgcolor": "#535"
    },
    {
      "id": 118,
      "type": "UpscaleModelLoader",
      "pos": [
        34150,
        6700
      ],
      "size": [
        300,
        60
      ],
      "flags": {},
      "order": 12,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "UPSCALE_MODEL",
          "type": "UPSCALE_MODEL",
          "slot_index": 0,
          "links": [
            308
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "UpscaleModelLoader"
      },
      "widgets_values": [
        "4x_NMKD-Siax_200k.pth"
      ],
      "color": "#2a363b",
      "bgcolor": "#3f5159"
    },
    {
      "id": 27,
      "type": "Text Multiline",
      "pos": [
        27640,
        6970
      ],
      "size": [
        400,
        140
      ],
      "flags": {
        "collapsed": false
      },
      "order": 13,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "STRING",
          "type": "STRING",
          "slot_index": 0,
          "links": [
            139
          ]
        }
      ],
      "title": "Prompt 1",
      "properties": {
        "cnr_id": "was-ns",
        "ver": "3.0.0",
        "Node name for S&R": "Text Multiline"
      },
      "widgets_values": [
        "a photograph of a watch on a hand, masterpiece, best quality, 8k uhd, sharp focus, professional lighting, photorealism"
      ]
    },
    {
      "id": 250,
      "type": "PreviewImage",
      "pos": [
        34345.8203125,
        6845.99365234375
      ],
      "size": [
        330,
        300
      ],
      "flags": {
        "collapsed": false
      },
      "order": 109,
      "mode": 0,
      "inputs": [
        {
          "name": "images",
          "type": "IMAGE",
          "link": 307
        }
      ],
      "outputs": [],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "PreviewImage"
      },
      "widgets_values": []
    },
    {
      "id": 109,
      "type": "Image Comparer (rgthree)",
      "pos": [
        35830.0859375,
        7168.8857421875
      ],
      "size": [
        860,
        900
      ],
      "flags": {},
      "order": 96,
      "mode": 0,
      "inputs": [
        {
          "dir": 3,
          "name": "image_a",
          "type": "IMAGE",
          "link": 286
        },
        {
          "dir": 3,
          "name": "image_b",
          "type": "IMAGE",
          "link": 112
        }
      ],
      "outputs": [],
      "properties": {
        "cnr_id": "rgthree-comfy",
        "ver": "1.0.2507112302",
        "comparer_mode": "Slide"
      },
      "widgets_values": [
        [
          {
            "name": "A",
            "selected": true,
            "url": "/api/view?filename=rgthree.compare._temp_pdrhl_00011_.png&type=temp&subfolder=&rand=0.058496216724264416"
          },
          {
            "name": "B",
            "selected": true,
            "url": "/api/view?filename=rgthree.compare._temp_pdrhl_00012_.png&type=temp&subfolder=&rand=0.7619483455011395"
          }
        ]
      ]
    },
    {
      "id": 249,
      "type": "Reroute",
      "pos": [
        34670,
        6610
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 108,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 304
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "CONDITIONING",
          "slot_index": 0,
          "links": [
            299,
            300,
            320,
            321
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 125,
      "type": "InpaintStitch",
      "pos": [
        35463.50390625,
        7272.861328125
      ],
      "size": [
        327.3716735839844,
        80
      ],
      "flags": {},
      "order": 103,
      "mode": 0,
      "inputs": [
        {
          "name": "stitch",
          "type": "STITCH",
          "link": 294
        },
        {
          "name": "inpainted_image",
          "type": "IMAGE",
          "link": 329
        }
      ],
      "outputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            285,
            286,
            325
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfyui-inpaint-cropandstitch",
        "ver": "2.1.7",
        "Node name for S&R": "InpaintStitch"
      },
      "widgets_values": [
        "bislerp"
      ],
      "color": "#432",
      "bgcolor": "#653"
    },
    {
      "id": 258,
      "type": "PreviewImage",
      "pos": [
        36285.96875,
        6577.28271484375
      ],
      "size": [
        520.666015625,
        461.7162170410156
      ],
      "flags": {},
      "order": 112,
      "mode": 0,
      "inputs": [
        {
          "name": "images",
          "type": "IMAGE",
          "link": 326
        }
      ],
      "outputs": [],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "PreviewImage"
      },
      "widgets_values": []
    },
    {
      "id": 257,
      "type": "UltimateSDUpscale",
      "pos": [
        35922.94140625,
        6480.72998046875
      ],
      "size": [
        270,
        614
      ],
      "flags": {},
      "order": 111,
      "mode": 0,
      "inputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "link": 325
        },
        {
          "name": "model",
          "type": "MODEL",
          "link": 324
        },
        {
          "name": "positive",
          "type": "CONDITIONING",
          "link": 320
        },
        {
          "name": "negative",
          "type": "CONDITIONING",
          "link": 321
        },
        {
          "name": "vae",
          "type": "VAE",
          "link": 323
        },
        {
          "name": "upscale_model",
          "type": "UPSCALE_MODEL",
          "link": 322
        }
      ],
      "outputs": [
        {
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            326
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfyui_ultimatesdupscale",
        "ver": "1.3.3",
        "Node name for S&R": "UltimateSDUpscale"
      },
      "widgets_values": [
        2.0000000000000004,
        1035610889926429,
        "randomize",
        10,
        1,
        "euler",
        "normal",
        0.02,
        "Chess",
        1024,
        1024,
        8,
        32,
        "None",
        1,
        64,
        8,
        16,
        true,
        false
      ],
      "color": "#323",
      "bgcolor": "#535"
    },
    {
      "id": 259,
      "type": "TeaCache",
      "pos": [
        30536.5625,
        6747.8154296875
      ],
      "size": [
        270,
        154
      ],
      "flags": {},
      "order": 28,
      "mode": 0,
      "inputs": [
        {
          "name": "model",
          "type": "MODEL",
          "link": 327
        }
      ],
      "outputs": [
        {
          "name": "model",
          "type": "MODEL",
          "links": [
            328
          ]
        }
      ],
      "properties": {
        "cnr_id": "teacache",
        "ver": "1.9.0",
        "Node name for S&R": "TeaCache"
      },
      "widgets_values": [
        "flux",
        0.4,
        0,
        1,
        "cuda"
      ]
    },
    {
      "id": 44,
      "type": "StyleModelLoader",
      "pos": [
        30290,
        7320
      ],
      "size": [
        360,
        58
      ],
      "flags": {},
      "order": 14,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "label": "STYLE_MODEL",
          "name": "STYLE_MODEL",
          "type": "STYLE_MODEL",
          "slot_index": 0,
          "links": [
            279
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "StyleModelLoader"
      },
      "widgets_values": [
        "flux1-redux-dev.safetensors"
      ],
      "color": "#2a363b",
      "bgcolor": "#3f5159"
    },
    {
      "id": 26,
      "type": "DualCLIPLoader",
      "pos": [
        30290,
        7120
      ],
      "size": [
        290,
        130
      ],
      "flags": {},
      "order": 15,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "label": "CLIP",
          "name": "CLIP",
          "type": "CLIP",
          "slot_index": 0,
          "links": [
            179
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "DualCLIPLoader"
      },
      "widgets_values": [
        "t5xxl_fp8_e4m3fn.safetensors",
        "clip_l.safetensors",
        "flux",
        "cpu"
      ],
      "color": "#2a363b",
      "bgcolor": "#3f5159"
    },
    {
      "id": 108,
      "type": "Note",
      "pos": [
        33949.1328125,
        7108.9619140625
      ],
      "size": [
        340,
        88
      ],
      "flags": {},
      "order": 16,
      "mode": 0,
      "inputs": [],
      "outputs": [],
      "title": "Tips",
      "properties": {},
      "widgets_values": [
        "If this node got error, try reloading ComfyUI and other workflows first. If the problem persists, you can bypass it or just remove it entirely."
      ],
      "color": "#322",
      "bgcolor": "#533"
    },
    {
      "id": 254,
      "type": "PreviewImage",
      "pos": [
        35317.83203125,
        6809.55615234375
      ],
      "size": [
        335.5359802246094,
        269.9360046386719
      ],
      "flags": {},
      "order": 110,
      "mode": 0,
      "inputs": [
        {
          "name": "images",
          "type": "IMAGE",
          "link": 311
        }
      ],
      "outputs": [],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "PreviewImage"
      },
      "widgets_values": []
    },
    {
      "id": 112,
      "type": "Fast Groups Bypasser (rgthree)",
      "pos": [
        27640,
        6680
      ],
      "size": [
        400,
        120
      ],
      "flags": {},
      "order": 17,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "OPT_CONNECTION",
          "type": "*",
          "slot_index": 0,
          "links": null
        }
      ],
      "title": "Controller",
      "properties": {
        "matchColors": "",
        "matchTitle": "",
        "showNav": true,
        "sort": "position",
        "customSortAlphabet": "",
        "toggleRestriction": "default"
      },
      "color": "#323",
      "bgcolor": "#535"
    },
    {
      "id": 84,
      "type": "PreviewImage",
      "pos": [
        29782.77734375,
        7818.89794921875
      ],
      "size": [
        284.2586669921875,
        304.5681457519531
      ],
      "flags": {},
      "order": 84,
      "mode": 0,
      "inputs": [
        {
          "name": "images",
          "type": "IMAGE",
          "link": 79
        }
      ],
      "outputs": [],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "PreviewImage"
      },
      "widgets_values": []
    },
    {
      "id": 121,
      "type": "UltimateSDUpscale",
      "pos": [
        34780,
        6560
      ],
      "size": [
        270,
        614
      ],
      "flags": {},
      "order": 100,
      "mode": 0,
      "inputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "link": 282
        },
        {
          "name": "model",
          "type": "MODEL",
          "link": 305
        },
        {
          "name": "positive",
          "type": "CONDITIONING",
          "link": 299
        },
        {
          "name": "negative",
          "type": "CONDITIONING",
          "link": 300
        },
        {
          "name": "vae",
          "type": "VAE",
          "link": 303
        },
        {
          "name": "upscale_model",
          "type": "UPSCALE_MODEL",
          "link": 309
        }
      ],
      "outputs": [
        {
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            311,
            329
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfyui_ultimatesdupscale",
        "ver": "1.3.3",
        "Node name for S&R": "UltimateSDUpscale"
      },
      "widgets_values": [
        1.0000000000000002,
        128275408653737,
        "randomize",
        10,
        1,
        "euler",
        "normal",
        0.02,
        "Chess",
        1024,
        1024,
        8,
        32,
        "None",
        1,
        64,
        8,
        16,
        true,
        false
      ],
      "color": "#323",
      "bgcolor": "#535"
    },
    {
      "id": 148,
      "type": "Reroute",
      "pos": [
        32840,
        6580
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 106,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 295
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "MODEL",
          "slot_index": 0,
          "links": [
            305,
            324,
            330
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 147,
      "type": "Reroute",
      "pos": [
        32879.6328125,
        6631.43994140625
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 105,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 306
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "CONDITIONING",
          "slot_index": 0,
          "links": [
            304,
            331,
            332
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 152,
      "type": "Reroute",
      "pos": [
        33710,
        6640
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 53,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 197
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "VAE",
          "slot_index": 0,
          "links": [
            303,
            323,
            333
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 251,
      "type": "Reroute",
      "pos": [
        34480,
        6660
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 23,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 308
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "UPSCALE_MODEL",
          "slot_index": 0,
          "links": [
            309,
            322,
            334
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 35,
      "type": "Reroute",
      "pos": [
        28117.5859375,
        7213.8974609375
      ],
      "size": [
        75,
        26
      ],
      "flags": {},
      "order": 69,
      "mode": 0,
      "inputs": [
        {
          "name": "",
          "type": "*",
          "link": 336
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            268
          ]
        }
      ],
      "properties": {
        "showOutputText": false,
        "horizontal": false
      }
    },
    {
      "id": 263,
      "type": "PreviewImage",
      "pos": [
        29263.74609375,
        6418.60205078125
      ],
      "size": [
        292.8422546386719,
        309.53326416015625
      ],
      "flags": {},
      "order": 114,
      "mode": 0,
      "inputs": [
        {
          "name": "images",
          "type": "IMAGE",
          "link": 337
        }
      ],
      "outputs": [],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.45",
        "Node name for S&R": "PreviewImage"
      },
      "widgets_values": []
    },
    {
      "id": 262,
      "type": "UltimateSDUpscale",
      "pos": [
        28870.333984375,
        6469.77001953125
      ],
      "size": [
        270,
        614
      ],
      "flags": {},
      "order": 113,
      "mode": 0,
      "inputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "link": 335
        },
        {
          "name": "model",
          "type": "MODEL",
          "link": 330
        },
        {
          "name": "positive",
          "type": "CONDITIONING",
          "link": 331
        },
        {
          "name": "negative",
          "type": "CONDITIONING",
          "link": 332
        },
        {
          "name": "vae",
          "type": "VAE",
          "link": 333
        },
        {
          "name": "upscale_model",
          "type": "UPSCALE_MODEL",
          "link": 334
        }
      ],
      "outputs": [
        {
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            336,
            337
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfyui_ultimatesdupscale",
        "ver": "1.3.3",
        "Node name for S&R": "UltimateSDUpscale"
      },
      "widgets_values": [
        2.0000000000000004,
        128275408653737,
        "randomize",
        20,
        1,
        "euler",
        "normal",
        0.02,
        "Chess",
        1024,
        1024,
        8,
        32,
        "None",
        1,
        64,
        8,
        16,
        true,
        false
      ],
      "color": "#323",
      "bgcolor": "#535"
    },
    {
      "id": 37,
      "type": "LoadImage",
      "pos": [
        27640,
        7160
      ],
      "size": [
        400,
        540
      ],
      "flags": {},
      "order": 18,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            335
          ]
        },
        {
          "name": "MASK",
          "type": "MASK",
          "slot_index": 1,
          "links": []
        }
      ],
      "title": "Insert object",
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "LoadImage"
      },
      "widgets_values": [
        "pngtree-transparent-watch-elegant-png-image_14021451.png",
        "image"
      ]
    },
    {
      "id": 18,
      "type": "LoadImage",
      "pos": [
        27640,
        7750
      ],
      "size": [
        400,
        460
      ],
      "flags": {},
      "order": 19,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "IMAGE",
          "type": "IMAGE",
          "slot_index": 0,
          "links": [
            20
          ]
        },
        {
          "name": "MASK",
          "type": "MASK",
          "slot_index": 1,
          "links": [
            21
          ]
        }
      ],
      "title": "Load destination (right-click to mask the area)",
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "LoadImage"
      },
      "widgets_values": [
        "hand.jpg",
        "image"
      ]
    },
    {
      "id": 20,
      "type": "UNETLoader",
      "pos": [
        30290,
        6980
      ],
      "size": [
        290,
        82
      ],
      "flags": {},
      "order": 20,
      "mode": 0,
      "inputs": [],
      "outputs": [
        {
          "name": "MODEL",
          "type": "MODEL",
          "slot_index": 0,
          "links": [
            327
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfy-core",
        "ver": "0.3.44",
        "Node name for S&R": "UNETLoader"
      },
      "widgets_values": [
        "flux1-dev-fp8-e4m3fn.safetensors",
        "default"
      ],
      "color": "#2a363b",
      "bgcolor": "#3f5159"
    },
    {
      "id": 92,
      "type": "InpaintCrop",
      "pos": [
        28550,
        7771.62158203125
      ],
      "size": [
        322.7027282714844,
        458
      ],
      "flags": {},
      "order": 37,
      "mode": 0,
      "inputs": [
        {
          "name": "image",
          "type": "IMAGE",
          "link": 85
        },
        {
          "name": "mask",
          "type": "MASK",
          "link": 273
        },
        {
          "name": "optional_context_mask",
          "shape": 7,
          "type": "MASK",
          "link": null
        },
        {
          "name": "min_height",
          "type": "INT",
          "widget": {
            "name": "min_height"
          },
          "link": 88
        },
        {
          "name": "max_height",
          "type": "INT",
          "widget": {
            "name": "max_height"
          },
          "link": 87
        }
      ],
      "outputs": [
        {
          "name": "stitch",
          "type": "STITCH",
          "slot_index": 0,
          "links": [
            57
          ]
        },
        {
          "name": "cropped_image",
          "type": "IMAGE",
          "slot_index": 1,
          "links": [
            287
          ]
        },
        {
          "name": "cropped_mask",
          "type": "MASK",
          "slot_index": 2,
          "links": [
            62
          ]
        }
      ],
      "properties": {
        "cnr_id": "comfyui-inpaint-cropandstitch",
        "ver": "2.1.7",
        "Node name for S&R": "InpaintCrop"
      },
      "widgets_values": [
        20,
        1.2,
        true,
        8,
        false,
        8,
        "bicubic",
        "ranged size",
        1024,
        1024,
        1,
        1,
        720,
        16384,
        720,
        128
      ],
      "color": "#232",
      "bgcolor": "#353"
    }
  ],
  "links": [
    [
      7,
      66,
      0,
      8,
      0,
      "*"
    ],
    [
      11,
      67,
      0,
      12,
      0,
      "*"
    ],
    [
      14,
      100,
      0,
      19,
      0,
      "IMAGE"
    ],
    [
      15,
      101,
      0,
      19,
      1,
      "INT"
    ],
    [
      16,
      101,
      1,
      19,
      2,
      "INT"
    ],
    [
      17,
      62,
      0,
      22,
      0,
      "IMAGE"
    ],
    [
      18,
      22,
      0,
      23,
      0,
      "INT"
    ],
    [
      19,
      22,
      1,
      23,
      1,
      "INT"
    ],
    [
      20,
      18,
      0,
      24,
      0,
      "*"
    ],
    [
      21,
      18,
      1,
      25,
      0,
      "*"
    ],
    [
      23,
      86,
      0,
      29,
      0,
      "STRING"
    ],
    [
      24,
      31,
      0,
      29,
      1,
      "STRING"
    ],
    [
      25,
      30,
      0,
      29,
      2,
      "STRING"
    ],
    [
      26,
      17,
      0,
      30,
      0,
      "*"
    ],
    [
      27,
      51,
      0,
      32,
      0,
      "*"
    ],
    [
      28,
      55,
      0,
      33,
      0,
      "CONDITIONING"
    ],
    [
      29,
      111,
      0,
      34,
      0,
      "MODEL"
    ],
    [
      30,
      33,
      0,
      34,
      1,
      "CONDITIONING"
    ],
    [
      32,
      15,
      0,
      36,
      0,
      "*"
    ],
    [
      33,
      42,
      0,
      43,
      0,
      "*"
    ],
    [
      34,
      23,
      0,
      46,
      0,
      "IMAGE"
    ],
    [
      35,
      65,
      0,
      46,
      1,
      "IMAGE"
    ],
    [
      36,
      46,
      0,
      47,
      0,
      "IMAGE"
    ],
    [
      37,
      47,
      0,
      48,
      0,
      "MASK"
    ],
    [
      38,
      46,
      0,
      50,
      0,
      "IMAGE"
    ],
    [
      40,
      61,
      0,
      52,
      0,
      "IMAGE"
    ],
    [
      42,
      41,
      0,
      53,
      0,
      "*"
    ],
    [
      43,
      85,
      0,
      55,
      0,
      "CONDITIONING"
    ],
    [
      44,
      85,
      0,
      55,
      1,
      "CONDITIONING"
    ],
    [
      45,
      59,
      0,
      55,
      2,
      "VAE"
    ],
    [
      47,
      32,
      0,
      55,
      4,
      "MASK"
    ],
    [
      48,
      55,
      2,
      56,
      0,
      "*"
    ],
    [
      52,
      53,
      0,
      59,
      0,
      "*"
    ],
    [
      53,
      59,
      0,
      60,
      0,
      "*"
    ],
    [
      55,
      64,
      1,
      61,
      1,
      "INT"
    ],
    [
      56,
      61,
      0,
      62,
      0,
      "*"
    ],
    [
      57,
      92,
      0,
      63,
      0,
      "*"
    ],
    [
      59,
      68,
      0,
      65,
      0,
      "MASK"
    ],
    [
      60,
      13,
      0,
      66,
      0,
      "*"
    ],
    [
      62,
      92,
      2,
      68,
      0,
      "*"
    ],
    [
      64,
      89,
      0,
      70,
      0,
      "CONDITIONING"
    ],
    [
      72,
      12,
      0,
      77,
      0,
      "*"
    ],
    [
      73,
      8,
      0,
      78,
      0,
      "*"
    ],
    [
      79,
      52,
      0,
      84,
      0,
      "IMAGE"
    ],
    [
      80,
      70,
      0,
      85,
      0,
      "*"
    ],
    [
      81,
      57,
      1,
      89,
      0,
      "CLIP"
    ],
    [
      83,
      43,
      0,
      90,
      0,
      "CLIP_VISION"
    ],
    [
      85,
      13,
      0,
      92,
      0,
      "IMAGE"
    ],
    [
      87,
      91,
      0,
      92,
      4,
      "INT"
    ],
    [
      88,
      91,
      0,
      92,
      3,
      "INT"
    ],
    [
      89,
      57,
      0,
      93,
      0,
      "MODEL"
    ],
    [
      90,
      95,
      0,
      94,
      0,
      "MODEL"
    ],
    [
      91,
      97,
      0,
      94,
      1,
      "INT"
    ],
    [
      92,
      97,
      1,
      94,
      2,
      "INT"
    ],
    [
      93,
      93,
      0,
      95,
      0,
      "*"
    ],
    [
      94,
      94,
      0,
      96,
      0,
      "*"
    ],
    [
      95,
      58,
      0,
      97,
      0,
      "IMAGE"
    ],
    [
      96,
      94,
      0,
      98,
      0,
      "*"
    ],
    [
      97,
      106,
      0,
      99,
      0,
      "IMAGE"
    ],
    [
      98,
      101,
      0,
      99,
      1,
      "INT"
    ],
    [
      99,
      101,
      1,
      99,
      2,
      "INT"
    ],
    [
      100,
      104,
      0,
      100,
      0,
      "MASK"
    ],
    [
      101,
      102,
      0,
      101,
      0,
      "IMAGE"
    ],
    [
      103,
      60,
      0,
      103,
      0,
      "*"
    ],
    [
      104,
      51,
      0,
      104,
      0,
      "*"
    ],
    [
      108,
      110,
      0,
      106,
      0,
      "LATENT"
    ],
    [
      110,
      19,
      0,
      107,
      0,
      "IMAGE"
    ],
    [
      112,
      76,
      0,
      109,
      1,
      "IMAGE"
    ],
    [
      113,
      116,
      0,
      110,
      0,
      "NOISE"
    ],
    [
      114,
      34,
      0,
      110,
      1,
      "GUIDER"
    ],
    [
      115,
      40,
      0,
      110,
      2,
      "SAMPLER"
    ],
    [
      116,
      129,
      0,
      110,
      3,
      "SIGMAS"
    ],
    [
      117,
      56,
      0,
      110,
      4,
      "LATENT"
    ],
    [
      118,
      96,
      0,
      111,
      0,
      "*"
    ],
    [
      123,
      99,
      0,
      120,
      0,
      "IMAGE"
    ],
    [
      130,
      102,
      0,
      122,
      0,
      "*"
    ],
    [
      131,
      122,
      0,
      123,
      0,
      "IMAGE"
    ],
    [
      132,
      120,
      0,
      123,
      1,
      "IMAGE"
    ],
    [
      133,
      124,
      0,
      123,
      2,
      "MASK"
    ],
    [
      134,
      107,
      0,
      124,
      0,
      "*"
    ],
    [
      139,
      27,
      0,
      128,
      0,
      "*"
    ],
    [
      140,
      98,
      0,
      129,
      0,
      "MODEL"
    ],
    [
      146,
      77,
      0,
      102,
      0,
      "*"
    ],
    [
      148,
      78,
      0,
      76,
      0,
      "*"
    ],
    [
      149,
      48,
      0,
      51,
      0,
      "*"
    ],
    [
      151,
      29,
      0,
      89,
      1,
      "STRING"
    ],
    [
      153,
      52,
      0,
      58,
      0,
      "*"
    ],
    [
      154,
      58,
      0,
      55,
      3,
      "IMAGE"
    ],
    [
      179,
      26,
      0,
      143,
      0,
      "*"
    ],
    [
      185,
      143,
      0,
      57,
      1,
      "CLIP"
    ],
    [
      193,
      150,
      0,
      106,
      1,
      "VAE"
    ],
    [
      194,
      103,
      0,
      150,
      0,
      "*"
    ],
    [
      197,
      150,
      0,
      152,
      0,
      "*"
    ],
    [
      262,
      61,
      0,
      90,
      1,
      "IMAGE"
    ],
    [
      268,
      35,
      0,
      15,
      0,
      "*"
    ],
    [
      269,
      128,
      0,
      17,
      0,
      "*"
    ],
    [
      271,
      24,
      0,
      13,
      0,
      "*"
    ],
    [
      272,
      25,
      0,
      14,
      0,
      "*"
    ],
    [
      273,
      14,
      0,
      92,
      1,
      "MASK"
    ],
    [
      275,
      36,
      0,
      61,
      0,
      "IMAGE"
    ],
    [
      277,
      89,
      0,
      244,
      0,
      "CONDITIONING"
    ],
    [
      278,
      244,
      0,
      70,
      1,
      "CONDITIONING"
    ],
    [
      279,
      44,
      0,
      244,
      1,
      "STYLE_MODEL"
    ],
    [
      280,
      90,
      0,
      244,
      2,
      "CLIP_VISION_OUTPUT"
    ],
    [
      282,
      123,
      0,
      121,
      0,
      "IMAGE"
    ],
    [
      285,
      125,
      0,
      69,
      0,
      "IMAGE"
    ],
    [
      286,
      125,
      0,
      109,
      0,
      "IMAGE"
    ],
    [
      287,
      92,
      1,
      245,
      0,
      "*"
    ],
    [
      288,
      245,
      0,
      52,
      1,
      "IMAGE"
    ],
    [
      289,
      245,
      0,
      64,
      0,
      "IMAGE"
    ],
    [
      290,
      245,
      0,
      67,
      0,
      "*"
    ],
    [
      291,
      63,
      0,
      246,
      0,
      "*"
    ],
    [
      292,
      246,
      0,
      247,
      0,
      "*"
    ],
    [
      293,
      247,
      0,
      248,
      0,
      "*"
    ],
    [
      294,
      248,
      0,
      125,
      0,
      "STITCH"
    ],
    [
      295,
      96,
      0,
      148,
      0,
      "*"
    ],
    [
      299,
      249,
      0,
      121,
      2,
      "CONDITIONING"
    ],
    [
      300,
      249,
      0,
      121,
      3,
      "CONDITIONING"
    ],
    [
      303,
      152,
      0,
      121,
      4,
      "VAE"
    ],
    [
      304,
      147,
      0,
      249,
      0,
      "*"
    ],
    [
      305,
      148,
      0,
      121,
      1,
      "MODEL"
    ],
    [
      306,
      33,
      0,
      147,
      0,
      "*"
    ],
    [
      307,
      123,
      0,
      250,
      0,
      "IMAGE"
    ],
    [
      308,
      118,
      0,
      251,
      0,
      "*"
    ],
    [
      309,
      251,
      0,
      121,
      5,
      "UPSCALE_MODEL"
    ],
    [
      311,
      121,
      0,
      254,
      0,
      "IMAGE"
    ],
    [
      320,
      249,
      0,
      257,
      2,
      "CONDITIONING"
    ],
    [
      321,
      249,
      0,
      257,
      3,
      "CONDITIONING"
    ],
    [
      322,
      251,
      0,
      257,
      5,
      "UPSCALE_MODEL"
    ],
    [
      323,
      152,
      0,
      257,
      4,
      "VAE"
    ],
    [
      324,
      148,
      0,
      257,
      1,
      "MODEL"
    ],
    [
      325,
      125,
      0,
      257,
      0,
      "IMAGE"
    ],
    [
      326,
      257,
      0,
      258,
      0,
      "IMAGE"
    ],
    [
      327,
      20,
      0,
      259,
      0,
      "MODEL"
    ],
    [
      328,
      259,
      0,
      57,
      0,
      "MODEL"
    ],
    [
      329,
      121,
      0,
      125,
      1,
      "IMAGE"
    ],
    [
      330,
      148,
      0,
      262,
      1,
      "MODEL"
    ],
    [
      331,
      147,
      0,
      262,
      2,
      "CONDITIONING"
    ],
    [
      332,
      147,
      0,
      262,
      3,
      "CONDITIONING"
    ],
    [
      333,
      152,
      0,
      262,
      4,
      "VAE"
    ],
    [
      334,
      251,
      0,
      262,
      5,
      "UPSCALE_MODEL"
    ],
    [
      335,
      37,
      0,
      262,
      0,
      "IMAGE"
    ],
    [
      336,
      262,
      0,
      35,
      0,
      "*"
    ],
    [
      337,
      262,
      0,
      263,
      0,
      "IMAGE"
    ]
  ],
  "groups": [
    {
      "id": 9,
      "title": "Upscaler Unit",
      "bounding": [
        34770,
        6490,
        290,
        700
      ],
      "color": "#3f789e",
      "font_size": 24,
      "flags": {}
    }
  ],
  "config": {},
  "extra": {
    "ds": {
      "scale": 1.1918176537727276,
      "offset": [
        -28179.107507840858,
        -7699.794763788099
      ]
    },
    "node_versions": {
      "comfyui_essentials": "33ff89fd354d8ec3ab6affb605a79a931b445d99",
      "ComfyUI_Comfyroll_CustomNodes": "d78b780ae43fcf8c6b7c6505e6ffb4584281ceca",
      "pr-was-node-suite-comfyui-47064894": "056badacda52e88d29d6a65f9509cd3115ace0f2",
      "comfyui-reactor-node": "c94df09b2544390737ceb507bcfef7af336c6249",
      "comfy-core": "0.3.12",
      "comfyui-kjnodes": "3f141b8f1ca1c832a1c6accd806f2d2f40fd4075",
      "rgthree-comfy": "5d771b8b56a343c24a26e8cea1f0c87c3d58102f",
      "comfyui_ultimatesdupscale": "ff3fdfeee03de46d4462211cffd165d27155e858",
      "comfyui-inpaint-cropandstitch": "2abf837822d761110ac383d9a1cdffcc7ebfab36",
      "comfyui_layerstyle": "127be44f9d6b384e874a73ba794a7eeb8f2b6a0f",
      "ComfyUI_AdvancedRefluxControl": "0a87efa252ae5e8f4af1225b0e19c867f908376a"
    },
    "frontendVersion": "1.23.4"
  },
  "version": 0.4
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
