# AI Counsellor - Study Abroad Guidance Platform

AI Counsellor is a comprehensive study abroad guidance platform that combines AI-powered recommendations with intuitive tools for discovering universities, managing applications, and tracking progress.

## Features

### 1. **Landing Page & Authentication**
- Modern, responsive landing page showcasing the platform
- Email-based authentication system
- Clear value proposition and feature highlights

### 2. **Mandatory Onboarding System**
- Multi-step profile completion (5 steps)
- Collects essential information:
  - Personal Information (name, date of birth, citizenship)
  - Academic Profile (current level, GPA, test scores)
  - Interests & Goals (degree level, career aspirations)
  - Study Preferences (country preferences, budget range)
- Enforces completion before accessing platform features
- Progress tracking with visual indicators

### 3. **Personalized Dashboard**
- Overview of your study abroad journey
- Quick statistics and action buttons
- Access to all major features from a central hub
- User profile management
- Navigation to AI Counsellor, universities, and applications

### 4. **AI Counsellor Chat**
- Real-time AI conversations powered by GPT-4o-mini
- Context-aware responses based on user profile
- Provides recommendations, advice, and guidance on:
  - University selection
  - Application strategies
  - Scholarship opportunities
  - Visa and study abroad logistics
- User-friendly chat interface with message history

### 5. **University Discovery & Shortlisting**
- Browse thousands of universities worldwide
- Advanced filtering and search capabilities:
  - Filter by country
  - Sort by ranking or tuition
  - Search by university name
- Multiple view modes (grid and list)
- Detailed university information:
  - Global ranking
  - Tuition fees
  - Admission rates
  - Student population
  - Available programs
  - Scholarship information
- One-click shortlisting for comparison

### 6. **Application Guidance & Management**
- Comprehensive step-by-step application roadmap
- Task management system for tracking:
  - Essay writing
  - Document preparation
  - Exam submissions
  - Application deadlines
- Progress tracking with completion percentage
- Upcoming deadline alerts
- Pro tips and best practices guide
- Support across all stages of the application process

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui with Tailwind CSS v4
- **Styling**: Tailwind CSS with semantic design tokens
- **AI**: Vercel AI SDK 6 with GPT-4o-mini
- **Storage**: Browser localStorage for mock data
- **Authentication**: Basic email-based (localStorage)
- **Icons**: Lucide React

## Project Structure

```
/app
├── page.tsx                 # Landing page
├── onboarding/
│   └── page.tsx            # Multi-step profile completion
├── dashboard/
│   └── page.tsx            # Main dashboard
├── counsellor/
│   └── page.tsx            # AI chat interface
├── universities/
│   └── page.tsx            # University discovery & filtering
├── applications/
│   └── page.tsx            # Application guidance & task management
├── api/
│   └── counsellor/
│       └── route.ts        # AI API endpoint
├── layout.tsx              # Root layout
└── globals.css             # Tailwind & theme configuration
```

## Design System

The platform uses a modern dark theme with:
- **Primary Color**: Deep Blue (RGB: 140, 110, 255) - for primary actions
- **Secondary Color**: Golden Orange (RGB: 165, 110, 0) - for accents
- **Accent Color**: Vibrant Orange (RGB: 165, 85, 0) - for highlights
- **Background**: Dark (RGB: 20, 20, 20)
- **Foreground**: Light (RGB: 242, 242, 242)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### First Time Setup

1. Visit the landing page
2. Sign up with an email address
3. Complete the onboarding form (5 steps required)
4. Access your personalized dashboard
5. Start exploring universities and chat with AI Counsellor

## Features in Detail

### AI Counsellor
- **Context-Aware**: Considers your full profile for recommendations
- **Real-Time Streaming**: Get instant responses
- **Multi-Turn Conversations**: Have extended discussions
- **Subject Expertise**: Covers admissions, scholarships, visas, and more

### University Discovery
- **8+ Universities**: Pre-populated with top global universities
- **Advanced Filtering**: By country, ranking, tuition, and more
- **Detailed Information**: Comprehensive data on each institution
- **Shortlist Feature**: Compare selected universities side-by-side

### Application Management
- **Timeline View**: Track your overall progress
- **Task Manager**: Create and manage application tasks
- **Step-by-Step Roadmap**: Follow a proven application process
- **Deadline Tracking**: Never miss important dates

## Authentication & Data Storage

The current implementation uses browser localStorage for demonstration purposes:
- User credentials stored locally
- Profile data persisted across sessions
- Shortlisted universities and application tasks saved locally

For production deployment, integrate with:
- Supabase Auth or similar authentication service
- Database backend (PostgreSQL, MongoDB, etc.)
- Secure session management

## Customization

### Modify University Data
Edit the `MOCK_UNIVERSITIES` array in `/app/universities/page.tsx` to add or update universities.

### Adjust AI Behavior
Modify the system prompt in `/app/api/counsellor/route.ts` to change AI personality or expertise areas.

### Customize Theme
Update color tokens in `/app/globals.css` to match your brand:
```css
:root {
  --primary: oklch(...);
  --secondary: oklch(...);
  --accent: oklch(...);
  /* ... more tokens */
}
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import repository in Vercel
3. Vercel will auto-detect Next.js and configure build settings
4. Deploy with one click

### Environment Variables

For production, set up these environment variables:
```
OPENAI_API_KEY=your_api_key_here
DATABASE_URL=your_database_url
SESSION_SECRET=your_session_secret
```

## Future Enhancements

- Real database integration for persistent storage
- Actual university data from external APIs
- Advanced recommendation algorithm
- Video consultations with counselors
- Scholarship matching engine
- Application essay analysis
- Interview preparation tools
- Success story and alumni network
- Integration with university portals

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized images with Next.js Image component
- Code splitting and lazy loading
- Responsive design for mobile, tablet, desktop
- Dark mode support
- Accessibility features (WCAG 2.1 AA)

## Contributing

This is a demonstration project. For modifications or improvements, follow these steps:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is created with v0 by Vercel.

## Support

For issues or questions:
1. Check the documentation
2. Review the code comments
3. Consult the AI Counsellor feature for guidance

---

**Built with Next.js, AI SDK, and Tailwind CSS**
