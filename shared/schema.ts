import { pgTable, text, serial, integer, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (keeping as required in original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Emotions table
export const emotions = pgTable("emotions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmotionSchema = createInsertSchema(emotions).pick({
  name: true,
});

export type InsertEmotion = z.infer<typeof insertEmotionSchema>;
export type Emotion = typeof emotions.$inferSelect;

// Palettes table
export const palettes = pgTable("palettes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  emotionId: integer("emotion_id").references(() => emotions.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPaletteSchema = createInsertSchema(palettes).pick({
  name: true,
  emotionId: true,
});

export type InsertPalette = z.infer<typeof insertPaletteSchema>;
export type Palette = typeof palettes.$inferSelect;

// Palette Colors table
export const paletteColors = pgTable("palette_colors", {
  id: serial("id").primaryKey(),
  paletteId: integer("palette_id").references(() => palettes.id).notNull(),
  position: integer("position").notNull(), // 0-based index for color position
  hex: text("hex").notNull(), // HEX color code
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPaletteColorSchema = createInsertSchema(paletteColors).pick({
  paletteId: true,
  position: true,
  hex: true,
});

export type InsertPaletteColor = z.infer<typeof insertPaletteColorSchema>;
export type PaletteColor = typeof paletteColors.$inferSelect;

// Relations
export const emotionsRelations = relations(emotions, ({ many }) => ({
  palettes: many(palettes),
}));

export const palettesRelations = relations(palettes, ({ one, many }) => ({
  emotion: one(emotions, {
    fields: [palettes.emotionId],
    references: [emotions.id],
  }),
  colors: many(paletteColors),
}));

export const paletteColorsRelations = relations(paletteColors, ({ one }) => ({
  palette: one(palettes, {
    fields: [paletteColors.paletteId],
    references: [palettes.id],
  }),
}));
