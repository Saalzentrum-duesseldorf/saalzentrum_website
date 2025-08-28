# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Vite
- `npm run build` - TypeScript compile and production build (`tsc && vite build`)
- `npm run preview` - Preview production build locally
- `npm run lint` - ESLint with TypeScript support and strict warnings

### Testing
- Tests are configured with Jest and ts-jest
- Test files should match pattern: `(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$`
- Run tests with `npx jest` or `npm test` (if script exists)

## Architecture Overview

### Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with React plugin
- **Styling**: SCSS + Bootstrap 5.2.3
- **Routing**: React Router DOM v6
- **Calendar**: FullCalendar React integration
- **UI Components**: Material-UI, React Bootstrap, FontAwesome icons
- **Additional Libraries**: React Swipeable, React Burger Menu

### Project Structure
- **Main App**: Single-page application with React Router
- **Components Directory**: `src/compontents/` (note: intentional typo in folder name)
- **Key Pages**: StartPage, CalendarPage, Impressum, Datenschutz
- **Calendar System**: Complex calendar implementation with desktop/mobile variants

### Calendar Architecture
The calendar system is the most complex part of the codebase:
- **Desktop Version**: `src/compontents/calendar/customCalendar/desktop/CustomCalendar.tsx`
- **Mobile Version**: `src/compontents/calendar/customCalendar/mobile/NewMobileCalendar/`
- **Shared Components**: CalendarDetails, EventPopover, MonthButtons, SelectRoomDropDown
- **Recent Refactoring**: Mobile calendar was recently refactored with skeleton loading and fade animations

### Component Architecture Pattern
- Each component has its own directory with `.tsx` and `.scss` files
- Components follow React functional component patterns with hooks
- Mobile-responsive design with separate mobile components where needed
- Bootstrap integration for responsive grid system

### Current State Notes
- Recent mobile calendar refactoring (see git history)
- Some old mobile calendar files have been deleted but new versions exist
- Project uses both npm and yarn (yarn.lock present, but package.json shows npm scripts)
- TypeScript strict mode enabled with comprehensive linting rules

## Development Notes
- The main application renders through `main.tsx` with React StrictMode
- Global styles in `main.scss` and component-specific SCSS files
- Bootstrap CSS imported globally in both App.tsx and main.tsx
- Utils.ts file contains shared utility functions