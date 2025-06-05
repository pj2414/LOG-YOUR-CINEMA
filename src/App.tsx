import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import BackgroundSlider from "@/components/BackgroundSlider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Search from "@/pages/Search";
import Movies from "@/pages/Movies";
import MovieDetail from "@/pages/MovieDetail";
import TV from "@/pages/TV";
import TVDetail from "@/pages/TVDetail";
import Anime from "@/pages/Anime";
import AnimeDetail from "@/pages/AnimeDetail";
import Diary from "@/pages/Diary";
import Friends from "@/pages/Friends";
import Social from "@/pages/Social";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundSlider />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <><Landing /><Footer /></>} />
          <Route path="/login" element={<><Login /><Footer /></>} />
          <Route path="/register" element={<><Register /><Footer /></>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="flex-1">
                    <Dashboard />
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="flex-1">
                    <Search />
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="flex-1">
                    <Movies />
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie/:movieId"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="flex-1">
                    <MovieDetail />
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tv"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="flex-1">
                    <TV />
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tv/:tvId"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="flex-1">
                    <TVDetail />
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/anime"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="flex-1">
                    <Anime />
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/anime/:animeId"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="flex-1">
                    <AnimeDetail />
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/diary"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="flex-1">
                    <Diary />
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="flex-1">
                    <Friends />
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/social"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="flex-1">
                    <Social />
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="flex-1">
                    <Profile />
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="flex-1">
                    <Admin />
                  </div>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<><NotFound /><Footer /></>} />
        </Routes>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
