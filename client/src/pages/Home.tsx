import { useState } from "react";
import EmotionInputForm from "@/components/EmotionInputForm";
import ColorPaletteDisplay from "@/components/ColorPaletteDisplay";
import ColorAdjustment from "@/components/ColorAdjustment";
import ExportPanel from "@/components/ExportPanel";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { generatePaletteFromEmotion } from "@/utils/colorUtils";
import { Color } from "@/utils/emotionColorMap";

export default function Home() {
  const [emotion, setEmotion] = useState<string>("");
  const [paletteGenerated, setPaletteGenerated] = useState<boolean>(false);
  const [colors, setColors] = useState<Color[]>([]);
  const [lockedColors, setLockedColors] = useState<Set<number>>(new Set());
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [showExportPanel, setShowExportPanel] = useState<boolean>(false);

  const handleEmotionSubmit = (emotion: string) => {
    setEmotion(emotion);
    generateNewPalette(emotion);
  };

  const generateNewPalette = (emotionText: string) => {
    const newColors = generatePaletteFromEmotion(emotionText, colors, lockedColors);
    setColors(newColors);
    setPaletteGenerated(true);
  };

  const handleRegeneratePalette = () => {
    generateNewPalette(emotion);
  };

  const handleToggleLock = (index: number) => {
    setLockedColors(prev => {
      const newLockedColors = new Set(prev);
      if (newLockedColors.has(index)) {
        newLockedColors.delete(index);
      } else {
        newLockedColors.add(index);
      }
      return newLockedColors;
    });
  };

  const handleColorSelect = (index: number) => {
    setSelectedColorIndex(index);
  };

  const handleColorChange = (updatedColor: Color) => {
    setColors(prev => {
      const newColors = [...prev];
      newColors[selectedColorIndex] = updatedColor;
      return newColors;
    });
  };

  const toggleExportPanel = () => {
    setShowExportPanel(prev => !prev);
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 bg-card shadow-sm z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <span className="w-4 h-4 bg-primary rounded-full"></span>
              <span className="w-4 h-4 bg-secondary rounded-full"></span>
              <span className="w-4 h-4 bg-accent rounded-full"></span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold">EmoPalette</h1>
          </div>
          
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 md:py-10">
        {/* Introduction */}
        <section className="mb-8 md:mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Generate Color Palettes from Emotions</h2>
          <p className="text-muted-foreground mb-6">Enter how you feel, and we'll create the perfect color palette that matches your emotion.</p>
          
          <EmotionInputForm onSubmit={handleEmotionSubmit} />
        </section>

        {paletteGenerated && (
          <>
            <ColorPaletteDisplay 
              emotion={emotion}
              colors={colors}
              lockedColors={lockedColors}
              onRegeneratePalette={handleRegeneratePalette}
              onToggleLock={handleToggleLock}
              onColorSelect={handleColorSelect}
              selectedColorIndex={selectedColorIndex}
              onExportClick={toggleExportPanel}
            />

            <ColorAdjustment 
              selectedColor={colors[selectedColorIndex]}
              onColorChange={handleColorChange}
            />
            
            {showExportPanel && (
              <ExportPanel 
                colors={colors}
                onClose={() => setShowExportPanel(false)}
              />
            )}
          </>
        )}

        {/* Inspiration Section */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Color Psychology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg shadow-md overflow-hidden">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Person expressing calm emotion" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="font-semibold mb-2">Calming Blues & Greens</h4>
                <p className="text-sm text-muted-foreground">Blues and greens evoke feelings of tranquility, peace, and harmony. They're often associated with nature, water, and sky - creating a sense of balance and serenity.</p>
              </div>
            </div>
            
            <div className="bg-card rounded-lg shadow-md overflow-hidden">
              <img src="https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Person expressing happy emotion" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="font-semibold mb-2">Energetic Reds & Yellows</h4>
                <p className="text-sm text-muted-foreground">Vibrant reds and yellows stimulate energy, passion, and excitement. These warm colors can increase heart rate and create feelings of enthusiasm and happiness.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
