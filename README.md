# Base Challenge

A mini app for Base app users to create and participate in challenges.

## MVP Features (Current)
- Daily "Show Up" Challenge
- Streak tracking
- Points system
- Leaderboard
- Shareable streak images

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Wagmi (Base chain integration)
- Vercel (hosting)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file (copy from `.env.local.example`):
```bash
cp .env.local.example .env.local
```

3. Update the environment variables in `.env.local`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure
```
app/
├── page.tsx          # Home page
├── layout.tsx        # Root layout
├── providers.tsx     # Wagmi & React Query providers
└── globals.css       # Global styles

components/
├── ShowUpChallenge.tsx   # Main challenge component
├── ConnectWallet.tsx     # Wallet connection
├── CheckInButton.tsx     # Daily check-in
├── StreakDisplay.tsx     # Streak & points display
└── LeaderBoard.tsx       # Leaderboard display

lib/
└── wagmi.ts          # Wagmi configuration
```

## Next Steps
- Set up backend API
- Implement check-in logic
- Add image generation for sharing
- Deploy to Vercel
