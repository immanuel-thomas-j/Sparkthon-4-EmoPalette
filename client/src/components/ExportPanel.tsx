import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { X, Download, Copy, Image, Code } from "lucide-react";
import { Color } from "@/utils/emotionColorMap";
import html2canvas from "html2canvas";

type ExportFormat = "css" | "scss" | "json" | "hex";

interface ExportPanelProps {
  colors: Color[];
  onClose: () => void;
}

export default function ExportPanel({ colors, onClose }: ExportPanelProps) {
  const { toast } = useToast();
  const [activeFormat, setActiveFormat] = useState<ExportFormat>("css");
  const [previewCode, setPreviewCode] = useState<string>("");

  useEffect(() => {
    updatePreviewCode(activeFormat);
  }, [activeFormat, colors]);

  const updatePreviewCode = (format: ExportFormat) => {
    switch (format) {
      case "css":
        setPreviewCode(
          `:root {\n${colors.map((color, i) => `  --color-${i + 1}: ${color.hex};`).join("\n")}\n}`
        );
        break;
      case "scss":
        setPreviewCode(
          `${colors.map((color, i) => `$color-${i + 1}: ${color.hex};`).join("\n")}`
        );
        break;
      case "json":
        setPreviewCode(
          JSON.stringify(
            colors.reduce((acc, color, i) => {
              acc[`color-${i + 1}`] = color.hex;
              return acc;
            }, {} as Record<string, string>),
            null,
            2
          )
        );
        break;
      case "hex":
        setPreviewCode(colors.map(color => color.hex).join(", "));
        break;
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: message,
      duration: 2000,
    });
  };

  const downloadAsPNG = async () => {
    const paletteContainer = document.getElementById("palette-container");
    if (!paletteContainer) return;

    try {
      const canvas = await html2canvas(paletteContainer);
      const link = document.createElement("a");
      link.download = `emopalette-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast({
        title: "Download successful",
        description: "Your palette has been downloaded as a PNG image.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading your palette.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const downloadAsSVG = () => {
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="100" viewBox="0 0 500 100">
        ${colors.map((color, i) => `
          <rect x="${i * (500 / colors.length)}" y="0" width="${500 / colors.length}" height="100" fill="${color.hex}" />
          <text x="${i * (500 / colors.length) + (500 / colors.length) / 2}" y="120" font-family="Arial" font-size="12" text-anchor="middle">${color.hex}</text>
        `).join('')}
      </svg>
    `;
    
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = `emopalette-${Date.now()}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    
    toast({
      title: "Download successful",
      description: "Your palette has been downloaded as an SVG image.",
      duration: 2000,
    });
  };

  return (
    <section id="export-panel" className="mb-10 bg-card rounded-lg shadow-md p-4 md:p-6 fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Export Options</h3>
        <button
          className="text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Download Options */}
        <div>
          <h4 className="font-medium mb-3">Download</h4>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
              onClick={downloadAsPNG}
            >
              <span className="flex items-center">
                <Image className="h-5 w-5 mr-2" />
                PNG Image
              </span>
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
              onClick={downloadAsSVG}
            >
              <span className="flex items-center">
                <Image className="h-5 w-5 mr-2" />
                SVG Image
              </span>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Copy Code Options */}
        <div>
          <h4 className="font-medium mb-3">Copy Code</h4>
          <div className="space-y-3">
            <Button
              variant="outline"
              className={`w-full flex items-center justify-between ${activeFormat === 'css' ? 'border-primary' : ''}`}
              onClick={() => {
                setActiveFormat("css");
                copyToClipboard(
                  `:root {\n${colors.map((color, i) => `  --color-${i + 1}: ${color.hex};`).join("\n")}\n}`,
                  "CSS variables copied to clipboard"
                );
              }}
            >
              <span className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                CSS Variables
              </span>
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              className={`w-full flex items-center justify-between ${activeFormat === 'scss' ? 'border-primary' : ''}`}
              onClick={() => {
                setActiveFormat("scss");
                copyToClipboard(
                  `${colors.map((color, i) => `$color-${i + 1}: ${color.hex};`).join("\n")}`,
                  "SCSS variables copied to clipboard"
                );
              }}
            >
              <span className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                SCSS Variables
              </span>
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              className={`w-full flex items-center justify-between ${activeFormat === 'json' ? 'border-primary' : ''}`}
              onClick={() => {
                setActiveFormat("json");
                copyToClipboard(
                  JSON.stringify(
                    colors.reduce((acc, color, i) => {
                      acc[`color-${i + 1}`] = color.hex;
                      return acc;
                    }, {} as Record<string, string>),
                    null,
                    2
                  ),
                  "JSON copied to clipboard"
                );
              }}
            >
              <span className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                JSON
              </span>
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              className={`w-full flex items-center justify-between ${activeFormat === 'hex' ? 'border-primary' : ''}`}
              onClick={() => {
                setActiveFormat("hex");
                copyToClipboard(
                  colors.map(color => color.hex).join(", "),
                  "HEX values copied to clipboard"
                );
              }}
            >
              <span className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                All HEX Values
              </span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview of Export Code */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Preview</h4>
          <Button
            variant="link"
            size="sm"
            className="text-primary p-0 h-auto"
            onClick={() => copyToClipboard(previewCode, "Code copied to clipboard")}
          >
            Copy All
          </Button>
        </div>
        <div className="bg-muted rounded-md p-4 overflow-x-auto">
          <pre className="text-sm"><code>{previewCode}</code></pre>
        </div>
      </div>
    </section>
  );
}
