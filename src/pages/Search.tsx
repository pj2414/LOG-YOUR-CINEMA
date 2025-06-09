import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import MovieCard from '@/components/MovieCard';
import TVCard from '@/components/TVCard';
import AnimeCard from '@/components/AnimeCard';

// Suggestion Dropdown Component
const SuggestionDropdown = ({ movies, tv, anime, onSelect, isVisible }) => {
  if (!isVisible) return null;

  const allSuggestions = [
    ...movies.slice(0, 3).map(item => ({ ...item, type: 'movie', displayName: item.title })),
    ...tv.slice(0, 3).map(item => ({ ...item, type: 'tv', displayName: item.name })),
    ...anime.slice(0, 3).map(item => ({ ...item, type: 'anime', displayName: item.title?.romaji || item.title?.english }))
  ];

  if (allSuggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-gray-900 border border-white/20 rounded-lg mt-1 max-h-60 overflow-y-auto z-50 shadow-xl">
      {allSuggestions.map((item, index) => (
        <div
          key={`${item.type}-${item.id}`}
          className="flex items-center p-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
          onClick={() => onSelect(item)}
        >
          <img
            src={
              item.type === 'anime' 
                ? item.coverImage?.small || '/placeholder.svg'
                : item.poster_path 
                  ? `https://image.tmdb.org/t/p/w92${item.poster_path}` 
                  : '/placeholder.svg'
            }
            alt={item.displayName}
            className="w-12 h-16 object-cover rounded mr-3"
            onError={(e) => {
              e.target.src = '/placeholder.svg';
            }}
          />
          <div className="flex-1">
            <div className="text-white font-medium line-clamp-1">{item.displayName}</div>
            <div className="text-gray-400 text-sm capitalize">{item.type}</div>
            {item.release_date && (
              <div className="text-gray-500 text-xs">
                {new Date(item.release_date).getFullYear()}
              </div>
            )}
            {item.first_air_date && (
              <div className="text-gray-500 text-xs">
                {new Date(item.first_air_date).getFullYear()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState([]);
  const [tv, setTV] = useState([]);
  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('movies');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search effect for real-time suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim() && query.length > 2) {
        handleSearch(query.trim(), true); // true indicates it's for suggestions
        setShowSuggestions(true);
      } else {
        if (!hasSearched) {
          setMovies([]);
          setTV([]);
          setAnime([]);
        }
        setShowSuggestions(false);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Initialize search from URL params on component mount
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery && urlQuery.trim()) {
      setQuery(urlQuery);
      handleSearch(urlQuery.trim(), false);
      setHasSearched(true);
    }
  }, []);

  // Handle search functionality
  const handleSearch = async (searchQuery, isForSuggestions = false) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setTV([]);
      setAnime([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const [movieResults, tvResults, animeResults] = await Promise.all([
        api.searchMovies(searchQuery),
        api.searchTV(searchQuery),
        api.searchAnime(searchQuery)
      ]);

      setMovies(movieResults.results || []);
      setTV(tvResults.results || []);
      setAnime(animeResults.media || []);

      if (!isForSuggestions) {
        setHasSearched(true);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Failed to search content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Update URL params without triggering navigation
    if (value.trim()) {
      setSearchParams({ q: value.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setShowSuggestions(false);
      handleSearch(query.trim(), false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (item) => {
    setShowSuggestions(false);
    setQuery('');
    setSearchParams({}, { replace: true });
    navigate(`/${item.type}/${item.id}`);
  };

  // Handle manual search button click
  const handleSearchClick = () => {
    setShowSuggestions(false);
    handleSearch(query.trim(), false);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (query.length > 2 && (movies.length > 0 || tv.length > 0 || anime.length > 0)) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Search Entertainment
          </h1>
          <p className="text-gray-400 text-lg">
            Discover movies, TV series, and anime all in one place
          </p>
        </div>

        {/* Search Form */}
        <Card className="glass-card max-w-2xl mx-auto mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <div className="relative flex space-x-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search movies, TV series, anime..."
                    value={query}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  onClick={handleSearchClick}
                  disabled={isLoading || !query.trim()}
                  className="bg-neon-gradient hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
              
              {/* Suggestions Dropdown */}
              <SuggestionDropdown
                movies={movies}
                tv={tv}
                anime={anime}
                isVisible={showSuggestions && query.length > 2 && (movies.length > 0 || tv.length > 0 || anime.length > 0)}
                onSelect={handleSuggestionSelect}
              />
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 mb-6">
                <TabsTrigger 
                  value="movies" 
                  className="data-[state=active]:bg-neon-blue data-[state=active]:text-white"
                >
                  Movies ({movies.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="tv" 
                  className="data-[state=active]:bg-neon-blue data-[state=active]:text-white"
                >
                  TV Series ({tv.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="anime" 
                  className="data-[state=active]:bg-neon-blue data-[state=active]:text-white"
                >
                  Anime ({anime.length})
                </TabsTrigger>
              </TabsList>

              {/* Movies Tab */}
              <TabsContent value="movies" className="space-y-4">
                {movies.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                ) : hasSearched && !isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No movies found for "{query}"</p>
                  </div>
                ) : null}
              </TabsContent>

              {/* TV Series Tab */}
              <TabsContent value="tv" className="space-y-4">
                {tv.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {tv.map((show) => (
                      <TVCard key={show.id} show={show} />
                    ))}
                  </div>
                ) : hasSearched && !isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No TV series found for "{query}"</p>
                  </div>
                ) : null}
              </TabsContent>

              {/* Anime Tab */}
              <TabsContent value="anime" className="space-y-4">
                {anime.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {anime.map((animeItem) => (
                      <AnimeCard key={animeItem.id} anime={animeItem} />
                    ))}
                  </div>
                ) : hasSearched && !isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No anime found for "{query}"</p>
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
                <p className="text-gray-400">Searching...</p>
              </div>
            )}
          </div>
        )}

        {/* Welcome Message */}
        {!hasSearched && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Start typing to search for movies, TV series, and anime
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
