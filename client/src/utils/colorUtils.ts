import { Color, EmotionColorMapping, extendedColorAssociations } from "./emotionColorMap";
import { emotionColorMappings } from "./emotionColorMap";

// Convert hex to RGB
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Convert hex to HSB
export const hexToHsb = (hex: string): { h: number; s: number; b: number } => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsb(r, g, b);
};

// Convert RGB to HSB
export const rgbToHsb = (r: number, g: number, b: number): { h: number; s: number; b: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  let h = 0;
  let s = 0;
  const v = max;
  
  if (delta !== 0) {
    s = delta / max;
    
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  
  return { h, s: s * 100, b: v * 100 };
};

// Convert HSB to RGB
export const hsbToRgb = (h: number, s: number, b: number): { r: number; g: number; b: number } => {
  h = h % 360;
  s = s / 100;
  b = b / 100;
  
  const k = (n: number) => (n + h / 60) % 6;
  const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  
  return {
    r: Math.round(255 * f(5)),
    g: Math.round(255 * f(3)),
    b: Math.round(255 * f(1)),
  };
};

// Convert HSB to Hex
export const hsbToHex = (h: number, s: number, b: number): string => {
  const { r, g, b: blue } = hsbToRgb(h, s, b);
  return rgbToHex(r, g, blue);
};

// Convert RGB to Hex
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
};

// Generate a more realistic color with adjustments for visual balance
export const generateSmartColor = (
  hueMin: number,
  hueMax: number,
  satMin: number,
  satMax: number,
  briMin: number,
  briMax: number,
  index: number = 0,
  totalColors: number = 5
): Color => {
  // Create a weighted distribution instead of pure random
  // This makes colors more balanced and less extreme
  const hueRange = hueMax - hueMin;
  
  // Distribute hues more evenly across the range for the palette
  let h: number;
  if (totalColors > 1) {
    const step = hueRange / totalColors;
    h = (hueMin + (index * step) + (Math.random() * step * 0.8)) % 360;
  } else {
    h = Math.floor(hueMin + Math.random() * hueRange) % 360;
  }
  
  // Increase weight toward more saturated colors, but avoid extremes
  let s: number;
  if (satMax - satMin > 30) {
    const midSat = (satMin + satMax) / 2;
    const bias = 0.6; // Bias toward the more saturated end
    s = satMin + (Math.pow(Math.random(), 1 - bias) * (satMax - satMin));
    
    // For monochromatic schemes, ensure a mix of saturation levels
    if (hueRange < 30 && totalColors > 2) {
      s = satMin + ((index / (totalColors - 1)) * (satMax - satMin));
      // Add a little randomness
      s += (Math.random() * 10) - 5;
    }
  } else {
    s = satMin + Math.random() * (satMax - satMin);
  }
  
  // Make some colors brighter or darker for contrast
  let b: number;
  if (totalColors > 3) {
    // Distribute brightness to create visual hierarchy
    if (index === 0) {
      // Primary color - brightest
      b = Math.max(briMin + (briMax - briMin) * 0.7, briMax - 10);
    } else if (index === totalColors - 1) {
      // Darkest color
      b = Math.min(briMin + (briMax - briMin) * 0.3, briMin + 15);
    } else {
      // Middle values with some variation
      const step = (briMax - briMin) / (totalColors - 1);
      b = briMax - (step * index) + ((Math.random() * 10) - 5);
    }
  } else {
    b = briMin + Math.random() * (briMax - briMin);
  }
  
  // Ensure values are within bounds
  h = Math.max(0, Math.min(359, Math.round(h)));
  s = Math.max(0, Math.min(100, Math.round(s)));
  b = Math.max(0, Math.min(100, Math.round(b)));
  
  const hex = hsbToHex(h, s, b);
  return { hex, h, s, b };
};

// Calculate color distance to ensure sufficient contrast
const calculateColorDistance = (color1: Color, color2: Color): number => {
  // This uses a weighted Euclidean distance in HSB space
  const hDiff = Math.min(Math.abs(color1.h - color2.h), 360 - Math.abs(color1.h - color2.h));
  const sDiff = color1.s - color2.s;
  const bDiff = color1.b - color2.b;
  
  // Weight hue differences more if the colors are saturated
  const satWeight = (color1.s + color2.s) / 200;
  
  return Math.sqrt(
    Math.pow(hDiff * satWeight * 1.5, 2) + 
    Math.pow(sDiff * 0.5, 2) + 
    Math.pow(bDiff * 2, 2)
  );
};

