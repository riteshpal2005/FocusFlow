# 🌊 FocusFlow

FocusFlow is a minimalist, offline-first habit performance dashboard. It is designed to test and demonstrate nested layouts, native gesture interception, global context state, and disk caching in a production-grade React Native environment.

### 🧠 The Learning Journey
**Note:** *This project is actively being built as part of a rigorous, guided learning sprint.* I am building FocusFlow under the guidance of an AI Senior Engineering Coach to bridge the gap between basic coding and elite software architecture. The goal is not just to make an app that works, but to master clean code principles, strict TypeScript typing, and rendering cycle optimization (avoiding unnecessary frame drops). Every file is written from scratch, architected for performance, and strictly code-reviewed.

### 🛠 Tech Stack (Strict Requirements)
- **Framework:** Expo (Managed Workflow)
- **Language:** Strict TypeScript
- **Core UI:** React Native Core Components
- **Navigation:** React Navigation (Native Stack & Bottom Tabs)
- **State Management:** React Context API (Auth & Theme specifically)
- **Persistence:** AsyncStorage

### 🚀 Architecture Roadmap
The project is being developed chronologically through these architectural phases:

- [x] **Phase 1: Global State Setup** (Strictly typed Theme & Auth contexts)
- [ ] **Phase 2: Route Maps** (Rigid TypeScript Navigation dictionaries)
- [ ] **Phase 3: Navigation Architecture** (Nested Stack Construction)
- [ ] **Phase 4: UI Gateway** (Auth screens & custom reusable components)
- [ ] **Phase 5: Storage Layer Engine** (AsyncStorage caching & Main Features)

### 📂 Phase 1 Highlight: State Management
Phase 1 implements a highly optimized global state layer:
- **`ThemeContext`**: A strictly typed theme engine calculating derived colors based on literal types (`'light' | 'dark'`) without unnecessary re-renders.
- **`AuthContext`**: A simulated authentication gateway wrapped in Promises and `useMemo` caching to protect the component tree from performance leaks.