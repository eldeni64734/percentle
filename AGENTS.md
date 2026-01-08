# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Percentle is a daily word game built with Next.js where players guess countries based on letter frequency percentages. Players must identify the top 5 countries that contain the highest percentage of a given letter.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run Next.js linting
```

## Architecture

**Tech Stack:** Next.js 15.3.4, React 19, TypeScript, deployed on Vercel

**Routing:** Uses Next.js Pages Router (not App Router). All pages in `/pages/` directory.

**Application Flow:**
1. `_app.tsx` - App wrapper with first-visit detection via localStorage
2. First visit redirects to `/welcome` (onboarding modal)
3. `/play.tsx` - Main game page containing all game logic (~577 lines)
4. `/faq.tsx` - Help/FAQ page

**State Management:** React hooks only (useState, useEffect). No external state library.

**Persistence:** Browser localStorage with keys:
- `percentle-welcomed` - First visit flag
- `percentle-{letter}-correctGuesses` - JSON array of guessed countries
- `percentle-{letter}-hintState` - Hint progress `{country, step, revealedLetters}`
- `percentle-hardMode` - Hard mode setting

## Key Game Logic (play.tsx)

**Core Functions:**
- `calculatePercent(word, letter)` - Calculates letter frequency percentage in a country name
- `getTopCountries(letter)` - Returns top 5 countries with highest letter frequency
- `handleGuess()` - Validates country guesses
- `handleHint()` - Progressive 3-stage hint system

**Hint System Stages:**
1. Reveals percentage of target country
2. Reveals percentage + letter count (underscores)
3. Progressively reveals letters left-to-right

**Hard Mode:** Wrong guesses accumulate strikes. Game over after 10 strikes.

**Countries List:** 195 country names hardcoded in play.tsx

**Daily Letter:** Currently hardcoded as 'G' (needs implementation for dynamic daily rotation)

## Styling

Primary approach is inline React styles and JSX `<style jsx>` for animations. CSS files in `/styles/` are minimal.

# Budget Guard Rules
- Be concise.
- Run /compact every 3 turns.
- Check /cost regularly.
