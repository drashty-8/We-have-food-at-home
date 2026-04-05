# We Have Food at Home

A web-based recipe recommendation app that helps users plan meals using ingredients they already have.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Setup
1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env` and add your Spoonacular API key
4. `npm run dev`

## Project Structure
```
src/
  App.jsx              # Root component with routes
  main.jsx             # Entry point
  components/          # Reusable UI components
    NavBar.jsx         # Navigation bar
    Pantry.jsx         # Ingredient input + chip display
    RecipeCard.jsx     # Single recipe card
    Recipes.jsx        # Recipe search results
  pages/               # Route-level pages
    Home.jsx           # Main page (pantry + recipes)
    Account.jsx        # User account (placeholder)
  css/                 # Component stylesheets
  utils/
    api.js             # Spoonacular API helpers
    hooks.js           # Custom React hooks
  config/
    firebase.js        # Firebase configuration
```

## Tech Stack
- **Frontend:** React 19 + Vite
- **Routing:** react-router-dom
- **Database:** Firebase Cloud Firestore
- **Recipe API:** Spoonacular
- **Deployment:** Vercel (planned)
