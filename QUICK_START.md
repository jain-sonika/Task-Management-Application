# Quick Start Guide

Get the Task Management Application running in 3 minutes!

## ⚡ Fast Setup

```bash
# 1. Navigate to project
cd task-management-app

# 2. Install dependencies (takes ~1 minute)
npm install

# 3. Initialize Mock Service Worker
npx msw init public/ --save

# 4. Start the app
npm run dev
```

**Done!** Open http://localhost:3000

## 🔐 Login

Use these credentials:
- **Username**: `test`
- **Password**: `test123`

## ✅ Verify Everything Works

After logging in, you should see:
- ✓ Dashboard with welcome message
- ✓ 3 sample tasks
- ✓ Statistics cards showing counts
- ✓ Light/Dark mode toggle
- ✓ New Task button

## 🧪 Run Tests

```bash
# Run all tests with coverage
npm test -- --coverage

# You should see:
# - All tests passing ✓
# - 100% coverage on all metrics ✓
```

## 🚀 Build for Production

```bash
npm run build
npm run preview
```

## 🐛 Troubleshooting

### MSW Service Worker Error
```bash
# Regenerate the service worker
npx msw init public/ --save
```

### Port Already in Use
```bash
# Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📖 Next Steps

1. Read [README.md](README.md) for full documentation
2. Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) to deploy
3. Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture

## 💡 Key Features to Try

1. **Create Task**: Click "New Task" button
2. **Edit Task**: Click Edit on any task card
3. **Delete Task**: Click Delete and confirm
4. **Filter Tasks**: Use status dropdown
5. **Dark Mode**: Toggle theme button
6. **Logout**: Click logout button

## 🎯 Demo Workflow

```
1. Login with test/test123
2. See 3 existing tasks
3. Create a new task
4. Edit an existing task
5. Delete a task
6. Filter by status
7. Toggle dark mode
8. Logout
9. Login again (data persists!)
```

## 📝 File Structure at a Glance

```
src/
├── components/     # Reusable UI components
├── pages/          # Login & Dashboard pages
├── mocks/          # MSW API handlers
├── store/          # Zustand state stores
├── types/          # TypeScript interfaces
├── utils/          # Helper functions
└── __tests__/      # Test files
```

## 🔍 What's Happening Behind the Scenes

1. **MSW intercepts** all `/api/*` requests
2. **Mock handlers** return realistic data
3. **LocalStorage** persists everything
4. **Zustand stores** manage state
5. **React components** render UI
6. **Formik + Yup** validate forms

## ✨ Pro Tips

- Tasks persist in localStorage - they survive page refresh!
- Dark mode preference is saved
- Auth token is stored - stays logged in
- All API calls have realistic delays
- Open DevTools → Network to see intercepted requests

---

**Need Help?** Check the full [README.md](README.md) or review test files for examples!
