# Lyfora - Your Personal Wellness Companion

A modern, AI-powered wellness application designed to help users achieve their health and wellness goals through personalized daily routines, activity tracking, and intelligent wellness recommendations.

## 🌟 Features

### Core Features

- **User Authentication**: Secure sign-up and login system powered by Supabase
- **Personalized Onboarding**: Multi-step onboarding flow to understand user goals and preferences
- **Daily Routines**: AI-generated daily activity routines based on user goals and preferences
- **Activity Tracking**: Log and track completion of wellness activities
- **Daily Check-ins**: Monitor daily wellness metrics (mood, energy, sleep quality)
- **Manual Activity Logging**: Record custom wellness activities
- **Progress Tracking**: Visual progress reports and analytics
- **Wellness Assistant**: AI-powered wellness recommendations and tips
- **Activity Reminders**: Smart reminders for scheduled activities

### Wellness Categories

- 💪 Physical Fitness
- 🧘 Mental Health
- 🥗 Nutrition
- 😴 Sleep Quality
- 🌿 Stress Management

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, and real-time APIs
- **PostgreSQL** - Relational database with RLS (Row-Level Security)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## 📋 Project Structure

```
Lyfora/
├── src/
│   ├── components/
│   │   ├── Auth/           # Login and signup forms
│   │   ├── Dashboard/      # Main dashboard components
│   │   │   ├── DailyRoutine.tsx
│   │   │   ├── DailyCheckIn.tsx
│   │   │   ├── ProgressTracking.tsx
│   │   │   ├── ManualActivityLog.tsx
│   │   │   └── WellnessAssistant.tsx
│   │   └── Onboarding/     # Onboarding flow
│   ├── contexts/           # React contexts (Authentication)
│   ├── lib/                # Utilities and Supabase config
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── supabase/
│   ├── functions/          # Edge functions
│   └── migrations/         # Database migrations
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

## 🗄️ Database Schema

### Key Tables

- **wellness_profiles**: User profile information and wellness goals
- **daily_routines**: Daily activity plans for users
- **activity_completions**: Tracks completion of individual activities
- **daily_checkins**: Daily wellness metrics (mood, energy, sleep)
- **manual_activities**: User-logged custom activities
- **wellness_tips**: Wellness tips and recommendations

All tables have Row-Level Security (RLS) enabled to ensure users can only access their own data.

## 🛠️ Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Manitchahar/Lyfora.git
cd Lyfora
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality
- `npm run typecheck` - Run TypeScript type checking

## 🔐 Security Features

- **Row-Level Security (RLS)**: PostgreSQL RLS policies ensure users can only access their own data
- **Supabase Authentication**: Secure user authentication with email/password
- **Protected Routes**: Dashboard and features are only accessible to authenticated users

## 🎯 User Flow

1. **Sign Up/Login**: User creates account or logs in
2. **Onboarding**: 5-step onboarding to set wellness goals and preferences
3. **Dashboard**: Access personalized wellness features
4. **Daily Routine**: View and complete AI-generated daily activities
5. **Daily Check-in**: Log daily wellness metrics
6. **Track Progress**: Monitor wellness achievements over time
7. **Manual Logging**: Log custom wellness activities
8. **Get Recommendations**: Receive AI-powered wellness tips

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Manit Chahar** - [GitHub](https://github.com/Manitchahar)

## 📧 Support

For support, please open an issue on the GitHub repository.

---

**Made with ❤️ for better wellness**
