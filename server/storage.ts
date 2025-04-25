import { db } from "@db";
import { emotions, palettes, paletteColors } from "@shared/schema";
import { eq, and } from "drizzle-orm";

interface PaletteInput {
  name: string;
  emotion: string;
  colors: { hex: string }[];
}

class Storage {
  // Emotions
  async getAllEmotions() {
    return await db.query.emotions.findMany();
  }

  async getEmotionByName(name: string) {
    return await db.query.emotions.findFirst({
      where: eq(emotions.name, name)
    });
  }

  // Palettes
  async savePalette(paletteData: PaletteInput) {
    // Start a transaction to ensure all operations succeed or fail together
    return await db.transaction(async (tx) => {
      // Find or create the emotion
      let emotionRecord = await tx.query.emotions.findFirst({
        where: eq(emotions.name, paletteData.emotion)
      });

      if (!emotionRecord) {
        const [newEmotion] = await tx.insert(emotions)
          .values({ name: paletteData.emotion })
          .returning();
        emotionRecord = newEmotion;
      }

      // Insert the palette
      const [newPalette] = await tx.insert(palettes)
        .values({
          name: paletteData.name,
          emotionId: emotionRecord.id
        })
        .returning();

      // Insert all colors for this palette
      for (const [index, color] of paletteData.colors.entries()) {
        await tx.insert(paletteColors)
          .values({
            paletteId: newPalette.id,
            position: index,
            hex: color.hex
          });
      }

      // Return the complete palette with colors
      return {
        ...newPalette,
        emotion: emotionRecord.name,
        colors: paletteData.colors.map((color, index) => ({
          hex: color.hex,
          position: index
        }))
      };
    });
  }

  async getAllPalettes() {
    const allPalettes = await db.query.palettes.findMany({
      with: {
        emotion: true,
        colors: {
          orderBy: (colors, { asc }) => [asc(colors.position)]
        }
      }
    });

    return allPalettes.map(palette => ({
      id: palette.id,
      name: palette.name,
      emotion: palette.emotion.name,
      colors: palette.colors.map(color => ({
        hex: color.hex,
        position: color.position
      }))
    }));
  }

  async getPaletteById(id: number) {
    const palette = await db.query.palettes.findFirst({
      where: eq(palettes.id, id),
      with: {
        emotion: true,
        colors: {
          orderBy: (colors, { asc }) => [asc(colors.position)]
        }
      }
    });

    if (!palette) return null;

    return {
      id: palette.id,
      name: palette.name,
      emotion: palette.emotion.name,
      colors: palette.colors.map(color => ({
        hex: color.hex,
        position: color.position
      }))
    };
  }

  async deletePalette(id: number) {
    // First check if the palette exists
    const palette = await db.query.palettes.findFirst({
      where: eq(palettes.id, id)
    });

    if (!palette) return false;

    // Delete all colors for this palette first (due to foreign key constraint)
    await db.delete(paletteColors)
      .where(eq(paletteColors.paletteId, id));

    // Then delete the palette
    await db.delete(palettes)
      .where(eq(palettes.id, id));

    return true;
  }
}

export const storage = new Storage();
