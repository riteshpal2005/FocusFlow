# 🌊 FocusFlow

> A minimalist, offline-first habit and task performance dashboard built with React Native (Expo) and strict TypeScript.

This repository serves as a rigorous, independent learning sprint. The objective is to bridge the gap between basic component scaffolding and elite software architecture using AI-assisted development tools. Every module is written from scratch, architected for minimal rendering cycles, and strictly type-checked.

## ✨ Core Features

- **Universal Theme Engine:** Zero-tearing, dynamically derived dark/light mode context.
- **Authentication Gateway:** Simulated user sessions managing root navigation state.
- **Deep Navigation Routing:** Strongly typed nested stack and bottom-tab navigation.
- **Offline-First Persistence:** (In Progress) Disk caching for seamless offline usability.
- **Optimized UI Components:** Reusable, theme-aware core components (Inputs, Buttons).

## 🛠 Tech Stack

- **Framework:** React Native (Expo Managed Workflow)
- **Language:** Strict TypeScript
- **Navigation:** `@react-navigation/native` (Native Stack & Bottom Tabs)
- **State Management:** React Context API (Auth & Theme) + `useMemo` optimizations
- **Storage:** `@react-native-async-storage/async-storage`
- **Icons:** `@expo/vector-icons` (Ionicons)

---

## 🏗 System Architecture

FocusFlow utilizes a unidirectional data flow with tightly scoped global contexts to prevent prop-drilling and unnecessary re-renders.

### 1. The Global State Layer

State that affects the entire application is isolated into strictly typed Context Providers wrapped around the root `App.tsx`.

- `ThemeContext`: Holds the active `ThemeMode`. It computes the active color palette _dynamically_ without storing the entire color dictionary in state, saving memory.
- `AuthContext`: Acts as the Auth Gateway. Wraps the user session in a `useMemo` block so the underlying component tree only re-renders when authentication status actually changes.

### 2. The Navigation Routing Engine

Navigation is strictly typed using a central dictionary (`types.ts`). If a screen is passed the wrong data shape, the TypeScript compiler throws a fatal error before the bundle builds.

- **Root Navigator:** A conditional gateway. It listens to `AuthContext`. If unauthenticated, it locks the user in the `AuthStack`. If authenticated, it grants access to the `MainTabs`.
- **Main Tabs & Home Stack:** Deeply nested routes allowing users to click a habit and push a detailed analytics view over the main tab bar.

---

## 🔄 Data Flow (State & Persistence)

1. **User Interaction:** A user toggles a theme or logs in via a component (e.g., `CustomButton`).
2. **Context Update:** The component calls the exposed Context function (e.g., `toggleTheme()`).
3. **State Mutation:** The Context updates its local React State.
4. **Disk Sync (Upcoming):** A `useEffect` hook intercepts the state change and asynchronously serializes the new state to device storage (AsyncStorage) to ensure persistence across sessions.
5. **UI Repaint:** The derived variables (like `colors`) recalculate, and only the components consuming that specific context are repainted.

---

## 📂 Directory Structure

```text
FocusFlow/
├── App.tsx                     # Application Root & Provider Wrappers
├── src/
│   ├── components/
│   │   └── common/             # Reusable, theme-aware UI elements
│   │       ├── CustomButton.tsx
│   │       └── CustomInput.tsx
│   ├── context/                # Global State Management
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── navigation/             # Routing Architecture
│   │   ├── types.ts            # Centralized TypeScript Route Dictionary
│   │   ├── RootNavigator.tsx   # Master Conditional Switch
│   │   ├── AuthStack.tsx       # Unauthenticated Routes
│   │   └── MainTabs.tsx        # Authenticated Routes
│   ├── screens/
│   │   ├── auth/               # Login & Registration views
│   │   └── main/               # Dashboard, Profiles, and Details
│   └── utils/                  # Helper functions and Storage configs
```
