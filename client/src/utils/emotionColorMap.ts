export interface Color {
  hex: string;
  h: number;
  s: number;
  b: number;
}

export interface ColorRange {
  min: number;
  max: number;
}

export interface EmotionColorMapping {
  emotion: string;
  synonyms: string[];
  hue: ColorRange;
  saturation: ColorRange;
  brightness: ColorRange;
}

export const emotionColorMappings: EmotionColorMapping[] = [
  {
    emotion: "calm",
    synonyms: ["peaceful", "serene", "relaxed", "tranquil", "gentle", "quiet", "soothing", "soft", "chill", "zen"],
    hue: { min: 170, max: 200 },
    saturation: { min: 30, max: 70 },
    brightness: { min: 60, max: 100 }
  },
  {
    emotion: "happy",
    synonyms: ["joyful", "cheerful", "delighted", "pleased", "content", "blissful", "ecstatic", "merry", "glad", "jubilant", "optimistic", "positive", "sunny"],
    hue: { min: 40, max: 60 },
    saturation: { min: 60, max: 100 },
    brightness: { min: 80, max: 100 }
  },
  {
    emotion: "energetic",
    synonyms: ["lively", "enthusiastic", "vibrant", "dynamic", "active", "spirited", "vigorous", "zestful", "peppy", "bouncy", "animated", "vivacious", "perky"],
    hue: { min: 0, max: 30 },
    saturation: { min: 70, max: 100 },
    brightness: { min: 70, max: 100 }
  },
  {
    emotion: "peaceful",
    synonyms: ["harmonious", "placid", "restful", "still", "mellow", "tranquil", "calm", "quiet", "serene", "gentle", "relaxed", "composed"],
    hue: { min: 80, max: 140 },
    saturation: { min: 20, max: 60 },
    brightness: { min: 70, max: 100 }
  },
  {
    emotion: "excited",
    synonyms: ["thrilled", "eager", "animated", "passionate", "elated", "enthusiastic", "exhilarated", "thrilled", "stimulated", "energized", "psyched", "pumped"],
    hue: { min: 300, max: 360 },
    saturation: { min: 70, max: 100 },
    brightness: { min: 70, max: 100 }
  },
  {
    emotion: "melancholic",
    synonyms: ["sad", "nostalgic", "wistful", "pensive", "reflective", "somber", "gloomy", "depressed", "sorrowful", "down", "blue", "moody", "unhappy", "forlorn"],
    hue: { min: 220, max: 280 },
    saturation: { min: 20, max: 50 },
    brightness: { min: 20, max: 70 }
  },
  {
    emotion: "romantic",
    synonyms: ["loving", "passionate", "tender", "affectionate", "dreamy", "amorous", "sensual", "intimate", "warm", "sentimental", "heartfelt"],
    hue: { min: 280, max: 340 },
    saturation: { min: 30, max: 70 },
    brightness: { min: 70, max: 90 }
  },
  {
    emotion: "mysterious",
    synonyms: ["enigmatic", "cryptic", "secretive", "intriguing", "obscure", "shadowy", "dark", "puzzling", "hidden", "unknown", "eerie", "spooky", "mystical"],
    hue: { min: 230, max: 290 },
    saturation: { min: 30, max: 60 },
    brightness: { min: 20, max: 50 }
  },
  {
    emotion: "powerful",
    synonyms: ["strong", "dominant", "bold", "intense", "confident", "mighty", "forceful", "potent", "commanding", "authoritative", "imposing", "formidable"],
    hue: { min: 0, max: 30 },
    saturation: { min: 60, max: 100 },
    brightness: { min: 40, max: 70 }
  },
  {
    emotion: "fresh",
    synonyms: ["new", "crisp", "clean", "cool", "invigorating", "revitalizing", "refreshing", "rejuvenating", "pristine", "mint", "spring", "dewy", "bright"],
    hue: { min: 80, max: 180 },
    saturation: { min: 40, max: 80 },
    brightness: { min: 70, max: 100 }
  },
  {
    emotion: "angry",
    synonyms: ["furious", "mad", "enraged", "irate", "wrathful", "indignant", "irritated", "annoyed", "cross", "vexed", "heated", "exasperated", "fuming"],
    hue: { min: 0, max: 15 },
    saturation: { min: 80, max: 100 },
    brightness: { min: 60, max: 90 }
  },
  {
    emotion: "surprised",
    synonyms: ["amazed", "astonished", "shocked", "stunned", "startled", "dumbfounded", "flabbergasted", "awestruck", "astounded", "taken aback", "speechless"],
    hue: { min: 260, max: 320 },
    saturation: { min: 50, max: 90 },
    brightness: { min: 70, max: 100 }
  },
  {
    emotion: "confused",
    synonyms: ["puzzled", "perplexed", "bewildered", "disoriented", "baffled", "muddled", "befuddled", "lost", "uncertain", "unclear", "ambiguous", "mixed up"],
    hue: { min: 240, max: 300 },
    saturation: { min: 20, max: 60 },
    brightness: { min: 50, max: 80 }
  },
  {
    emotion: "fearful",
    synonyms: ["scared", "afraid", "terrified", "frightened", "anxious", "worried", "panicked", "alarmed", "nervous", "horrified", "dread", "spooked", "uneasy"],
    hue: { min: 210, max: 260 },
    saturation: { min: 30, max: 70 },
    brightness: { min: 20, max: 60 }
  },
  {
    emotion: "focused",
    synonyms: ["concentrated", "attentive", "alert", "intentional", "determined", "resolute", "steadfast", "committed", "devoted", "dedicated", "precise"],
    hue: { min: 180, max: 240 },
    saturation: { min: 40, max: 80 },
    brightness: { min: 40, max: 80 }
  },
  {
    emotion: "creative",
    synonyms: ["imaginative", "innovative", "inventive", "original", "artistic", "inspired", "expressive", "resourceful", "clever", "ingenious", "brilliant"],
    hue: { min: 20, max: 70 },
    saturation: { min: 60, max: 100 },
    brightness: { min: 70, max: 100 }
  },
  {
    emotion: "tired",
    synonyms: ["exhausted", "fatigued", "weary", "sleepy", "drowsy", "lethargic", "drained", "worn out", "spent", "beat", "sluggish", "lazy", "listless"],
    hue: { min: 30, max: 60 },
    saturation: { min: 10, max: 40 },
    brightness: { min: 30, max: 70 }
  },
  {
    emotion: "silly",
    synonyms: ["goofy", "funny", "humorous", "playful", "whimsical", "ridiculous", "absurd", "ludicrous", "comical", "laughable", "hilarious", "wacky"],
    hue: { min: 20, max: 70 },
    saturation: { min: 70, max: 100 },
    brightness: { min: 80, max: 100 }
  },
  {
    emotion: "tropical",
    synonyms: ["exotic", "paradise", "island", "beach", "sunny", "warm", "vacation", "resort", "coconut", "palm", "ocean", "coastal", "summery"],
    hue: { min: 60, max: 150 },
    saturation: { min: 60, max: 100 },
    brightness: { min: 70, max: 100 }
  },
  {
    emotion: "earthy",
    synonyms: ["natural", "organic", "grounded", "rustic", "outdoors", "woodland", "forest", "nature", "soil", "dirt", "moss", "stone", "wood", "terra", "green"],
    hue: { min: 30, max: 130 },
    saturation: { min: 30, max: 70 },
    brightness: { min: 30, max: 80 }
  }
];

