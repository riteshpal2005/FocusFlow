# 🏗️ Architecture & Project Structure

FocusFlow follows a **Domain-Driven Modular Architecture**, separating presentation, state management, business logic, navigation, and persistence into dedicated layers.

This approach improves maintainability, scalability, testability, and developer experience while minimizing coupling between features.

---

# 🧠 Architectural Philosophy

The application is built around three core principles:

### 1. Separation of Concerns

Each layer has a single responsibility:

* **Components** → Render UI only
* **Hooks** → Execute business logic
* **Contexts** → Manage global application state
* **Navigation** → Handle routing and access control
* **Utilities** → Perform pure data operations

### 2. Unidirectional Data Flow

Data always moves in a predictable direction:

```text
Storage
   │
   ▼
Custom Hooks
   │
   ▼
Context Providers
   │
   ▼
Screens
   │
   ▼
UI Components
```

This predictable flow reduces side effects and makes debugging significantly easier.

### 3. Feature Scalability

New features can be added without modifying existing domains:

```text
components/
hooks/
screens/
utils/
```

Each feature remains isolated, preventing architectural degradation as the application grows.

---

# 🔄 Application Data Flow

The entire application follows a React-centric state pipeline.

```text
┌────────────────────┐
│    AsyncStorage    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Storage Helpers   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   Custom Hooks     │
│ useHabitStorage()  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Context Providers  │
│ Auth / Theme       │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│      Screens       │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│     Components     │
└────────────────────┘
```

### Example: Habit Creation Flow

```text
User Action
     │
     ▼
HomeScreen
     │
     ▼
useHabitStorage()
     │
     ▼
storageHelpers.ts
     │
     ▼
AsyncStorage
     │
     ▼
Updated State
     │
     ▼
FlatList Re-render
```

The UI updates immediately using optimistic state updates while persistence happens in the background.

---

# 🔐 Authentication Flow

Authentication is centralized through the `AuthContext`.

```text
App Launch
     │
     ▼
AuthContext Hydration
     │
     ▼
Check Session State
     │
 ┌───┴────┐
 │        │
 ▼        ▼
Logged   Guest
 In
 │        │
 ▼        ▼
MainTabs AuthStack
```

The `RootNavigator` acts as a gateway, ensuring protected routes remain inaccessible to unauthenticated users.

---

# 🎨 Theme Management Flow

Theme state is globally managed and propagated through React Context.

```text
ThemeContext
      │
      ▼
Theme Toggle
      │
      ▼
Palette Generation
      │
      ▼
Context Update
      │
      ▼
Automatic UI Re-render
```

All shared UI primitives consume theme values, ensuring consistent styling across the application.

---

# 📂 Directory Structure

```text
FocusFlow/
├── App.tsx
├── app.json
│
├── src/
│
├── components/
│   ├── common/
│   │   ├── CustomButton.tsx
│   │   └── CustomInput.tsx
│   │
│   └── habit/
│       └── HabitCard.tsx
│
├── context/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── hooks/
│   └── useHabitStorage.ts
│
├── navigation/
│   ├── types.ts
│   ├── RootNavigator.tsx
│   ├── AuthStack.tsx
│   └── MainTabs.tsx
│
├── screens/
│   ├── auth/
│   │   └── LoginScreen.tsx
│   │
│   └── main/
│       ├── HomeScreen.tsx
│       ├── ProfileScreen.tsx
│       └── HabitDetailScreen.tsx
│
└── utils/
    └── storageHelpers.ts
```

---

# 🧩 Layer Breakdown

## Components Layer

Reusable UI building blocks.

**Responsibilities**

* Rendering
* Styling
* User interactions
* Memoization for performance

**Examples**

```text
CustomButton
CustomInput
HabitCard
```

These components remain free from business logic and external state mutations.

---

## Context Layer

Global application state management.

### AuthContext

Handles:

* Session persistence
* Authentication state
* Route protection
* User hydration

### ThemeContext

Handles:

* Dark mode
* Light mode
* Dynamic color computation
* Global UI consistency

---

## Hooks Layer

Encapsulates reusable business logic.

### useHabitStorage()

Provides:

* Create Habit
* Read Habit
* Update Habit
* Delete Habit
* Persistence Synchronization

This abstraction keeps screens lightweight and focused on presentation.

---

## Navigation Layer

Defines application route topology.

### RootNavigator

Acts as the application's routing gateway.

### AuthStack

Unauthenticated user routes.

### MainTabs

Authenticated application routes.

### types.ts

Centralized TypeScript route definitions for compile-time safety.

---

## Screens Layer

Feature containers that connect UI to application state.

### HomeScreen

* Habit feed rendering
* FlatList orchestration
* Hook consumption

### HabitDetailScreen

* Dynamic route parameter handling
* Detailed habit visualization

### ProfileScreen

* Theme controls
* Authentication actions

---

## Utility Layer

Pure helper functions with no UI dependencies.

### storageHelpers.ts

Responsible for:

* AsyncStorage access
* Data serialization
* Data deserialization
* Persistence abstraction

---

# ⚡ Performance Considerations

### React.memo Optimization

`HabitCard` utilizes memoization to prevent unnecessary re-renders during FlatList updates.

### Context Isolation

Authentication and theme state are separated to minimize component tree invalidation.

### Optimistic Updates

UI state updates instantly before storage writes complete, creating a smoother user experience.

### Type-Safe Navigation

Centralized route definitions eliminate runtime navigation errors.

---

# 🚀 Scalability Benefits

* Modular feature expansion
* Clear architectural boundaries
* Predictable data flow
* Reduced coupling
* Easier testing
* Improved maintainability
* Production-ready folder organization

The architecture is intentionally designed to support growth from a small productivity application to a significantly larger mobile platform without requiring structural rewrites.
