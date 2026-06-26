import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { NutritionProvider } from './context/NutritionContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import { Shimmer } from './components/ui/Skeleton';

const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Pantry = lazy(() => import('./pages/Pantry'));
const RecipeGenerator = lazy(() => import('./pages/RecipeGenerator'));
const MyRecipes = lazy(() => import('./pages/MyRecipes'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const CookingMode = lazy(() => import('./pages/CookingMode'));
const ShoppingList = lazy(() => import('./pages/ShoppingList'));
const Settings = lazy(() => import('./pages/Settings'));
const MealPlanner = lazy(() => import('./pages/MealPlanner'));
const Favorites = lazy(() => import('./pages/Favorites'));
const NutritionTracker = lazy(() => import('./pages/NutritionTracker'));
const Collections = lazy(() => import('./pages/Collections'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Notifications = lazy(() => import('./pages/Notifications'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Help = lazy(() => import('./pages/Help'));
const HealthGoals = lazy(() => import('./pages/HealthGoals'));

const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
      <Shimmer className="h-12 w-64 rounded-xl" />
      <Shimmer className="h-48 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Shimmer className="h-32 rounded-2xl" />
        <Shimmer className="h-32 rounded-2xl" />
        <Shimmer className="h-32 rounded-2xl" />
      </div>
    </div>
  </div>
);

const WrappedRoute = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

function App() {
  return (
    <ThemeProvider>
      <NutritionProvider>
        <RecentlyViewedProvider>
          <AuthProvider>
            <Router>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/login" element={<WrappedRoute><Login /></WrappedRoute>} />
                  <Route path="/signup" element={<WrappedRoute><SignUp /></WrappedRoute>} />
                  <Route path="/forgot-password" element={<WrappedRoute><ForgotPassword /></WrappedRoute>} />
                  <Route path="/dashboard" element={<WrappedRoute><ProtectedRoute><Dashboard /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/pantry" element={<WrappedRoute><ProtectedRoute><Pantry /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/generate" element={<WrappedRoute><ProtectedRoute><RecipeGenerator /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/recipes" element={<WrappedRoute><ProtectedRoute><MyRecipes /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/recipes/:id" element={<WrappedRoute><ProtectedRoute><RecipeDetail /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/recipes/:id/cook" element={<WrappedRoute><ProtectedRoute><CookingMode /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/favorites" element={<WrappedRoute><ProtectedRoute><Favorites /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/nutrition" element={<WrappedRoute><ProtectedRoute><NutritionTracker /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/collections" element={<WrappedRoute><ProtectedRoute><Collections /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/meal-plan" element={<WrappedRoute><ProtectedRoute><MealPlanner /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/shopping-list" element={<WrappedRoute><ProtectedRoute><ShoppingList /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/settings" element={<WrappedRoute><ProtectedRoute><Settings /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/notifications" element={<WrappedRoute><ProtectedRoute><Notifications /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/ai-assistant" element={<WrappedRoute><ProtectedRoute><AIAssistant /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/achievements" element={<WrappedRoute><ProtectedRoute><Achievements /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/health-goals" element={<WrappedRoute><ProtectedRoute><HealthGoals /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/help" element={<WrappedRoute><ProtectedRoute><Help /></ProtectedRoute></WrappedRoute>} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<WrappedRoute><NotFound /></WrappedRoute>} />
                </Routes>
              </AnimatePresence>
            </Router>

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'rgba(255,255,255,0.9)',
                  color: '#111827',
                  border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: '1rem',
                  padding: '14px 18px',
                  fontSize: '14px',
                  fontWeight: 500,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  backdropFilter: 'blur(20px)',
                },
                success: {
                  iconTheme: { primary: '#10b981', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                },
              }}
            />
          </AuthProvider>
        </RecentlyViewedProvider>
      </NutritionProvider>
    </ThemeProvider>
  );
}

export default App;
