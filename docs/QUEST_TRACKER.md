# LockIn Pro - Duolingo-Inspired Habit Tracker

A playful, gamified daily habit tracking application with a Duolingo-inspired yellow/green design system. LockIn Pro helps you track daily habits, earn XP, climb league tiers, and maintain streaks with satisfying micro-animations.

## Features

### Core Tracking
- **LockIn Pro Dashboard** - View all habits with today's completion status
- **Task Cards** - Rounded card-based habit elements with radio-button style checkboxes
- **Auto-Populated Timestamps** - Automatic completion time recording
- **Notes/Reflections** - Add personal notes when completing habits
- **Custom XP Rewards** - Set different XP values for different habits

### Quest Path Visualization
- **Visual Quest Map** - Linear quest path layout with connected nodes
- **Node Status Indicators** - Completed quests show green with checkmarks and XP earned
- **Interactive Selection** - Click nodes to view details or jump to dashboard

### Gamification
- **XP System** - Earn points for each habit completion
- **Dynamic Streaks** - Track current and longest completion streaks with fire emoji
- **League Progression** - Four tiers (Bronze, Silver, Gold, Diamond) based on total XP
- **Progress Bars** - Visual representation of progress to next league tier
- **Achievements** - Unlock milestones for streaks, XP, and league promotions

### Calendars & Analytics
- **Monthly Calendar View** - Visual grid showing completion history per month
- **Habit Performance Metrics** - Completion percentage and trending for each habit
- **Statistics Dashboard** - League info, XP totals, streak stats, habit counts

### Animations & Effects
- **Fire/Spark Particle Effects** - Celebratory burst when completing habits
- **Celebration Effects** - Confetti and emoji animations for achievements
- **Achievement Toast Notifications** - Slide-in notifications for milestones
- **Gentle Micro-interactions** - Pulse, bounce, and scale animations throughout
- **Smooth Transitions** - Polished fade and slide animations

## Data Storage

All data is stored in browser localStorage under key `lockin-pro-data`, making it completely private and offline-capable. On first load after the rename, existing data from the legacy key `quest-tracker-data` is migrated automatically. Data includes:
- Habits (title, description, XP value, icon, recurrence, color)
- Completions (timestamp, notes, XP earned)
- User stats (total XP, streaks, league tier)

## Color Scheme

Duolingo-inspired warm palette:
- **Primary Yellow** (#ffd700) - Main brand color for buttons and highlights
- **Secondary Green** (#1fb881) - Accent for completed items and success states
- **Warm Red** (#ff4b4b) - Accent for destructive/fire effects
- **Cream Background** (#f8f6f0) - Soft, playful base color
- **High Contrast Text** (#1a1a1a) - Maximum readability

## Views

1. **Daily (Dashboard)** - Task cards for today's habits
2. **Quest Path** - Visual quest map with connected nodes
3. **Calendar** - Monthly completion tracking
4. **Statistics** - Performance metrics and league info
5. **Manage** - Create, edit, and delete habits

## Getting Started

1. Click "Create Habit" to add your first habit
2. Set the habit name, description, and XP reward value
3. Choose from available icons and recurrence patterns
4. Click habits or "Mark Done" to complete them
5. Watch the fire/spark effects and celebration animations
6. Check your progress on the Quest Path and Calendar views

## Mobile-First Design

The app is optimized for mobile devices with:
- Touch-friendly button sizes and spacing
- Swipe-accessible navigation
- Bottom navigation bar for easy thumb access
- Responsive layouts for tablets and desktop
