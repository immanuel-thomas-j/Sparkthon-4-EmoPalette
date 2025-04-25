import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Download, Lock, Unlock, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Color } from "@/utils/emotionColorMap";
import { hexToRgb } from "@/utils/colorUtils";

interface ColorPaletteDisplayProps {
  emotion: string;
  colors: Color[];
  lockedColors: Set<number>;
  selectedColorIndex: number;
  onRegeneratePalette: () => void;
  onToggleLock: (index: number) => void;
  onColorSelect: (index: number) => void;
  onExportClick: () => void;
}

export default function ColorPaletteDisplay({
  emotion,
  colors,
  lockedColors,
  selectedColorIndex,
  onRegeneratePalette,
  onToggleLock,
  onColorSelect,
  onExportClick,
}: ColorPaletteDisplayProps) {
  const { toast } = useToast();

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast({
      title: "Copied to clipboard",
      description: `${hex} has been copied to your clipboard.`,
      duration: 2000,
    });
  };

  const capitalizedEmotion = useMemo(() => {
    return emotion.charAt(0).toUpperCase() + emotion.slice(1);
  }, [emotion]);

  return (
    <section id="palette-container" className="fade-in mb-10">
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">
            Your "{capitalizedEmotion}" Palette
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            These colors are uniquely generated based on your input. Try different words, phrases, or even gibberish!
          </p>
        </div>
        <div className="flex space-x-2 mt-2 md:mt-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRegeneratePalette}
            className="flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Regenerate</span>
          </Button>
          <Button 
            size="sm"
            onClick={onExportClick}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Color Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {colors.map((color, index) => {
          const isLocked = lockedColors.has(index);
          const isSelected = index === selectedColorIndex;
          const rgb = hexToRgb(color.hex);
          
          return (
            <div 
              key={index}
              className={`color-card bg-card rounded-lg shadow-md overflow-hidden cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
              onClick={() => onColorSelect(index)}
            >
              <div 
                className="h-32 relative" 
                style={{ backgroundColor: color.hex }}
              >
                <button 
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-full shadow-sm hover:shadow transition-shadow duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock(index);
                  }}
                >
                  {isLocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Unlock className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{color.hex}</span>
                  <button 
                    className="text-gray-500 hover:text-primary transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyHex(color.hex);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-xs text-muted-foreground">
                  RGB: {rgb.r}, {rgb.g}, {rgb.b}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
