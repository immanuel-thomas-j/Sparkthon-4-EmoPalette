import { db } from "./index";
import * as schema from "@shared/schema";
import { emotionColorMappings } from "../client/src/utils/emotionColorMap";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("🌱 Seeding emotions...");
    
    // Seed emotions from the emotionColorMappings
    for (const mapping of emotionColorMappings) {
      const existingEmotion = await db.query.emotions.findFirst({
        where: eq(schema.emotions.name, mapping.emotion)
      });
      
      if (!existingEmotion) {
        await db.insert(schema.emotions).values({
          name: mapping.emotion
        });
        console.log(`✅ Added emotion: ${mapping.emotion}`);
      } else {
        console.log(`ℹ️ Emotion already exists: ${mapping.emotion}`);
      }
    }
    
    // Add some sample palettes
    const samplePalettes = [
      {
        name: "Calm Waters",
        emotion: "calm",
        colors: [
          { hex: "#B2DFDB", position: 0 },
          { hex: "#80CBC4", position: 1 },
          { hex: "#4DB6AC", position: 2 },
          { hex: "#B2EBF2", position: 3 },
          { hex: "#E0F7FA", position: 4 }
        ]
      },
      {
        name: "Happy Sunshine",
        emotion: "happy",
        colors: [
          { hex: "#FFF59D", position: 0 },
          { hex: "#FFEE58", position: 1 },
          { hex: "#FFEB3B", position: 2 },
          { hex: "#FFF176", position: 3 },
          { hex: "#FFF9C4", position: 4 }
        ]
      },
      {
        name: "Energetic Flame",
        emotion: "energetic",
        colors: [
          { hex: "#FFAB91", position: 0 },
          { hex: "#FF8A65", position: 1 },
          { hex: "#FF7043", position: 2 },
          { hex: "#FFCCBC", position: 3 },
          { hex: "#FF5722", position: 4 }
        ]
      },
      {
        name: "Mysterious Night",
        emotion: "mysterious",
        colors: [
          { hex: "#311B92", position: 0 },
          { hex: "#4527A0", position: 1 },
          { hex: "#673AB7", position: 2 },
          { hex: "#7E57C2", position: 3 },
          { hex: "#9575CD", position: 4 }
        ]
      },
      {
        name: "Creative Spark",
        emotion: "creative",
        colors: [
          { hex: "#FF9800", position: 0 },
          { hex: "#FB8C00", position: 1 },
          { hex: "#F57C00", position: 2 },
          { hex: "#EF6C00", position: 3 },
          { hex: "#E65100", position: 4 }
        ]
      }
    ];
    
    console.log("🎨 Seeding sample palettes...");
    
    for (const paletteData of samplePalettes) {
      // Find the emotion ID
      const emotion = await db.query.emotions.findFirst({
        where: eq(schema.emotions.name, paletteData.emotion)
      });
      
      if (!emotion) {
        console.log(`❌ Emotion not found: ${paletteData.emotion}`);
        continue;
      }
      
      // Check if a palette with the same name already exists
      const existingPalette = await db.query.palettes.findFirst({
        where: eq(schema.palettes.name, paletteData.name)
      });
      
      if (existingPalette) {
        console.log(`ℹ️ Palette already exists: ${paletteData.name}`);
        continue;
      }
      
      // Insert the palette
      const [newPalette] = await db.insert(schema.palettes)
        .values({
          name: paletteData.name,
          emotionId: emotion.id
        })
        .returning();
      
      // Insert the palette colors
      for (const color of paletteData.colors) {
        await db.insert(schema.paletteColors)
          .values({
            paletteId: newPalette.id,
            position: color.position,
            hex: color.hex
          });
      }
      
      console.log(`✅ Added palette: ${paletteData.name}`);
    }
    
    console.log("✅ Seed completed successfully");
  } 
  catch (error) {
    console.error("❌ Seed failed:", error);
  }
}

seed();
