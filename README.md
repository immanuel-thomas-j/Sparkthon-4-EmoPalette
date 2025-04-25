# EmoPalette 🎨

EmoPalette is a modern web application that generates harmonious color palettes from any text input. Whether you enter emotions, concepts, objects, or random text, EmoPalette uses an intelligent algorithm to create beautiful, meaningful color combinations that perfectly represent your input.

## 🌈 Features

- **Semantic Color Generation**: Transforms any word or phrase into a cohesive color palette
- **Intelligent Color Harmonies**: Creates complementary, analogous, triadic, or monochromatic schemes based on your input
- **Advanced Color Analysis**: Analyzes linguistic patterns (vowels, consonants, word length) to determine color properties
- **Smart Concept Recognition**: Automatically recognizes inputs like "ocean," "sunset," "tech," creating realistic associated colors
- **Palette Customization**: Adjust hue, saturation, and brightness of individual colors
- **Color Locking**: Lock specific colors while regenerating others
- **Multiple Export Options**: Download palettes as CSS, SCSS, JSON, or HEX
- **Dark/Light Mode**: Full theme support with system detection
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

## 🧠 How It Works

EmoPalette uses a sophisticated algorithm that:

1. **Analyzes input text** for linguistic patterns and semantic meaning
2. **Maps words to color properties** using an extensive database of color associations
3. **Determines optimal color harmony** type (complementary, analogous, etc.) based on input characteristics
4. **Generates balanced palettes** with proper contrast and visual hierarchy
5. **Applies color theory principles** to ensure aesthetically pleasing results

For example:
- "Ocean" produces calming blues with complementary accents
- "Sunset" creates warm oranges and purples with subtle gradations
- "Tech" generates modern blues and teals with proper contrast ratios

## 💻 Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Color Science**: Custom HSB/RGB algorithms for color manipulation and harmony generation

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Setup
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/emopalette.git
   cd emopalette
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   # Create a .env file with the following variables
   DATABASE_URL=postgresql://username:password@localhost:5432/emopalette
   ```

4. Initialize database
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. Start development server
   ```bash
   npm run dev
   ```

6. Open your browser to `http://localhost:5000`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
