import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for palette generation
  app.get('/api/emotions', async (req, res) => {
    try {
      const emotions = await storage.getAllEmotions();
      res.json(emotions);
    } catch (error) {
      console.error('Error fetching emotions:', error);
      res.status(500).json({ error: 'Failed to fetch emotions' });
    }
  });

  // Save a generated palette
  app.post('/api/palettes', async (req, res) => {
    try {
      const { name, emotion, colors } = req.body;
      
      if (!name || !emotion || !colors || !Array.isArray(colors) || colors.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const newPalette = await storage.savePalette({
        name,
        emotion,
        colors: colors.map((color: any) => ({ hex: color.hex }))
      });
      
      res.status(201).json(newPalette);
    } catch (error) {
      console.error('Error saving palette:', error);
      res.status(500).json({ error: 'Failed to save palette' });
    }
  });

  // Get all saved palettes
  app.get('/api/palettes', async (req, res) => {
    try {
      const palettes = await storage.getAllPalettes();
      res.json(palettes);
    } catch (error) {
      console.error('Error fetching palettes:', error);
      res.status(500).json({ error: 'Failed to fetch palettes' });
    }
  });

  // Get a specific palette by ID
  app.get('/api/palettes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const palette = await storage.getPaletteById(parseInt(id));
      
      if (!palette) {
        return res.status(404).json({ error: 'Palette not found' });
      }
      
      res.json(palette);
    } catch (error) {
      console.error('Error fetching palette:', error);
      res.status(500).json({ error: 'Failed to fetch palette' });
    }
  });

  // Delete a palette
  app.delete('/api/palettes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePalette(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ error: 'Palette not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting palette:', error);
      res.status(500).json({ error: 'Failed to delete palette' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