// Find the closest matching emotion mapping, now with expanded associations
export const findEmotionMapping = (emotion: string): EmotionColorMapping => {
  const normalizedEmotion = emotion.toLowerCase().trim();
  
  // If input is empty, generate a completely random palette
  if (!normalizedEmotion) {
    return createRandomMapping();
  }
  
  // Check extended color associations first
  const words = normalizedEmotion.split(/[\s-_,]+/);
  for (const word of words) {
    if (word.length < 3) continue;
    
    // Direct match in extended associations
    if (extendedColorAssociations[word]) {
      const association = extendedColorAssociations[word];
      return {
        emotion: word,
        synonyms: [word],
        hue: association.hue,
        saturation: association.saturation,
        brightness: association.brightness
      };
    }
    
    // Partial match in extended associations
    for (const key of Object.keys(extendedColorAssociations)) {
      if (word.includes(key) || key.includes(word)) {
        const association = extendedColorAssociations[key];
        return {
          emotion: key,
          synonyms: [word],
          hue: association.hue,
          saturation: association.saturation,
          brightness: association.brightness
        };
      }
    }
  }
  
  // Direct match in emotions
  const directMatch = emotionColorMappings.find(
    mapping => mapping.emotion.toLowerCase() === normalizedEmotion
  );
  
  if (directMatch) return directMatch;
  
  // Check for partial matches or synonyms in emotions
  for (const mapping of emotionColorMappings) {
    // Full word match in synonyms
    for (const word of words) {
      if (mapping.synonyms.includes(word)) {
        return mapping;
      }
    }
    
    // Partial match in emotion or synonyms
    if (mapping.synonyms.some(synonym => 
        normalizedEmotion.includes(synonym) || 
        synonym.includes(normalizedEmotion)
    )) {
      return mapping;
    }
  }
  
  // Advanced word similarity check
  for (const mapping of emotionColorMappings) {
    // Check if any words in the emotion are similar to our mapping emotion or synonyms
    const allMappingWords = [mapping.emotion, ...mapping.synonyms];
    
    for (const emotionWord of words) {
      if (emotionWord.length <= 3) continue; // Skip short words
      
      for (const mappingWord of allMappingWords) {
        // Check if words share a significant prefix or have high character overlap
        if (emotionWord.length >= 4 && mappingWord.length >= 4) {
          if (emotionWord.substring(0, 4) === mappingWord.substring(0, 4)) {
            return mapping;
          }
          
          // Count matching characters
          let matchCount = 0;
          for (let i = 0; i < Math.min(emotionWord.length, mappingWord.length); i++) {
            if (emotionWord[i] === mappingWord[i]) matchCount++;
          }
          
          // If more than 70% characters match
          if (matchCount / Math.min(emotionWord.length, mappingWord.length) > 0.7) {
            return mapping;
          }
        }
      }
    }
  }
  
  // For completely unknown inputs, create a deterministic but unique palette
  return createDeterministicMapping(normalizedEmotion);
};

// Create a semantically meaningful color mapping based on the input string
const createDeterministicMapping = (input: string): EmotionColorMapping => {
  // Generate a stable hash from the input string
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Make the hash positive
  hash = Math.abs(hash);
  
  // Key color characteristics often associated with words:
  // - Shorter words often feel brighter, higher saturation
  // - Longer words often feel more subdued, lower saturation
  // - Words with more vowels often feel softer, cooler colors
  // - Words with more consonants often feel sharper, warmer colors
  
  // Count vowels and consonants (rough measures of "softness" vs "hardness")
  const vowels = input.match(/[aeiou]/gi)?.length || 0;
  const consonants = input.match(/[bcdfghjklmnpqrstvwxyz]/gi)?.length || 0;
  const vowelRatio = input.length > 0 ? vowels / input.length : 0.5;
  
  // Use hash for base hue, but modify based on word characteristics
  let hueBase: number;
  
  if (vowelRatio > 0.5) {
    // More vowels - cooler colors (blues, greens, purples)
    hueBase = 180 + (hash % 180); // 180-359
  } else {
    // More consonants - warmer colors (reds, oranges, yellows)
    hueBase = hash % 180; // 0-179
  }
  
  // Length affects saturation - shorter words are more vibrant
  const satBase = input.length < 5 
    ? 70 + (hash % 30) // Shorter: 70-99
    : 40 + (hash % 40); // Longer: 40-79
  
  // Brightness is affected by both length and character types
  const briBase = input.length < 4 || consonants > vowels * 2
    ? 60 + (hash % 40) // Shorter or consonant-heavy: 60-99
    : 50 + (hash % 50); // Longer or vowel-heavy: 50-99
  
  // Determine hue range based on the "mood" of the word
  const hueRange = input.length < 4 ? 60 : 40;
  
  return {
    emotion: input,
    synonyms: [input],
    hue: { 
      min: hueBase, 
      max: (hueBase + hueRange) % 360 
    },
    saturation: { 
      min: Math.max(30, satBase - 20), 
      max: Math.min(100, satBase + 20) 
    },
    brightness: { 
      min: Math.max(40, briBase - 20), 
      max: Math.min(100, briBase + 20) 
    }
  };
};

