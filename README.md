# 🌌 AETHERIA — FUTURISTIC 3D LIQUID GLASS BOOK LIBRARY MANAGEMENT SYSTEM

> A next-generation commercial SaaS-tier Book Library Management Web Application engineered with an Apple VisionOS-inspired Liquid Glass interface, hardware-accelerated 3D Three.js experiences, real-time inventory telemetry, role-enforced academic portals, and automated fine calculation engines.

---

## 🚀 Key Highlights & Capabilities

- **VisionOS Liquid Glass Theme**: Translucent glass panels (`backdrop-blur-2xl`), glowing neon borders, layered translucent cards, specular lighting sheen, and deep obsidian/electric blue palettes.
- **Interactive 3D Three.js Experience**:
  - **Hero 3D Floating Book**: Dynamic procedural 3D open book with animated fluttering pages, holographic glowing text streams, orbital particles, and cursor-following parallax rotation.
  - **Ambient Floating Space**: Background mini-books bobbing gently in 3D coordinate space.
  - **Card3DTilt**: Apple VisionOS-style interactive 3D card tilt with specular glare highlights.
- **Dual Persistent Datastore Architecture**:
  - Connects to **MongoDB** via Mongoose when available.
  - Features an **automatic resilient in-memory / zero-config datastore** if MongoDB is not running locally, ensuring 100% immediate out-of-the-box functionality with full pre-seeded books, students, transactions, and categories!
- **Role-Based Access Control (RBAC)**:
  - **Administrator Portal**: Comprehensive control deck, inventory CRUD, student enrollment, checkout/return reconciliation, and audit reporting.
  - **Scholar Student Portal**: Self-service catalog exploration, 1-click book borrowing, countdown timers to return due dates, and borrow history.
- **Instant 1-Click Demo Accounts**:
  - No typing required! 1-Click "Demo Admin" and "Demo Student" buttons integrated into hero and login screens.
- **Export Engine**:
  - Direct **PDF Export** via `jsPDF` and `jspdf-autotable`.
  - Direct **Excel Export (XLSX)** via `xlsx`.
- **Automated Fine Settlement Engine**:
  - Dynamically calculates late return fines ($2/day) with instant reconciliation on return.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS with custom glassmorphism design tokens & utilities
- **3D Graphics**: Three.js & `@react-three/fiber`, `@react-three/drei`
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Monthly circulation area curves & category distribution donut charts)
- **Document Exporting**: `jspdf`, `jspdf-autotable`, `xlsx`
- **Micro-Interactions**: `canvas-confetti`
- **HTTP Client**: Axios with automatic JWT interceptors

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js (ES Modules)
- **Database**: MongoDB with Mongoose (with dual-engine fallback support)
- **Authentication**: JSON Web Tokens (JWT) & `bcryptjs` password hashing
- **Middleware**: CORS, Body Parser, Auth Guards (`protect`, `authorize`)

---

## 📁 Project Architecture

```
lib/
├── client/                     # Vite React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/             # Three.js & R3F components
│   │   │   │   ├── HeroBook3D.jsx         # 3D floating book model
│   │   │   │   ├── BackgroundCanvas.jsx   # Ambient particles & mini books
│   │   │   │   └── Card3DTilt.jsx         # Apple VisionOS 3D tilt with glare
│   │   │   └── common/         # Glass UI components
│   │   │       ├── GlassSidebar.jsx       # Collapsible glass navigation
│   │   │       ├── GlassHeader.jsx        # Search, live clock, notifications
│   │   │       ├── StatCard.jsx           # Metric card with glow & trends
│   │   │       └── Modal.jsx              # Reusable glass spring modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx # JWT session, role guards, demo accounts
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx            # 3D Hero, stats, featured books
│   │   │   ├── LoginPage.jsx              # Liquid glass sign in & 1-click demos
│   │   │   ├── RegisterPage.jsx           # Account enrollment
│   │   │   ├── DashboardPage.jsx          # Admin KPI deck & Recharts
│   │   │   ├── BooksPage.jsx              # Catalog CRUD & 3D tilt cards
│   │   │   ├── CategoriesPage.jsx         # Research domains & counts
│   │   │   ├── StudentsPage.jsx           # Scholar management & history
│   │   │   ├── IssueReturnPage.jsx        # Checkout & return terminal
│   │   │   ├── TransactionsPage.jsx       # Audit ledger & log
│   │   │   ├── StudentPortalPage.jsx      # Scholar workspace & borrow requests
│   │   │   ├── ReportsPage.jsx            # PDF & Excel export center
│   │   │   └── SettingsPage.jsx           # Governance & profile rules
│   │   ├── services/
│   │   │   └── api.js          # Axios API client
│   │   ├── App.jsx             # React Router structure
│   │   ├── index.css           # Liquid glass design system
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js Express REST Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection + Resilient memory fallback
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── studentController.js
│   │   ├── transactionController.js
│   │   ├── reportController.js
│   │   └── settingController.js
│   ├── middleware/
│   │   └── auth.js             # JWT verification & role authorization
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Category.js
│   │   ├── BorrowTransaction.js
│   │   └── Setting.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── reportRoutes.js
│   │   └── settingRoutes.js
│   ├── services/
│   │   └── dataService.js      # Seeding engine
│   ├── scripts/
│   │   └── seedData.js         # Realistic initial dataset
│   └── server.js
│
└── package.json                # Root orchestration
```

