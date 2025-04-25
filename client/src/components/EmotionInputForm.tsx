import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { commonEmotions } from "@/utils/emotionColorMap";
import { Info } from "lucide-react";

interface EmotionInputFormProps {
  onSubmit: (emotion: string) => void;
}

export default function EmotionInputForm({ onSubmit }: EmotionInputFormProps) {
  const [emotion, setEmotion] = useState("");

  const handleEmotionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmotion(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emotion.trim()) {
      onSubmit(emotion.trim());
    }
  };

  const handleEmotionSelect = (selectedEmotion: string) => {
    setEmotion(selectedEmotion);
    onSubmit(selectedEmotion);
  };

  return (
    <div className="mb-8">
      <div className="mx-auto max-w-xl">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Enter Anything for Smart Colors!
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Type any word, phrase, emotion, concept, color name, or season to generate a realistic, harmonious color palette. Our AI analyzes your input for meaningful connections!
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="relative">
          <Input
            id="emotion-input"
            className="w-full py-6 px-4 pr-24 text-lg"
            placeholder="Type absolutely anything here..."
            value={emotion}
            onChange={handleEmotionInput}
            autoComplete="off"
          />
          <Button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 px-6"
            disabled={!emotion.trim()}
            size="lg"
          >
            Generate
          </Button>
        </form>
        
        <div className="mt-2 flex items-center justify-center text-xs text-muted-foreground">
          <Info className="h-3 w-3 mr-1" />
          <span>The more descriptive your input, the better your palette will be!</span>
        </div>
        
        {/* Emotion Suggestions */}
        <div className="mt-6">
          <div className="text-sm text-center text-muted-foreground mb-2">Or try one of these:</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {commonEmotions.map((emotionOption) => (
              <Button
                key={emotionOption}
                variant="outline"
                size="sm"
                className="rounded-full text-sm capitalize transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleEmotionSelect(emotionOption)}
              >
                {emotionOption}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
