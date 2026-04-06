# 🍳 Recipe Explorer — B9IS126 — Web and Mobile Technologies
### Dublin Business School - April 2026

## 📌 Project Overview

**Recipe Explorer** is a cross-platform mobile application built with **Expo (React Native)** that allows users to discover, search, filter, and save recipes from around the world. It integrates with the free **TheMealDB API** to fetch live recipe data.

---

## 👥 Team Members

| Name                   | Student ID |
|------------------------|------------|
| Prakash Thangaraj      | 20095532   |
| Pramodh Selvaraj       | 20092022   |

---

## 🧰 Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Expo SDK 54 (React Native) |
| Language | JavaScript (ES2022) |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| State Management | React Context API |
| Storage | AsyncStorage |
| HTTP Client | Axios |
| Icons | @expo/vector-icons (Ionicons) |
| API | TheMealDB |

---

## ⚙️ Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Expo CLI:
  npm install -g expo-cli
- Expo Go (iOS / Android)

---

## 🚀 Setup & Installation

1. Extract and navigate:
   unzip recipe-explorer.zip  
   cd recipe-explorer

2. Install:
   npm install

3. Start:
   npx expo start

4. Run:
  - Scan QR with Expo Go
  - Press a → Android
  - Press i → iOS
  - Press w → Web

---

## 📁 Repository Structure

```
recipe-explorer/
├── App.js                     # Root component (wraps navigation and providers)
├── index.js                   # Entry point
├── app.json                   # Expo configuration
├── package.json               # Project dependencies and scripts
├── assets/                    # Icons and splash screen images
│   ├── icon.png
│   ├── adaptive-icon.png
│   └── splash-icon.png
└── src/
    ├── navigation/
    │   └── AppNavigator.js    # Tab and stack navigation setup
    ├── screens/
    │   ├── HomeScreen.js           # Random recipe discovery feed
    │   ├── SearchScreen.js         # Search by name + filter by category
    │   ├── FavouritesScreen.js     # Saved favourite recipes
    │   ├── RecipeDetailScreen.js   # Full recipe view (ingredients, instructions)
    │   └── SettingsScreen.js       # User preferences form
    ├── components/
    │   └── RecipeCard.js           # Reusable recipe card (thumbnail and info)
    ├── context/
    │   └── FavouritesContext.js    # Global favourites state + AsyncStorage
    └── services/
        └── api.js                  # All TheMealDB API calls (axios)

```

---

## ✨ Features

- Browse and search recipes
- Filter by category
- View detailed recipes
- Give recipe YouTube Link
- Save favourites (persistent)
- Settings with user preferences
- Change mode (Dark or Light)
- Loading + error handling

---

## 🔌 API Reference

TheMealDB (no API key required)

- /random.php
- /search.php?s=
- /lookup.php?i=
- /categories.php
- /filter.php?c=

---

## ⚠️ Limitations

- No authentication
- Rate limits possible
- Random endpoint = 1 item per call
- No ingredient filtering

---