---

## ⚡ Installation & Execution Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- *(Optional)* MongoDB locally or MongoDB Atlas connection string. If MongoDB is not present, the app automatically switches to the built-in memory store with zero configuration!

### Quick Start (Run Both Client and Server)

1. **Install dependencies**:
   ```bash
   # Install all packages for root, server, and client:
   npm run install-all
   ```

2. **Start the full stack**:
   ```bash
   # Starts backend on http://localhost:5000 and client on http://localhost:5173
   npm run dev
   ```

3. **Or run independently**:
   ```bash
   # Start Server:
   npm run server
   
   # Start Client:
   npm run client
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Demo Credentials

| Role | Email | Password | Quick Action |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@library.com` | `admin123` | Click **"Demo Admin"** on the hero or login page |
| **Student** | `student@library.com` | `student123` | Click **"Demo Student"** on the hero or login page |

*(You can also effortlessly switch between Admin and Student perspectives at any moment using the **"Switch to Student / Admin"** button located in the top navigation bar!)*

---

## 🌐 REST API Endpoints Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health & active database engine mode | Public |
| `POST` | `/api/auth/login` | Authenticate & retrieve JWT token | Public |
| `POST` | `/api/auth/register` | Enroll new scholar or admin | Public |
| `GET` | `/api/auth/me` | Current authenticated user profile | Private |
| `PUT` | `/api/auth/profile` | Update profile information | Private |
| `GET` | `/api/books` | Search, filter, and list catalog books | Public |
| `GET` | `/api/books/categories` | List categories with book counts | Public |
| `POST` | `/api/books` | Catalog a new book volume | Admin |
| `PUT` | `/api/books/:id` | Edit book specifications | Admin |
| `DELETE` | `/api/books/:id` | Remove book from catalog | Admin |
| `GET` | `/api/students` | List registered students with active loan counts | Admin |
| `POST` | `/api/students` | Enroll student scholar | Admin |
| `POST` | `/api/transactions/issue` | Checkout/Issue book to scholar | Private |
| `POST` | `/api/transactions/return` | Reconcile return & calculate late penalties | Private |
| `GET` | `/api/transactions` | Full circulation transaction ledger | Admin |
| `GET` | `/api/transactions/my` | Current student's active loans & history | Student |
| `GET` | `/api/reports/dashboard` | KPI numbers, circulation trends, category share | Private |
| `GET` | `/api/reports/full` | Full audit report dataset for PDF/Excel export | Admin |
| `GET` | `/api/settings` | Retrieve library governance rules & fine rates | Public |
| `PUT` | `/api/settings` | Update fine rates, borrow days, max books | Admin |

---

## 🎨 Visual Identity & Polish Checklist
- [x] Apple VisionOS-inspired Liquid Glass surfaces with realistic blur filters
- [x] Procedural 3D interactive floating open book with fluttering pages and data stream lines
- [x] Ambient floating 3D particle dust and background volumes
- [x] 3D card tilt with realistic cursor-following specular glare
- [x] Full CRUD operations for books and students with responsive modals
- [x] Real-time inventory synchronization across checkouts and returns
- [x] Dynamic late fine calculation engine ($2.00/day)
- [x] Export to PDF (formatted tables via jsPDF) & Export to Excel (.xlsx)
- [x] Student self-service workspace with countdown timers and overdue badges
- [x] Recharts analytics curves and donut distributions
- [x] Tested production build (`npm run build`) passing with zero errors