// Create a completely random mapping
const createRandomMapping = (): EmotionColorMapping => {
  const randomHue = Math.floor(Math.random() * 360);
  const randomSat = Math.floor(Math.random() * 30) + 70; // 70-99
  const randomBri = Math.floor(Math.random() * 20) + 80; // 80-99
  
  return {
    emotion: "random",
    synonyms: ["random"],
    hue: { 
      min: randomHue, 
      max: (randomHue + 60) % 360 
    },
    saturation: { 
      min: Math.max(40, randomSat - 20), 
      max: Math.min(100, randomSat + 20) 
    },
    brightness: { 
      min: Math.max(50, randomBri - 20), 
      max: Math.min(100, randomBri + 20) 
    }
  };
};

// Generate a palette based on an emotion with intelligent color harmonies
export const generatePaletteFromEmotion = (
  emotion: string,
  currentColors: Color[] = [],
  lockedIndices: Set<number> = new Set()
): Color[] => {
  const mapping = findEmotionMapping(emotion);
  const numColors = 5; // Number of colors in the palette
  let palette: Color[] = [...currentColors];
  
  // Generate different types of palettes based on word characteristics
  const vowels = emotion.match(/[aeiou]/gi)?.length || 0;
  const consonants = emotion.match(/[bcdfghjklmnpqrstvwxyz]/gi)?.length || 0;
  const vowelRatio = emotion.length > 0 ? vowels / emotion.length : 0.5;
  
  // Determine color harmony type based on the input
  const harmonyType = determineHarmonyType(emotion, mapping);
  
  // Fill the palette with initial colors if it's empty
  if (palette.length === 0) {
    palette = generateColorHarmony(harmonyType, mapping, numColors);
    return palette;
  }
  
  // Update only unlocked colors
  // If multiple unlocked colors, regenerate them as a harmonic group
  const unlockedIndices = Array.from({ length: numColors }, (_, i) => i)
    .filter(i => !lockedIndices.has(i));
  
  if (unlockedIndices.length > 1) {
    // For multiple unlocked colors, generate a small harmonic group
    const baseColor = findBestBaseColor(palette, lockedIndices);
    const newColors = generateColorHarmony(harmonyType, mapping, unlockedIndices.length, baseColor);
    
    // Replace unlocked colors with new harmony
    unlockedIndices.forEach((index, i) => {
      palette[index] = newColors[i];
    });
  } else {
    // For single unlocked colors, respect the existing palette
    unlockedIndices.forEach(index => {
      // Find adjacent locked colors to harmonize with
      const adjacentColors = findAdjacentColors(palette, index, lockedIndices);
      
      if (adjacentColors.length > 0) {
        // Generate color that harmonizes with adjacent locked colors
        palette[index] = generateHarmonizingColor(adjacentColors, mapping, index, numColors);
      } else {
        // No adjacent colors, use standard generation
        palette[index] = generateSmartColor(
          mapping.hue.min, mapping.hue.max,
          mapping.saturation.min, mapping.saturation.max,
          mapping.brightness.min, mapping.brightness.max,
          index, numColors
        );
      }
    });
  }
  
  return palette;
};

