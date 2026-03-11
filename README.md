# LockIn Pro

## Project Overview
A fully-functional, mobile-first habit tracking application with Duolingo-inspired gamification, featuring fire/spark completion effects, achievement systems, league progression, and monthly calendar tracking.

## Architecture

### Data Layer (`/lib`)
- **types.ts** - TypeScript interfaces for Habit, HabitCompletion (including optional proofImageUrl), UserStats, League, AppData, and wake/sleep records
- **storage.ts** - StorageManager class handling all localStorage operations with streak calculation, XP tracking, league progression, habit order, and wake/sleep times
- **achievements.ts** - Achievement system detecting milestones for streaks, XP, and league promotions
- **export.ts** - CSV export of habits, completions, and wake/sleep data
- **notificationScheduler.ts** - Browser notification reminders and deadline alerts for habits

### Components (`/components`)

#### Core Components
- **TaskCard.tsx** - Individual habit card with completion checkbox, notes input, optional proof (image + notes) via CompletionProofModal, fire spark effects, and celebration animations
- **SortableTaskCard.tsx** - Draggable wrapper for TaskCard used for reordering habits on the dashboard (@dnd-kit)
- **QuestNode.tsx** - Quest path visualization showing habits as circular nodes with status indicators and XP display
- **LeagueCard.tsx** - League tier display with progress bar, XP counter, and integrated StreakCounter component
- **LeagueStatusBar.tsx** - Compact league tier and XP progress bar in the dashboard header (sticky)

#### Data Display
- **HabitCalendar.tsx** - Monthly calendar view with completion grid navigation and statistics
- **StreakCounter.tsx** - Animated streak display with counter animation from 0 to current value

#### Modals
- **CompletionProofModal.tsx** - Modal for submitting optional proof (image upload or camera + notes) when completing a habit
- **CompletionDetailsModal.tsx** - Modal to view past completion details (XP, date, notes, proof image); used from TaskCard and HabitCalendar

#### Forms & Input
- **HabitForm.tsx** - Create/edit habits with title, description, XP reward slider, recurrence options, icon selection, and color picker

#### Effects & Feedback
- **FireSparkEffect.tsx** - Canvas-based particle system creating fire/spark burst animation on task completion
- **CelebrationEffect.tsx** - Confetti animation with bouncing particles and center burst emoji
- **AchievementToast.tsx** - Slide-in notification component for achievement unlocking

### Main Application (`/app`)
- **page.tsx** - Multi-view single-page application with 5 tabs (Daily, Quest, Calendar, Stats, Manage), dashboard filters (compact icon button), drag-and-drop habit reorder, wake/sleep buttons, CSV export, and unified state management
- **layout.tsx** - Root layout with updated metadata for SEO and Duolingo-inspired theming
- **globals.css** - Design tokens using Duolingo yellow (#ffd700) and green (#1fb881) with custom animations

## Features Implemented

### Gamification
- XP system with customizable rewards per habit
- Dynamic league progression (Bronze → Silver → Gold → Diamond)
- Streak tracking with current and longest streak counters
- Achievement system with 8+ milestone types
- Visual progress bars and stat tracking

### Habit Management
- Create habits with custom icons, colors, and XP values
- Edit and delete existing habits
- Recurrence options (daily, weekly, custom)
- Description and note support
- Optional completion proof (image upload or camera + notes) stored per completion; view completion details (XP, date, notes, proof) from cards or calendar

### Tracking & Analytics
- LockIn Pro daily dashboard with completion status and optional filters (hide accomplished, priority order, missed deadlines only)
- Drag-and-drop reordering of habits on the dashboard (order persisted)
- Wake/sleep time recording on the dashboard (optional)
- Monthly calendar with completion grid visualization
- Habit performance metrics (completion percentage)
- Statistics dashboard with league info and trends
- CSV export of habits and completions (Manage tab)

### User Experience
- Mobile-first responsive design
- Bottom navigation bar for easy access
- Compact dashboard filter (icon button, top-right) with popover for filter options
- Fire/spark particle effects on completion
- Celebration animations with confetti
- Achievement toast notifications
- Optional browser notification reminders and deadline alerts for habits with due dates/reminders
- Smooth transitions and micro-animations
- Animated streak counter

## Design System

### Colors
- Primary: #ffd700 (Yellow) - Main brand, buttons, highlights
- Secondary: #1fb881 (Green) - Success, completed items, achievement states
- Accent: #ff4b4b (Red) - Fire effects, destructive actions
- Background: #f8f6f0 (Cream) - Warm, playful base
- Foreground: #1a1a1a (Dark) - High contrast text

### Typography
- Geist font for all text (Next.js default)
- Bold headings for visual hierarchy
- Large, readable body text (16px minimum)

### Components
- Rounded cards (24px border-radius) for playful aesthetic
- Circular nodes (96px diameter) for quest path
- Generous spacing and padding
- High-contrast color combinations

## Storage Structure
All data is stored in localStorage under key `lockin-pro-data`. On first load, existing data from the legacy key `quest-tracker-data` is migrated automatically to `lockin-pro-data`. The full payload also includes `habitOrder` (array of habit IDs for dashboard order) and `wakeSleepLog` (per-date wake/sleep times). Each completion in a habit's `completions` array may include `notes` and optional `proofImageUrl` (data URL).
```json
{
  "habits": [
    {
      "id": "uuid",
      "title": "Morning Workout",
      "description": "...",
      "recurrence": "daily",
      "xpReward": 20,
      "color": "#FF6B6B",
      "icon": "exercise",
      "createdAt": "2024-01-01T00:00:00Z",
      "completions": [...]
    }
  ],
  "stats": {
    "totalXP": 150,
    "currentStreak": 5,
    "longestStreak": 12,
    "habitCount": 3,
    "league": "silver",
    "lastCompletionDate": "2024-01-15T14:30:00Z"
  }
}
```

## Technologies Used
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19.2 with TypeScript
- **Styling**: Tailwind CSS 4.2 with custom animations
- **State Management**: React hooks (useState, useContext)
- **Storage**: Browser localStorage with JSON serialization
- **Drag and Drop**: @dnd-kit/core and @dnd-kit/sortable for habit reordering
- **Icons/Emojis**: Unicode emoji and inline SVG for UI (e.g. filter icon)
- **Animations**: CSS animations, Canvas particles, and requestAnimationFrame
- **PWA**: Serwist (service worker), web app manifest; installable (Add to Home Screen), optional offline caching

## Running the app

- **Install:** `bun install` or `npm install`
- **Dev:** `bun run dev` or `npm run dev` (Turbopack)
- **Production build:** `bun run build` or `npm run build` (uses webpack for PWA)
- **Start production:** `bun run start` or `npm run start`
- **Deployment:** Deploy to Vercel (or any Node host); the production build uses webpack (see build script).

## Performance Optimizations
- Client-side storage for instant responsiveness
- Memoized streak calculations
- Efficient date comparisons for streak detection
- Canvas-based particle effects for smooth performance
- Lazy component rendering with conditional displays

## Browser Compatibility
- Modern browsers with ES6 support
- localStorage API required
- Canvas API for particle effects
- CSS animations support

## Future Enhancement Ideas
- Multi-user support with cloud sync
- Dark mode theme option
- Habit templates/library
- Social sharing of achievements
- Recurring habit patterns
- Custom achievement creation
- Advanced analytics and trends
