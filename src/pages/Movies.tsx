import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, TrendingUp } from 'lucide-react';

// MovieCard Component
const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <Card className="glass-card hover-glow transition-all duration-300 hover:scale-105">
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                : '/placeholder.svg'
              }
              alt={movie.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.target.src = '/placeholder.svg';
              }}
            />
            {movie.vote_average > 0 && (
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-white font-medium">{movie.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-white group-hover:text-neon-blue transition-colors line-clamp-2 text-lg">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </span>
              </div>
              {movie.genre_ids && movie.genre_ids.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {movie.genre_ids.length} Genre{movie.genre_ids.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{movie.overview}</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-neon-blue font-medium">View Details</span>
              {movie.popularity && (
                <span className="text-xs text-gray-500">
                  Popularity: {Math.round(movie.popularity)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// LoadingCard Component for skeleton loading
const LoadingCard = () => {
  return (
    <Card className="glass-card">
      <CardContent className="p-0">
        <div className="w-full h-64 bg-gray-700 animate-pulse rounded-t-lg"></div>
        <div className="p-4 space-y-3">
          <div className="h-6 bg-gray-700 animate-pulse rounded"></div>
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-gray-700 animate-pulse rounded"></div>
            <div className="h-4 w-16 bg-gray-700 animate-pulse rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 animate-pulse rounded"></div>
            <div className="h-3 bg-gray-700 animate-pulse rounded w-3/4"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Movies() {
  const { toast } = useToast();
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const fetchTrendingMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getTrendingMovies();
      setTrending(response.results || []);
    } catch (error) {
      console.error('Failed to fetch trending movies:', error);
      setError('Failed to load trending movies');
      toast({
        title: "Error",
        description: "Failed to load trending movies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchTrendingMovies();
  };

  if (error && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold cinema-text">Movies</h1>
          <div className="max-w-md mx-auto">
            <Card className="glass-card">
              <CardContent className="p-6 text-center space-y-4">
                <p className="text-gray-400">Failed to load movies</p>
                <button 
                  onClick={handleRetry}
                  className="px-4 py-2 bg-neon-blue hover:bg-neon-blue/80 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold cinema-text">Movies</h1>
        <p className="text-gray-300 text-lg">Discover and track your favorite movies</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-neon-blue" />
              <span>Trending Movies</span>
            </div>
            {!isLoading && trending.length > 0 && (
              <Badge variant="outline" className="text-neon-blue border-neon-blue">
                {trending.length} Movies
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <LoadingCard key={index} />
              ))}
            </div>
          ) : trending.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trending.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No trending movies available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
