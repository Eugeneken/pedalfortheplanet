import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import RideNav from './pages/RideNav';
import AdminDashboard from './pages/AdminDashboard';
import EventWebsite from './pages/EventWebsite';
import AuthDebug from '@/components/AuthDebug';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
          <div className="max-w-xl w-full p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
            <h1 className="text-2xl font-semibold text-slate-900 mb-4">Authentication required</h1>
            <p className="text-slate-600 mb-6">
              The app needs you to sign in before it can continue. If you are not redirected automatically, use the button below.
            </p>
            <button
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
              onClick={navigateToLogin}
            >
              Sign in with your account
            </button>
            <div className="mt-6 text-left text-sm text-slate-500">
              <p><strong>Auth error details:</strong></p>
              <pre className="mt-2 overflow-auto rounded bg-slate-100 p-3 text-xs text-slate-700 max-h-48">{JSON.stringify(authError, null, 2)}</pre>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-center">
        <div className="max-w-xl w-full p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900 mb-4">Application error</h1>
          <p className="text-slate-600 mb-6">The app encountered an authentication or configuration issue.</p>
          <pre className="overflow-auto rounded bg-slate-100 p-3 text-xs text-slate-700 max-h-48">{JSON.stringify(authError, null, 2)}</pre>
        </div>
      </div>
    );
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<EventWebsite />} />
      <Route path="/ride" element={<RideNav />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <AuthDebug />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App