# 🎨 Online Judge Frontend

React-based frontend for the Online Judge Platform - A professional competitive programming platform.

## ✨ Features

- 💻 **Monaco Code Editor** with C++ and Python support
- 🔍 **Font Size Controls** (zoom in/out with persistent settings)
- 🌐 **Multi-language Support** (English/Arabic with machine translation)
- 📊 **User Profiles** with statistics and solved problems
- 🏆 **Global Leaderboard** sorted by Elo rating
- 📅 **Contests System** (Official + Virtual)
- 📱 **Fully Responsive** design (Desktop + Mobile)
- 🎨 **Modern Dark UI** with Tailwind CSS

## 🛠️ Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS** for styling
- **Monaco Editor** (@monaco-editor/react)
- **Axios** for API calls
- **React Router** for navigation
- **Lucide React** for icons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Backend running on `http://localhost:5000`

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Create environment file**

Create `.env` file in the root:
```env
VITE_API_URL=http://localhost:5000
```

3. **Start development server**
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/       # Reusable components (Navbar, ProtectedRoute)
├── pages/            # Main pages
│   ├── admin/        # Admin panel pages
│   └── contests/     # Contest-related pages
├── context/          # React Context (AuthContext)
├── services/         # API services
└── index.css         # Global styles
```

## 🔗 Backend Repository

This frontend works with the backend: [online-judge](https://github.com/amerabuarab441-max/online-judge)

---

Made with ❤️ for competitive programmers