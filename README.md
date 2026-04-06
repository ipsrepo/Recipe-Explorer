<img width="777" height="279" alt="image" src="https://github.com/user-attachments/assets/5c9537fd-9fef-4d77-a850-b4c74d8dabec" />

# Recipe Explorer — B9IS126 — Web and Mobile Technologies
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

##  Screens

### Light Mode

![Screenshot_2026-04-06-16-01-40-579_host exp exponent](https://github.com/user-attachments/assets/162f691f-a7a6-4be2-b556-5f9b661808bc)
![Screenshot_2026-04-06-16-02-19-027_host exp exponent](https://github.com/user-attachments/assets/24d8d14a-2ce8-4038-a761-529fe21c7008)
![Screenshot_2026-04-06-16-02-04-527_host exp exponent](https://github.com/user-attachments/assets/aec5674a-91e8-4fce-871c-bd43ef175dcf)
![Screenshot_2026-04-06-16-02-01-441_host exp exponent](https://github.com/user-attachments/assets/0df29cb0-0a5a-4ff5-a988-1101cc9ef167)

### Dark Mode

![Screenshot_2026-04-06-16-02-34-567_host exp exponent](https://github.com/user-attachments/assets/d6b99bda-0008-41ec-89c7-67f701b0ddda)
![Screenshot_2026-04-06-16-02-29-628_host exp exponent](https://github.com/user-attachments/assets/93e4388f-c851-4539-9264-d70bb888ae0f)
![Screenshot_2026-04-06-16-02-26-819_host exp exponent](https://github.com/user-attachments/assets/d08c8d65-a9b2-43d0-8652-b0c48331bbca)



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