// Determine the best type of color harmony based on input text
const determineHarmonyType = (input: string, mapping: EmotionColorMapping): string => {
  // Analyze the input to determine the best harmony
  const words = input.toLowerCase().split(/\s+/);
  const length = input.length;
  const hueRange = mapping.hue.max - mapping.hue.min;
  
  // Check for specific words that suggest harmonies
  const analogousWords = ["similar", "related", "like", "family", "harmony", "natural", "subtle"];
  const complementaryWords = ["opposite", "contrast", "versus", "against", "pop", "vibrant"];
  const triadicWords = ["balanced", "variety", "diverse", "colorful", "playful", "exciting"];
  const monochromaticWords = ["calm", "simple", "minimal", "elegant", "classic", "peaceful"];
  
  // Check if any words in input match our harmony indicators
  for (const word of words) {
    if (analogousWords.includes(word)) return "analogous";
    if (complementaryWords.includes(word)) return "complementary";
    if (triadicWords.includes(word)) return "triadic";
    if (monochromaticWords.includes(word)) return "monochromatic";
  }
  
  // If no direct matches, infer from other characteristics
  
  // Shorter inputs often work well with simpler harmonies
  if (length < 5) return "monochromatic";
  
  // Single words often work well with analogous harmonies
  if (words.length === 1) return "analogous";
  
  // Multi-word phrases often benefit from more diverse palettes
  if (words.length >= 3) return "triadic";
  
  // For narrow hue ranges, use monochromatic to keep the palette focused
  if (hueRange < 30) return "monochromatic";
  
  // Default to complementary as it works well for most cases
  return "complementary";
};

