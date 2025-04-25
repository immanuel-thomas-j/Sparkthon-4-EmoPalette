import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { hexToHsb, hsbToHex } from "@/utils/colorUtils";
import { Color } from "@/utils/emotionColorMap";

interface ColorAdjustmentProps {
  selectedColor: Color;
  onColorChange: (updatedColor: Color) => void;
}

export default function ColorAdjustment({ 
  selectedColor, 
  onColorChange 
}: ColorAdjustmentProps) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [previewColor, setPreviewColor] = useState<string>(selectedColor.hex);

  // Update sliders when selected color changes
  useEffect(() => {
    if (selectedColor) {
      const hsb = hexToHsb(selectedColor.hex);
      setHue(hsb.h);
      setSaturation(hsb.s);
      setBrightness(hsb.b);
      setPreviewColor(selectedColor.hex);
    }
  }, [selectedColor]);

  // Update preview color when sliders change
  useEffect(() => {
    const newHex = hsbToHex(hue, saturation, brightness);
    setPreviewColor(newHex);
  }, [hue, saturation, brightness]);

  const updateHue = (value: number[]) => {
    setHue(value[0]);
  };

  const updateSaturation = (value: number[]) => {
    setSaturation(value[0]);
  };

  const updateBrightness = (value: number[]) => {
    setBrightness(value[0]);
  };

  const applyColorChanges = () => {
    const newHex = hsbToHex(hue, saturation, brightness);
    onColorChange({
      ...selectedColor,
      hex: newHex
    });
  };

  return (
    <section className="mb-10 bg-card rounded-lg shadow-md p-4 md:p-6">
      <h3 className="text-xl font-semibold mb-4">Adjust Your Palette</h3>

      <div className="mb-6">
        <div className="mb-2 flex justify-between">
          <label htmlFor="selected-color" className="font-medium">Selected Color:</label>
          <span className="text-muted-foreground" id="selected-color-hex">{previewColor}</span>
        </div>
        <div 
          className="h-12 rounded-md mb-2" 
          style={{ backgroundColor: previewColor }}
        ></div>
      </div>

      <div className="space-y-4">
        {/* Hue Slider */}
        <div>
          <div className="flex justify-between mb-1">
            <label htmlFor="hue-slider" className="text-sm font-medium">Hue</label>
            <span className="text-sm text-muted-foreground">{Math.round(hue)}°</span>
          </div>
          <div className="h-2 w-full rounded-md mb-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 to-red-500"></div>
          <Slider
            id="hue-slider"
            min={0}
            max={360}
            step={1}
            value={[hue]}
            onValueChange={updateHue}
          />
        </div>

        {/* Saturation Slider */}
        <div>
          <div className="flex justify-between mb-1">
            <label htmlFor="saturation-slider" className="text-sm font-medium">Saturation</label>
            <span className="text-sm text-muted-foreground">{Math.round(saturation)}%</span>
          </div>
          <div className="relative h-2 w-full rounded-md mb-1 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-gray-300 to-[color:var(--preview-pure-color)]" 
              style={{ 
                "--preview-pure-color": hsbToHex(hue, 100, brightness) 
              } as any}
            ></div>
          </div>
          <Slider
            id="saturation-slider"
            min={0}
            max={100}
            step={1}
            value={[saturation]}
            onValueChange={updateSaturation}
          />
        </div>

        {/* Brightness Slider */}
        <div>
          <div className="flex justify-between mb-1">
            <label htmlFor="brightness-slider" className="text-sm font-medium">Brightness</label>
            <span className="text-sm text-muted-foreground">{Math.round(brightness)}%</span>
          </div>
          <div className="relative h-2 w-full rounded-md mb-1 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-black to-[color:var(--preview-bright-color)]" 
              style={{ 
                "--preview-bright-color": hsbToHex(hue, saturation, 100) 
              } as any}
            ></div>
          </div>
          <Slider
            id="brightness-slider"
            min={0}
            max={100}
            step={1}
            value={[brightness]}
            onValueChange={updateBrightness}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button 
            onClick={applyColorChanges}
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </section>
  );
}
