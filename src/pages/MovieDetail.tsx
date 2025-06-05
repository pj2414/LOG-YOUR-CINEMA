
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Calendar, Clock, ArrowLeft, Play, Heart, BookmarkPlus } from 'lucide-react';
import StreamingModal from '@/components/StreamingModal';

export default function MovieDetail() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [movie, setMovie] = useState<any>(null);
  const [userLog, setUserLog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState('');
  const [showStreaming, setShowStreaming] = useState(false);

  useEffect(() => {
    fetchMovieData();
  }, [movieId]);

  const fetchMovieData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching movie data for ID:', movieId);
      
      // Fetch movie data first
      const movieData = await api.getMovie(movieId!);
      console.log('Movie data received:', movieData);
      setMovie(movieData);

      // Try to fetch log data, but don't fail if it doesn't exist
      try {
        const logData = await api.getLog('movie', movieId!);
        console.log('Log data received:', logData);
        if (logData.log) {
          setUserLog(logData.log);
          setStatus(logData.log.status);
          setRating(logData.log.rating);
          setReview(logData.log.review || '');
        }
      } catch (logError: any) {
        console.log('No user log found for this movie (this is normal for new movies)');
        // Don't show error for missing logs, this is expected
      }

    } catch (error: any) {
      console.error('Failed to fetch movie details:', error);
      toast({
        title: "Error",
        description: "Failed to load movie details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogSubmit = async () => {
    try {
      await api.createLog({
        contentType: 'movie',
        contentId: movieId,
        status,
        rating,
        review
      });

      toast({
        title: "Success",
        description: "Movie logged successfully!",
      });

      fetchMovieData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log movie",
        variant: "destructive",
      });
    }
  };

  const addToWatchlist = async () => {
    try {
      await api.addToWatchlist({ contentType: 'movie', contentId: movieId });
      toast({
        title: "Added to watchlist",
        description: "Movie added to your watchlist!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to watchlist",
        variant: "destructive",
      });
    }
  };

  const getStreamingServers = () => [
    {
      name: "Server 1",
      url: `https://vidlink.pro/movie/${movieId}?icons=vid`
    },
    {
      name: "Server 2", 
      url: `https://multiembed.mov/?video_id=${movieId}&tmdb=1`
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Movie not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Backdrop */}
        {movie.backdrop_path && (
          <div
            className="fixed inset-0 -z-10"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/80" />
          </div>
        )}

        <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-4 text-white hover:text-neon-blue"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              <Card className="glass-card">
                <CardContent className="p-0">
                  <img
                    src={movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                      : '/placeholder.svg'
                    }
                    alt={movie.title}
                    className="w-full rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold cinema-text mb-4">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                    </span>
                  </div>
                  {movie.runtime && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{movie.runtime} min</span>
                    </div>
                  )}
                  {movie.vote_average > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-300">{movie.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {movie.genres && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genres.map((genre: any) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {movie.overview && (
                  <p className="text-gray-300 text-lg leading-relaxed">{movie.overview}</p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => setShowStreaming(true)} 
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Now
                </Button>
                <Button onClick={addToWatchlist} className="bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/30">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Add to Watchlist
                </Button>
              </div>

              {/* Log Movie */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Log This Movie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="bg-white/10 border-white/20">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="watched">Watched</SelectItem>
                      <SelectItem value="watching">Watching</SelectItem>
                      <SelectItem value="planned">Plan to Watch</SelectItem>
                      <SelectItem value="dropped">Dropped</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={rating?.toString() || ''} onValueChange={(value) => setRating(value ? parseInt(value) : null)}>
                    <SelectTrigger className="bg-white/10 border-white/20">
                      <SelectValue placeholder="Rate (1-10)" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1} Star{i + 1 !== 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Textarea
                    placeholder="Write a review..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />

                  <Button 
                    onClick={handleLogSubmit}
                    disabled={!status}
                    className="w-full bg-neon-gradient hover:opacity-90"
                  >
                    {userLog ? 'Update Log' : 'Log Movie'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Cast */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Cast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {movie.credits.cast.slice(0, 12).map((actor: any) => (
                    <div key={actor.id} className="text-center">
                      <img
                        src={actor.profile_path 
                          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` 
                          : '/placeholder.svg'
                        }
                        alt={actor.name}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm font-medium text-white">{actor.name}</p>
                      <p className="text-xs text-gray-400">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <StreamingModal
        isOpen={showStreaming}
        onClose={() => setShowStreaming(false)}
        title={movie?.title || 'Movie'}
        servers={getStreamingServers()}
      />
    </>
  );
}
