
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading your cinema...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if authenticated, otherwise to login
  return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
};

export default Index;
