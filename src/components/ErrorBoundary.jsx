import { Component } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ChefHat className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Oops! Something went wrong</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-2">We encountered an unexpected error. Please try refreshing.</p>
            {this.state.error && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl p-3 mb-6 font-mono truncate">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">
                <Home className="w-4 h-4" /> Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
