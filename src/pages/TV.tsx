
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, TrendingUp, Tv } from 'lucide-react';

export default function TV() {
  const { toast } = useToast();
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTVData();
  }, []);

  const fetchTVData = async () => {
    try {
      const [trendingResponse, popularResponse, topRatedResponse] = await Promise.all([
        api.getTrendingTV(),
        api.getPopularTV(),
        api.getTopRatedTV()
      ]);
      
      setTrending(trendingResponse.results || []);
      setPopular(popularResponse.results || []);
      setTopRated(topRatedResponse.results || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load TV series data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const TVGrid = ({ shows, title, icon }: { shows: any[], title: string, icon: React.ReactNode }) => (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shows.slice(0, 8).map((show: any) => (
            <Link key={show.id} to={`/tv/${show.id}`} className="group">
              <Card className="glass-card hover-glow">
                <CardContent className="p-0">
                  <img
                    src={show.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${show.poster_path}` 
                      : '/placeholder.svg'
                    }
                    alt={show.name}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-white group-hover:text-neon-blue transition-colors line-clamp-2">
                      {show.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A'}
                        </span>
                      </div>
                      {show.vote_average > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-300">{show.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {show.genres?.slice(0, 2).map((genre: any) => (
                        <Badge key={genre.id} variant="secondary" className="text-xs">
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-3">{show.overview}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading TV series...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold cinema-text">TV Series</h1>
        <p className="text-gray-300 text-lg">Discover and track your favorite TV shows</p>
      </div>

      <div className="space-y-8">
        <TVGrid 
          shows={trending} 
          title="Trending TV Series" 
          icon={<TrendingUp className="w-5 h-5 text-neon-blue" />} 
        />
        <TVGrid 
          shows={popular} 
          title="Popular TV Series" 
          icon={<Tv className="w-5 h-5 text-green-400" />} 
        />
        <TVGrid 
          shows={topRated} 
          title="Top Rated TV Series" 
          icon={<Star className="w-5 h-5 text-yellow-400" />} 
        />
      </div>
    </div>
  );
}
