
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon, Film, BookOpen, Star, Calendar, Plus } from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState([]);
  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('movies');

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      handleSearch(searchQuery);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const [movieResults, animeResults] = await Promise.all([
        api.searchMovies(searchQuery),
        api.searchAnime(searchQuery)
      ]);

      setMovies(movieResults.results || []);
      setAnime(animeResults.media || []);
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Failed to search content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      handleSearch(query.trim());
    }
  };

  const addToWatchlist = async (contentType: string, contentId: string) => {
    try {
      await api.addToWatchlist({ contentType, contentId });
      toast({
        title: "Added to watchlist",
        description: "Successfully added to your watchlist!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to watchlist",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold cinema-text">Search Movies & Anime</h1>
        <p className="text-gray-300">Discover your next favorite content</p>
      </div>

      {/* Search Form */}
      <Card className="glass-card max-w-2xl mx-auto">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search movies, anime..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-neon-blue/50"
              />
            </div>
            <Button type="submit" className="bg-neon-gradient hover:opacity-90">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {(movies.length > 0 || anime.length > 0) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/10 border border-white/20">
            <TabsTrigger value="movies" className="flex items-center space-x-2">
              <Film className="w-4 h-4" />
              <span>Movies ({movies.length})</span>
            </TabsTrigger>
            <TabsTrigger value="anime" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Anime ({anime.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie: any) => (
                <Card key={movie.id} className="glass-card hover-glow group cursor-pointer">
                  <CardContent className="p-0">
                    <div onClick={() => navigate(`/movie/${movie.id}`)}>
                      <img
                        src={movie.poster_path 
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                          : '/placeholder.svg'
                        }
                        alt={movie.title}
                        className="w-full h-64 object-cover rounded-t-lg"
                      />
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-white group-hover:text-neon-blue transition-colors line-clamp-2">
                          {movie.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                            </span>
                          </div>
                          {movie.vote_average > 0 && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-300">{movie.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <Button
                        onClick={() => addToWatchlist('movie', movie.id.toString())}
                        className="w-full bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/30"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Watchlist
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="anime" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {anime.map((animeItem: any) => (
                <Card key={animeItem.id} className="glass-card hover-glow group cursor-pointer">
                  <CardContent className="p-0">
                    <div onClick={() => navigate(`/anime/${animeItem.id}`)}>
                      <img
                        src={animeItem.coverImage?.medium || '/placeholder.svg'}
                        alt={animeItem.title.romaji || animeItem.title.english}
                        className="w-full h-64 object-cover rounded-t-lg"
                      />
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-white group-hover:text-neon-blue transition-colors line-clamp-2">
                          {animeItem.title.romaji || animeItem.title.english}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {animeItem.startDate?.year || 'N/A'}
                            </span>
                          </div>
                          {animeItem.averageScore && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-300">{animeItem.averageScore}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {animeItem.genres?.slice(0, 2).map((genre: string) => (
                            <Badge key={genre} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <Button
                        onClick={() => addToWatchlist('anime', animeItem.id.toString())}
                        className="w-full bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Watchlist
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Searching...</p>
        </div>
      )}

      {!isLoading && query && movies.length === 0 && anime.length === 0 && (
        <div className="text-center py-12">
          <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
