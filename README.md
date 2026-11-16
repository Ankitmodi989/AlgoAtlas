# ⚡ AlgoAtlas — Interactive DSA Visualizer & Learning Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.3-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.2-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**AlgoAtlas** is a modern, full-stack Data Structures & Algorithms (DSA) visualization and mastery platform. It combines step-by-step interactive algorithm simulations, multi-language code implementations, complexity cheat-sheets, progress tracking, and an integrated AI assistant to make learning algorithms intuitive and engaging.

---

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Architecture](#-project-architecture)
- [🚀 Quick Start Guide](#-quick-start-guide)
  - [Option A: Instant Preview (No Database Required)](#option-a-instant-preview-no-database-required)
  - [Option B: Full-Stack Setup (Frontend + Backend + MongoDB)](#option-b-full-stack-setup-frontend--backend--mongodb)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [📡 Backend API Reference](#-backend-api-reference)
- [📊 Supported Algorithms Matrix](#-supported-algorithms-matrix)
- [📜 Available Scripts](#-available-scripts)
- [🤝 Contributing & License](#-contributing--license)

---

## ✨ Key Features

- **Interactive Visualizers**: Step-by-step visual execution with play/pause, step-forward, step-backward, animation speed control (0.5x to 4x), live comparison/swap counters, and custom array inputs.
- **29 Curated Algorithms**: Spanning Comparison Sorting, Non-Comparison Sorting, Searching, Graph Algorithms, Dynamic Programming, and Tree Traversals.
- **Multi-Language Code Implementations**: Clean, copy-ready implementations for every algorithm in **JavaScript**, **Python**, **Java**, **C**, and **C++**.
- **Interactive Quizzes**: Built-in 5-question comprehension quizzes per algorithm to test and reinforce concepts.
- **Comprehensive Theory & Complexity Cards**: Best, Average, and Worst case time complexities, space complexity, stability, in-place indicators, pros, cons, and practical use cases.
- **Flexible Authentication**:
  - **Full-Stack Mode**: Secure authentication with Node.js/Express, MongoDB, bcrypt password hashing, and JWT tokens in HTTP-only cookies.
  - **Guest Mode**: Instant one-click preview without needing to start or configure a database.
- **DSA Progress Tracker**: Track topic completion across Arrays, Strings, Linked Lists, Trees, and Dynamic Programming.
- **Wishlist / Bookmarks**: Save important algorithms for quick revision.
- **AI Chatbot Assistant**: Embedded Gemini AI assistant floating widget to answer questions about time complexities, optimizations, and DSA problems.
- **Dark & Light Mode**: Built-in theme switcher with persistent contrast-friendly palettes.

---

## 🛠️ Tech Stack

### Frontend Client
| Technology | Description |
| :--- | :--- |
| **React 19** | Component-driven UI library |
| **Vite 8** | Next-generation frontend tooling and rapid HMR |
| **Tailwind CSS 4** | Utility-first responsive styling |
| **React Router v7** | Client-side routing and protected routes |
| **Lucide React** | Modern iconography |
| **Google Generative AI SDK** | Gemini-powered DSA AI assistant |

### Backend API
| Technology | Description |
| :--- | :--- |
| **Node.js** | JavaScript runtime environment |
| **Express.js v5** | Lightweight REST API framework |
| **MongoDB & Mongoose v9** | NoSQL database and schema modeling |
| **JSONWebToken (JWT)** | Stateless authentication with signed tokens |
| **bcryptjs** | Salted password hashing |
| **cookie-parser** | HTTP-only cookie parsing |
| **CORS** | Cross-Origin Resource Sharing with credentials support |

---

## 📁 Project Architecture

```text
DSA-visualizer/
├── public/                       # Static public assets
├── src/                          # Frontend React source code
│   ├── AiChatbot/                # Gemini AI Chatbot assistant
│   │   └── Chatbot.jsx
│   ├── assets/                   # Algorithm diagrams and thumbnails
│   ├── component/                # Reusable UI components & pages
│   │   ├── AboutPage.jsx         # About platform page
│   │   ├── Algo_List.jsx         # Algorithm metadata & catalog (29 algorithms)
│   │   ├── Algo_page.jsx         # Dynamic algorithm route handler
│   │   ├── AuthContext.jsx       # Auth provider (Backend + Guest fallback)
│   │   ├── AuthPage.jsx          # Login & Sign-Up with Guest option
│   │   ├── Container.jsx         # Grid container
│   │   ├── Content.jsx           # Main dashboard & algorithm gallery
│   │   ├── DSATracker.jsx        # DSA progress tracker
│   │   ├── Favour.jsx            # Wishlist / Bookmarks page
│   │   ├── Header.jsx            # Navbar, theme toggle, and user profile
│   │   ├── Sidebar.jsx           # Category filters (Sorting, Searching, etc.)
│   │   └── ThemeProvider.jsx     # Dark / Light theme context
│   ├── Sorting_algo/             # Algorithm visualizer implementations
│   │   ├── AlgoData.jsx          # Algorithm theory, quiz data, and code snippets
│   │   ├── AlgoTemplate.jsx      # Generic step-by-step visualizer engine
│   │   ├── MergeSort.jsx         # Custom Merge Sort interactive visualizer
│   │   └── QuickSort.jsx         # Custom Quick Sort interactive visualizer
│   ├── App.jsx                   # Application router & route guards
│   ├── index.css                 # Global CSS and Tailwind directives
│   └── main.jsx                  # React application entry point
├── backend/                      # Backend REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # Mongoose MongoDB connection
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js # JWT cookie verification guard
│   │   ├── models/
│   │   │   └── user.model.js     # User schema & password hashing
│   │   ├── routers/
│   │   │   ├── auth.router.js    # Auth endpoints (/signup, /login, /me, /logout)
│   │   │   └── user.routes.js    # User management routes
│   │   ├── utils/
│   │   │   ├── generateToken.js  # JWT signing helper
│   │   │   └── sendToken.js      # HTTP-only cookie dispatcher
│   │   └── app.js                # Express app setup, CORS, and parsers
│   ├── .env.example              # Template backend environment variables
│   ├── package.json              # Backend dependencies and scripts
│   └── server.js                 # Backend entry point (Port 8000)
├── index.html                    # HTML entry point
├── package.json                  # Frontend dependencies and scripts
├── vite.config.js                # Vite configuration
└── README.md                     # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18.0 or higher) installed:
```bash
node -v
npm -v
```

---

### Option A: Instant Preview (No Database Required)

If you want to immediately run, explore, and test the algorithm visualizers without setting up MongoDB:

1. **Install frontend dependencies** (from the root folder):
   ```bash
   npm install
   ```

2. **Start the Vite development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to **`http://localhost:5173`**.

4. **Click "🚀 Explore as Guest (Instant Preview)"** on the login page:
   You will instantly bypass login and access the full dashboard with all 29 algorithms and interactive visualizers!

---

### Option B: Full-Stack Setup (Frontend + Backend + MongoDB)

Use this setup to run the complete stack with database-persisted user authentication:

#### 1. Configure Backend Environment
Navigate to the `backend/` folder and create your `.env` file:
```bash
cd backend
cp .env.example .env
```
*(On Windows PowerShell, use: `copy .env.example .env`)*

Open `backend/.env` and configure your MongoDB connection string:
- **Local MongoDB**:
  ```env
  MONGODB_URI=mongodb://127.0.0.1:27017/dsa
  ```
- **MongoDB Atlas (Cloud)**:
  ```env
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database_name>
  ```

#### 2. Install Backend Dependencies & Start Server (Terminal 1)
```bash
cd backend
npm install
npm run dev
```
When running successfully, you will see:
```text
Database Connected
Server started on http://localhost:8000
```

#### 3. Install Frontend Dependencies & Start Client (Terminal 2)
Open a new terminal in the project root:
```bash
npm install
npm run dev
```

#### 4. Access the Application
Open **`http://localhost:5173`** in your browser. You can now use the **Sign Up** tab to create a permanent account stored in your MongoDB database.

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)

| Variable | Description | Example / Default | Required |
| :--- | :--- | :--- | :--- |
| `PORT` | Port for Express server | `8000` | No (defaults to 8000) |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/dsa` | Yes (for Full-Stack mode) |
| `JWT_SECRET` | Secret key for signing JWT tokens | Random string | Yes (for Auth) |
| `JWT_EXPIRES_IN` | Token expiration period | `1d` | No (defaults to 1d) |
| `NODE_ENV` | Application environment | `development` | No |

---

## 📡 Backend API Reference

**Base URL**: `http://localhost:8000/api/auth`  
*All requests requiring authentication automatically send and receive credentials via HTTP-only cookies (`credentials: "include"`).*

### 1. User Sign Up
- **Endpoint**: `POST /api/auth/signup`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password@123"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "_id": "6735c0...",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

### 2. User Log In
- **Endpoint**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password@123"
  }
  ```
- **Response (`200 OK`)**: Sets an `httpOnly` JWT session cookie and returns user profile.

### 3. Current User Verification
- **Endpoint**: `GET /api/auth/me`
- **Headers / Cookie**: Automatically verified from browser session cookie.
- **Response (`200 OK`)**: Returns current active session user.

### 4. User Log Out
- **Endpoint**: `GET /api/auth/logout`
- **Response (`200 OK`)**: Clears the authentication cookie.

---

## 📊 Supported Algorithms Matrix

| # | Algorithm | Category | Visualizer Status | Best Case | Worst Case | Space |
| :-: | :--- | :--- | :---: | :---: | :---: | :---: |
| 1 | **Bubble Sort** | Comparison Sorting | Interactive Visualizer | $O(n)$ | $O(n^2)$ | $O(1)$ |
| 2 | **Insertion Sort** | Comparison Sorting | Interactive Visualizer | $O(n)$ | $O(n^2)$ | $O(1)$ |
| 3 | **Selection Sort** | Comparison Sorting | Interactive Visualizer | $O(n^2)$ | $O(n^2)$ | $O(1)$ |
| 4 | **Merge Sort** | Comparison Sorting | Custom Interactive | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ |
| 5 | **Quick Sort** | Comparison Sorting | Custom Interactive | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ |
| 6 | **Heap Sort** | Comparison Sorting | Interactive Visualizer | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ |
| 7 | **Counting Sort** | Non-Comparison | Interactive Visualizer | $O(n + k)$ | $O(n + k)$ | $O(k)$ |
| 8 | **Breadth First Search (BFS)** | Graph Traversal | Interactive / Theory | $O(V + E)$ | $O(V + E)$ | $O(V)$ |
| 9 | **Depth First Search (DFS)** | Graph Traversal | Interactive / Theory | $O(V + E)$ | $O(V + E)$ | $O(V)$ |
| 10 | **Linear Search** | Searching | Catalog Card | $O(1)$ | $O(n)$ | $O(1)$ |
| 11 | **Binary Search** | Searching | Catalog Card | $O(1)$ | $O(\log n)$ | $O(1)$ |
| 12 | **Jump Search** | Searching | Catalog Card | $O(1)$ | $O(\sqrt{n})$ | $O(1)$ |
| 13 | **Interpolation Search** | Searching | Catalog Card | $O(1)$ | $O(n)$ | $O(1)$ |
| 14 | **Exponential Search** | Searching | Catalog Card | $O(1)$ | $O(\log n)$ | $O(1)$ |
| 15 | **Dijkstra's Algorithm** | Shortest Path | Catalog Card | $O(V + E \log V)$ | $O(V^2)$ | $O(V)$ |
| 16 | **Bellman-Ford Algorithm** | Shortest Path | Catalog Card | $O(E)$ | $O(VE)$ | $O(V)$ |
| 17 | **Kruskal's Algorithm** | Minimum Spanning Tree | Catalog Card | $O(E \log E)$ | $O(E \log E)$ | $O(V + E)$ |
| 18 | **Prim's Algorithm** | Minimum Spanning Tree | Catalog Card | $O(E \log V)$ | $O(V^2)$ | $O(V)$ |
| 19 | **Fibonacci (DP)** | Dynamic Programming | Catalog Card | $O(n)$ | $O(n)$ | $O(n)$ |
| 20 | **0/1 Knapsack** | Dynamic Programming | Catalog Card | $O(n \cdot W)$ | $O(n \cdot W)$ | $O(n \cdot W)$ |
| 21 | **Longest Common Subsequence (LCS)** | Dynamic Programming | Catalog Card | $O(m \cdot n)$ | $O(m \cdot n)$ | $O(m \cdot n)$ |
| 22 | **Longest Increasing Subsequence (LIS)** | Dynamic Programming | Catalog Card | $O(n \log n)$ | $O(n^2)$ | $O(n)$ |
| 23 | **Coin Change Problem** | Dynamic Programming | Catalog Card | $O(n \cdot \text{amount})$ | $O(n \cdot \text{amount})$ | $O(\text{amount})$ |
| 24 | **Edit Distance** | Dynamic Programming | Catalog Card | $O(m \cdot n)$ | $O(m \cdot n)$ | $O(m \cdot n)$ |
| 25 | **Binary Tree Inorder Traversal** | Tree Traversal | Catalog Card | $O(n)$ | $O(n)$ | $O(h)$ |
| 26 | **Binary Tree Preorder Traversal** | Tree Traversal | Catalog Card | $O(n)$ | $O(n)$ | $O(h)$ |
| 27 | **Binary Tree Postorder Traversal** | Tree Traversal | Catalog Card | $O(n)$ | $O(n)$ | $O(h)$ |
| 28 | **BST Insertion** | Tree Operations | Catalog Card | $O(\log n)$ | $O(n)$ | $O(h)$ |
| 29 | **AVL Tree Balancing** | Balanced Trees | Catalog Card | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ |

---

## 📜 Available Scripts

### Frontend Scripts (Run from root)
- `npm run dev`: Starts the Vite development server on `http://localhost:5173`.
- `npm run build`: Bundles optimized production client into `dist/`.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint over project files.

### Backend Scripts (Run from `backend/`)
- `npm run dev`: Starts the Express server with `nodemon` auto-reloading on port 8000.
- `npm start`: Starts the production Node.js server (`node server.js`).

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome! Feel free to open a pull request or issue to add more visualizers or expand quiz questions.

This project is licensed under the **ISC License**.
