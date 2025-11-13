# Lyfora - AI Wellness Companion

A modern wellness application with AI-powered expert coaches to help you achieve your health and fitness goals.

## Features

- 🏥 **Expert AI Coaches** - Chat with specialized coaches for health, fitness, nutrition, and more
- 🎨 **Modern Design** - Apple-inspired UI with smooth animations and transitions
- 🌓 **Dark Mode** - Beautiful light and dark themes
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile
- ♿ **Accessible** - WCAG 2.1 AA compliant
- ⚡ **Fast** - Optimized performance with lazy loading and code splitting

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **AI**: Google Gemini 1.5 Flash
- **Deployment**: Vercel
- **Testing**: Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd Lyfora
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Project Structure

```
Lyfora/
├── src/
│   ├── components/        # React components
│   ├── design-system/     # Design system components
│   ├── routes/            # Route components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and configs
│   └── utils/             # Helper functions
├── supabase/
│   └── functions/         # Edge functions
├── tests/                 # E2E tests
└── public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run lint` - Lint code

## Deployment

### Vercel

1. Install Vercel CLI
```bash
npm i -g vercel
```

2. Deploy
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Supabase Edge Functions

1. Deploy the persona-chat function
```bash
npx supabase functions deploy persona-chat
```

2. Set the Gemini API key secret in Supabase dashboard:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key

## Features in Detail

### AI Expert Coaches

Chat with specialized AI coaches:
- 🏥 Health Coach - Holistic wellness guidance
- 💪 Gym Coach - Strength training expertise
- 🏊 Swimming Coach - Aquatic fitness
- 🏋️ Weightlifting Coach - Powerlifting specialist
- 🥗 Nutrition Coach - Dietary guidance
- 🧘 Yoga Coach - Mindfulness and flexibility

### Design System

Built with a comprehensive design system including:
- Reusable components (Button, Input, Card, Modal)
- Consistent design tokens (colors, spacing, typography)
- Smooth animations and transitions
- Accessible by default

### Performance

- Code splitting and lazy loading
- Image optimization
- Debounced search
- Skeleton loading states
- Optimized bundle size

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ using React, TypeScript, and Supabase