// Generate a color harmony based on specified type
const generateColorHarmony = (
  harmonyType: string,
  mapping: EmotionColorMapping,
  numColors: number = 5,
  baseColor?: Color
): Color[] => {
  const palette: Color[] = [];
  
  // If no base color provided, generate one from the mapping
  if (!baseColor) {
    baseColor = generateSmartColor(
      mapping.hue.min, mapping.hue.max,
      mapping.saturation.min, mapping.saturation.max,
      mapping.brightness.min, mapping.brightness.max,
      0, numColors
    );
  }
  
  palette.push(baseColor);
  
  switch (harmonyType) {
    case "monochromatic":
      // Same hue, varying saturation and brightness
      for (let i = 1; i < numColors; i++) {
        // Distribute saturation and brightness for visual hierarchy
        const satRatio = i / numColors;
        const briRatio = 1 - (i / (numColors * 1.5));
        
        const s = Math.max(mapping.saturation.min, 
                         Math.min(mapping.saturation.max, 
                                 baseColor.s * (1 - satRatio * 0.5)));
        
        const b = Math.max(mapping.brightness.min, 
                         Math.min(mapping.brightness.max, 
                                 baseColor.b * (0.7 + briRatio * 0.5)));
        
        const hex = hsbToHex(baseColor.h, s, b);
        palette.push({ hex, h: baseColor.h, s, b });
      }
      break;
      
    case "analogous":
      // Adjacent hues on the color wheel
      const hueStep = 12; // Smaller steps for closer colors
      for (let i = 1; i < numColors; i++) {
        const direction = i % 2 === 0 ? 1 : -1; // Alternate directions
        const steps = Math.ceil(i / 2); // How many steps to take
        
        const newHue = (baseColor.h + (direction * steps * hueStep) + 360) % 360;
        const newSat = Math.max(mapping.saturation.min, 
                              Math.min(mapping.saturation.max, 
                                      baseColor.s + (Math.random() * 20 - 10)));
        
        const newBri = Math.max(mapping.brightness.min, 
                              Math.min(mapping.brightness.max, 
                                      baseColor.b + (Math.random() * 20 - 10)));
        
        const hex = hsbToHex(newHue, newSat, newBri);
        palette.push({ hex, h: newHue, s: newSat, b: newBri });
      }
      break;
      
    case "complementary":
      // Main color and its complement, plus variants
      const complement = (baseColor.h + 180) % 360;
      
      if (numColors <= 3) {
        // For small palettes, just use base and complement
        const complementColor = generateSmartColor(
          complement - 10, complement + 10,
          mapping.saturation.min, mapping.saturation.max,
          mapping.brightness.min, mapping.brightness.max,
          1, numColors
        );
        palette.push(complementColor);
        
        if (numColors === 3) {
          // Add a neutral or muted version
          const midHue = (baseColor.h + complement) / 2;
          const midSat = Math.min(baseColor.s, 40);
          const midBri = Math.max(baseColor.b, 80);
          
          const hex = hsbToHex(midHue, midSat, midBri);
          palette.push({ hex, h: midHue, s: midSat, b: midBri });
        }
      } else {
        // Create split complementary when more colors needed
        const complementRange = 30;
        const complement1 = (complement - complementRange/2 + 360) % 360;
        const complement2 = (complement + complementRange/2) % 360;
        
        // First complementary color
        const comp1 = generateSmartColor(
          complement1 - 10, complement1 + 10,
          mapping.saturation.min, mapping.saturation.max,
          mapping.brightness.min, mapping.brightness.max,
          1, numColors
        );
        palette.push(comp1);
        
        // Second complementary color
        const comp2 = generateSmartColor(
          complement2 - 10, complement2 + 10,
          mapping.saturation.min, mapping.saturation.max,
          mapping.brightness.min, mapping.brightness.max,
          2, numColors
        );
        palette.push(comp2);
        
        // Add neutral or analogous colors to complete the palette
        for (let i = 3; i < numColors; i++) {
          if (i % 2 === 0) {
            // Add variant of base color
            const variantHue = (baseColor.h + (i * 15)) % 360;
            const variantSat = baseColor.s * 0.8;
            const variantBri = baseColor.b * 0.9;
            
            const hex = hsbToHex(variantHue, variantSat, variantBri);
            palette.push({ hex, h: variantHue, s: variantSat, b: variantBri });
          } else {
            // Add muted or neutral color
            const neutralHue = (baseColor.h + 30) % 360;
            const neutralSat = baseColor.s * 0.4;
            const neutralBri = Math.min(95, baseColor.b * 1.1);
            
            const hex = hsbToHex(neutralHue, neutralSat, neutralBri);
            palette.push({ hex, h: neutralHue, s: neutralSat, b: neutralBri });
          }
        }
      }
      break;
      
    case "triadic":
      // Three colors evenly spaced on the color wheel, plus variants
      const triad1 = (baseColor.h + 120) % 360;
      const triad2 = (baseColor.h + 240) % 360;
      
      // First triadic color
      const tri1 = generateSmartColor(
        triad1 - 10, triad1 + 10,
        mapping.saturation.min, mapping.saturation.max,
        mapping.brightness.min, mapping.brightness.max,
        1, numColors
      );
      palette.push(tri1);
      
      if (numColors >= 3) {
        // Second triadic color
        const tri2 = generateSmartColor(
          triad2 - 10, triad2 + 10,
          mapping.saturation.min, mapping.saturation.max,
          mapping.brightness.min, mapping.brightness.max,
          2, numColors
        );
        palette.push(tri2);
      }
      
      // Add subtle variants to complete the palette
      for (let i = 3; i < numColors; i++) {
        const baseForVariant = palette[i % 3];
        const variantHue = (baseForVariant.h + 15) % 360;
        const variantSat = baseForVariant.s * 0.7;
        const variantBri = Math.min(95, baseForVariant.b * 1.1);
        
        const hex = hsbToHex(variantHue, variantSat, variantBri);
        palette.push({ hex, h: variantHue, s: variantSat, b: variantBri });
      }
      break;
      
    default:
      // Analogous fallback
      for (let i = 1; i < numColors; i++) {
        const hueStep = 15;
        const newHue = (baseColor.h + (i * hueStep)) % 360;
        const newSat = Math.max(mapping.saturation.min, 
                              Math.min(mapping.saturation.max, 
                                      baseColor.s * (1 - (i * 0.1))));
        
        const newBri = Math.max(mapping.brightness.min, 
                              Math.min(mapping.brightness.max, 
                                      baseColor.b * (1 + (i * 0.05))));
        
        const hex = hsbToHex(newHue, newSat, newBri);
        palette.push({ hex, h: newHue, s: newSat, b: newBri });
      }
  }
  
  return palette;
};

// Find the best locked color to use as a base for regenerating unlocked colors
const findBestBaseColor = (palette: Color[], lockedIndices: Set<number>): Color | undefined => {
  if (lockedIndices.size === 0) return undefined;
  
  // Find the locked color with highest saturation, as it will be most visually dominant
  const lockedColors = Array.from(lockedIndices).map(idx => palette[idx]);
  
  return lockedColors.reduce((best, current) => {
    return current.s > best.s ? current : best;
  }, lockedColors[0]);
};

