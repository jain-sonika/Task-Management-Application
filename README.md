# Task Management Application

A full-featured task management application built with React, TypeScript, and Mock Service Worker (MSW) for API mocking. This project demonstrates modern frontend development practices with comprehensive testing and clean architecture.

## 🚀 Features

- **User Authentication**: Login with mocked JWT authentication
- **Task CRUD Operations**: Create, Read, Update, and Delete tasks
- **State Management**: Zustand for efficient state management
- **Form Validation**: Formik + Yup for robust form handling
- **Mock API**: MSW (Mock Service Worker) for realistic API simulation
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first responsive UI with Ant Design
- **Persistent Storage**: LocalStorage for data persistence across sessions
- **100% Test Coverage**: Comprehensive unit tests with Jest
- **TypeScript**: Full type safety throughout the application

## 📋 Table of Contents

- [Demo Credentials](#demo-credentials)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How to Run Locally](#how-to-run-locally)
- [Mock API Implementation](#mock-api-implementation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Features in Detail](#features-in-detail)

## 🔐 Demo Credentials

- **Username**: `test`
- **Password**: `test123`

## 🛠️ Tech Stack

### Core Technologies
- **React 18.2** - UI library
- **TypeScript 5.3** - Type safety
- **Vite 5.0** - Build tool and dev server

### State Management
- **Zustand 4.4** - Lightweight state management

### UI/Styling
- **Ant Design 5.12** - Component library
- **Lucide React** - Icon library
- **Custom CSS** - Additional styling

### Form Management
- **Formik 2.4** - Form handling
- **Yup 1.3** - Schema validation

### API & Mocking
- **Axios 1.6** - HTTP client
- **Mock Service Worker (MSW) 2.0** - API mocking

### Testing
- **Jest 29.7** - Testing framework
- **React Testing Library 14.1** - Component testing
- **@testing-library/user-event** - User interaction simulation

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking

## 📁 Project Structure

```
task-management-app/
├── public/
│   └── mockServiceWorker.js      # MSW service worker
├── src/
│   ├── __tests__/                # Test files
│   │   ├── App.test.tsx
│   │   ├── Dashboard.test.tsx
│   │   ├── Login.test.tsx
│   │   ├── PrivateRoute.test.tsx
│   │   ├── TaskCard.test.tsx
│   │   ├── TaskModal.test.tsx
│   │   ├── store.test.ts
│   │   └── validations.test.ts
│   ├── components/               # React components
│   │   ├── PrivateRoute.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskCard.css
│   │   ├── TaskModal.tsx
│   │   └── TaskModal.css
│   ├── pages/                    # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Dashboard.css
│   │   ├── Login.tsx
│   │   └── Login.css
│   ├── mocks/                    # MSW mock handlers
│   │   ├── browser.ts
│   │   └── handlers.ts
│   ├── store/                    # Zustand stores
│   │   └── index.ts
│   ├── types/                    # TypeScript types
│   │   └── index.ts
│   ├── utils/                    # Utility functions
│   │   ├── api.ts
│   │   └── validations.ts
│   ├── App.tsx                   # Root component
│   ├── App.css
│   ├── main.tsx                  # Entry point
│   ├── index.css
│   ├── setupTests.ts             # Test setup
│   └── vite-env.d.ts
├── .eslintrc.cjs                 # ESLint configuration
├── jest.config.js                # Jest configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tsconfig.node.json
├── vite.config.ts                # Vite configuration
└── README.md
```

## 🏃 How to Run Locally

### Prerequisites
- Node.js 18+ and npm/yarn installed

### Installation Steps

1. **Clone or extract the project**
   ```bash
   cd task-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize MSW (Mock Service Worker)**
   ```bash
   npx msw init public/ --save
   ```
   This creates the service worker file needed for API mocking.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

5. **Run tests**
   ```bash
   npm test
   ```

6. **Run tests with coverage**
   ```bash
   npm test -- --coverage
   ```

7. **Build for production**
   ```bash
   npm run build
   ```

8. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎭 Mock API Implementation

### How It Works

This application uses **Mock Service Worker (MSW)** to intercept HTTP requests and provide realistic API responses without a backend server.

### Mock API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | User authentication |
| GET | `/api/tasks` | Fetch all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Data Persistence

- **LocalStorage Integration**: All tasks are stored in `localStorage` to persist across page refreshes
- **Mock User**: Default user credentials are `test` / `test123`
- **JWT Token**: A mock JWT token is generated on successful login

### MSW Configuration

The mock handlers are defined in `src/mocks/handlers.ts` and include:
- Network delay simulation (300-500ms)
- Authentication token validation
- Error handling for unauthorized requests
- CRUD operations with localStorage sync

### Starting MSW

MSW is automatically initialized in `src/main.tsx`:
```typescript
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}
```

## 🧪 Testing

### Test Coverage

The project maintains **100% code coverage** across all files:

- ✅ Store tests (Zustand state management)
- ✅ Component tests (Login, Dashboard, TaskCard, TaskModal, PrivateRoute, App)
- ✅ Validation tests (Formik schemas)
- ✅ All edge cases and error scenarios

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- Login.test.tsx
```

### Test Configuration

Tests are configured in `jest.config.js` with:
- TypeScript support via `ts-jest`
- JSDOM environment for DOM testing
- React Testing Library setup
- Coverage thresholds set to 100%

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Build configuration** (automatic with Vite)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install && npx msw init public/ --save`

### Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Build configuration**
   - Build Command: `npm run build && npx msw init public/ --save`
   - Publish Directory: `dist`

### Environment Variables

No environment variables are required since all API calls are mocked with MSW.

## ✨ Features in Detail

### Authentication
- Login form with validation
- JWT token storage in localStorage
- Protected routes with automatic redirection
- Logout functionality

### Task Management
- Create new tasks with title, description, and status
- Update existing tasks
- Delete tasks with confirmation
- Filter tasks by status (All, To Do, In Progress, Completed)
- Real-time statistics dashboard

### UI/UX
- Responsive design for mobile, tablet, and desktop
- Dark mode toggle with localStorage persistence
- Loading states and error handling
- Empty states with helpful messages
- Confirmation dialogs for destructive actions

### State Management
- **Auth Store**: Manages user authentication state
- **Task Store**: Handles task CRUD operations
- **Theme Store**: Controls dark/light mode
- All stores persist to localStorage

### Form Validation
- Username: minimum 3 characters
- Password: minimum 6 characters
- Task Title: 3-100 characters
- Task Description: 10-500 characters
- Status: must be valid enum value

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## 🎨 Design Highlights

- **Modern Gradient Theme**: Purple gradient color scheme
- **Card-based Layout**: Clean, organized task cards
- **Smooth Animations**: Hover effects and transitions
- **Accessible**: Semantic HTML and ARIA labels
- **Professional Typography**: Clear hierarchy and readability

## 🐛 Known Limitations

- MSW service worker requires HTTPS in production or localhost
- LocalStorage has a 5-10MB limit per domain
- No real backend authentication (this is a frontend-only demo)

## 📄 License

This project is created for educational and demonstration purposes.

## 🤝 Contributing

This is a case study project. Feel free to fork and modify for your own use.

## 📧 Contact

For questions or feedback about this case study, please refer to the project documentation.

---

Built with ❤️ using React, TypeScript, and Mock Service Worker
