
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, TrendingUp } from 'lucide-react';

export default function Anime() {
  const { toast } = useToast();
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrendingAnime();
  }, []);

  const fetchTrendingAnime = async () => {
    try {
      const response = await api.getTrendingAnime();
      setTrending(response.media || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load trending anime",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading anime...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold cinema-text">Anime</h1>
        <p className="text-gray-300 text-lg">Discover and track your favorite anime</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-neon-purple" />
            <span>Trending Anime</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trending.map((anime: any) => (
              <Link key={anime.id} to={`/anime/${anime.id}`} className="group">
                <Card className="glass-card hover-glow">
                  <CardContent className="p-0">
                    <img
                      src={anime.coverImage?.medium || '/placeholder.svg'}
                      alt={anime.title.romaji || anime.title.english}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-white group-hover:text-neon-purple transition-colors line-clamp-2">
                        {anime.title.romaji || anime.title.english}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">
                            {anime.startDate?.year || 'N/A'}
                          </span>
                        </div>
                        {anime.averageScore && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-300">{anime.averageScore}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {anime.genres?.slice(0, 2).map((genre: string) => (
                          <Badge key={genre} variant="secondary" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