// Find locked colors adjacent to the given index
const findAdjacentColors = (palette: Color[], index: number, lockedIndices: Set<number>): Color[] => {
  const adjacent: Color[] = [];
  
  // Check adjacent positions
  [index - 1, index + 1].forEach(adjIndex => {
    if (adjIndex >= 0 && adjIndex < palette.length && lockedIndices.has(adjIndex)) {
      adjacent.push(palette[adjIndex]);
    }
  });
  
  return adjacent;
};

// Generate a color that harmonizes with adjacent locked colors
const generateHarmonizingColor = (
  adjacentColors: Color[], 
  mapping: EmotionColorMapping, 
  index: number, 
  totalColors: number
): Color => {
  if (adjacentColors.length === 0) {
    return generateSmartColor(
      mapping.hue.min, mapping.hue.max,
      mapping.saturation.min, mapping.saturation.max,
      mapping.brightness.min, mapping.brightness.max,
      index, totalColors
    );
  }
  
  // Average the adjacent colors to find a harmonious middle point
  const avgH = adjacentColors.reduce((sum, c) => sum + c.h, 0) / adjacentColors.length;
  const avgS = adjacentColors.reduce((sum, c) => sum + c.s, 0) / adjacentColors.length;
  const avgB = adjacentColors.reduce((sum, c) => sum + c.b, 0) / adjacentColors.length;
  
  // For hue, choose a complementary or analogous value instead of average
  const useComplement = Math.random() > 0.7;
  let targetH: number;
  
  if (useComplement) {
    // Complement creates more contrast
    targetH = (avgH + 180) % 360;
  } else {
    // Analogous creates more harmony
    const direction = Math.random() > 0.5 ? 1 : -1;
    const hueStep = 15 + Math.random() * 15;
    targetH = (avgH + (direction * hueStep) + 360) % 360;
  }
  
  // Adjust saturation and brightness for good contrast while staying in mapping bounds
  let targetS = avgS;
  let targetB = avgB;
  
  // Make sure color has good contrast with adjacents
  if (adjacentColors.length === 1) {
    // With one adjacent, create clear contrast
    targetS = adjacentColors[0].s > 50 ? Math.max(mapping.saturation.min, adjacentColors[0].s - 20) :
                                        Math.min(mapping.saturation.max, adjacentColors[0].s + 20);
                                        
    targetB = adjacentColors[0].b > 50 ? Math.max(mapping.brightness.min, adjacentColors[0].b - 20) :
                                        Math.min(mapping.brightness.max, adjacentColors[0].b + 20);
  }
  
  // Constrain to mapping ranges
  targetH = Math.min(mapping.hue.max, Math.max(mapping.hue.min, targetH));
  if (targetH < mapping.hue.min || targetH > mapping.hue.max) {
    // If target hue outside range, use a value from the range
    targetH = mapping.hue.min + Math.random() * (mapping.hue.max - mapping.hue.min);
  }
  
  targetS = Math.min(mapping.saturation.max, Math.max(mapping.saturation.min, targetS));
  targetB = Math.min(mapping.brightness.max, Math.max(mapping.brightness.min, targetB));
  
  const hex = hsbToHex(targetH, targetS, targetB);
  return { hex, h: targetH, s: targetS, b: targetB };
};

// Generate a harmonious palette based on a base color (legacy, but improved)
export const generateHarmoniousPalette = (baseColor: Color, numColors: number = 5): Color[] => {
  // Create a mapping from the base color
  const mapping: EmotionColorMapping = {
    emotion: "custom",
    synonyms: ["custom"],
    hue: { min: (baseColor.h - 30 + 360) % 360, max: (baseColor.h + 30) % 360 },
    saturation: { min: Math.max(20, baseColor.s - 20), max: Math.min(100, baseColor.s + 20) },
    brightness: { min: Math.max(30, baseColor.b - 20), max: Math.min(100, baseColor.b + 20) }
  };
  
  // Choose a good harmony type
  const harmonyType = baseColor.s > 70 ? "complementary" : "analogous";
  
  // Generate the palette
  return generateColorHarmony(harmonyType, mapping, numColors, baseColor);
};