// Extended emotion-to-color mappings with color ranges for each keyword
export interface ExtendedColorAssociation {
  hue: ColorRange;
  saturation: ColorRange;
  brightness: ColorRange;
}

export const extendedColorAssociations: Record<string, ExtendedColorAssociation> = {
  // Colors
  "red": { hue: { min: 350, max: 10 }, saturation: { min: 75, max: 95 }, brightness: { min: 65, max: 90 } },
  "blue": { hue: { min: 190, max: 230 }, saturation: { min: 65, max: 90 }, brightness: { min: 70, max: 90 } },
  "green": { hue: { min: 80, max: 150 }, saturation: { min: 60, max: 85 }, brightness: { min: 60, max: 85 } },
  "yellow": { hue: { min: 40, max: 60 }, saturation: { min: 80, max: 100 }, brightness: { min: 80, max: 100 } },
  "purple": { hue: { min: 260, max: 290 }, saturation: { min: 60, max: 85 }, brightness: { min: 60, max: 90 } },
  "pink": { hue: { min: 300, max: 335 }, saturation: { min: 50, max: 80 }, brightness: { min: 80, max: 95 } },
  "orange": { hue: { min: 20, max: 40 }, saturation: { min: 80, max: 100 }, brightness: { min: 70, max: 90 } },
  "teal": { hue: { min: 170, max: 190 }, saturation: { min: 60, max: 80 }, brightness: { min: 50, max: 75 } },
  "brown": { hue: { min: 20, max: 40 }, saturation: { min: 40, max: 70 }, brightness: { min: 30, max: 60 } },
  "gray": { hue: { min: 0, max: 360 }, saturation: { min: 0, max: 15 }, brightness: { min: 40, max: 90 } },
  
  // Nature
  "ocean": { hue: { min: 180, max: 220 }, saturation: { min: 60, max: 90 }, brightness: { min: 60, max: 85 } },
  "forest": { hue: { min: 90, max: 150 }, saturation: { min: 40, max: 80 }, brightness: { min: 30, max: 70 } },
  "sunset": { hue: { min: 10, max: 40 }, saturation: { min: 70, max: 100 }, brightness: { min: 70, max: 100 } },
  "sunrise": { hue: { min: 25, max: 50 }, saturation: { min: 60, max: 90 }, brightness: { min: 75, max: 95 } },
  "sky": { hue: { min: 190, max: 225 }, saturation: { min: 50, max: 80 }, brightness: { min: 70, max: 95 } },
  "autumn": { hue: { min: 15, max: 40 }, saturation: { min: 60, max: 90 }, brightness: { min: 50, max: 90 } },
  "winter": { hue: { min: 180, max: 240 }, saturation: { min: 10, max: 40 }, brightness: { min: 70, max: 100 } },
  "spring": { hue: { min: 80, max: 160 }, saturation: { min: 40, max: 80 }, brightness: { min: 60, max: 95 } },
  "summer": { hue: { min: 40, max: 100 }, saturation: { min: 60, max: 100 }, brightness: { min: 70, max: 100 } },
  
  // Foods
  "coffee": { hue: { min: 20, max: 40 }, saturation: { min: 50, max: 80 }, brightness: { min: 20, max: 50 } },
  "chocolate": { hue: { min: 20, max: 30 }, saturation: { min: 60, max: 90 }, brightness: { min: 20, max: 40 } },
  "mint": { hue: { min: 140, max: 160 }, saturation: { min: 30, max: 70 }, brightness: { min: 70, max: 100 } },
  "berry": { hue: { min: 300, max: 340 }, saturation: { min: 70, max: 100 }, brightness: { min: 50, max: 80 } },
  "lemon": { hue: { min: 45, max: 60 }, saturation: { min: 80, max: 100 }, brightness: { min: 80, max: 100 } },
  "apple": { hue: { min: 350, max: 10 }, saturation: { min: 60, max: 90 }, brightness: { min: 60, max: 85 } },
  
  // Concepts
  "tech": { hue: { min: 190, max: 230 }, saturation: { min: 30, max: 70 }, brightness: { min: 60, max: 90 } },
  "retro": { hue: { min: 260, max: 320 }, saturation: { min: 40, max: 80 }, brightness: { min: 60, max: 90 } },
  "futuristic": { hue: { min: 180, max: 240 }, saturation: { min: 40, max: 90 }, brightness: { min: 50, max: 95 } },
  "vintage": { hue: { min: 25, max: 45 }, saturation: { min: 20, max: 60 }, brightness: { min: 70, max: 90 } },
  "cyberpunk": { hue: { min: 270, max: 330 }, saturation: { min: 70, max: 100 }, brightness: { min: 50, max: 90 } },
  "minimalist": { hue: { min: 0, max: 360 }, saturation: { min: 0, max: 30 }, brightness: { min: 70, max: 100 } },
  "elegant": { hue: { min: 240, max: 300 }, saturation: { min: 10, max: 40 }, brightness: { min: 70, max: 100 } },
  "rustic": { hue: { min: 20, max: 40 }, saturation: { min: 30, max: 70 }, brightness: { min: 40, max: 80 } },
};

export const commonEmotions = [
  "happy", "sunset", "ocean", "coffee", 
  "autumn", "space", "mint", "forest", 
  "cyberpunk", "winter", "elegant", "tech"
];
