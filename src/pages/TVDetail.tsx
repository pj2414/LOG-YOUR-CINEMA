import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Calendar, Clock, Users, Play, Plus, Eye, EyeOff, Heart, BookOpen } from 'lucide-react';
import { TVSeries, Log } from '@/types';
import StreamingModal from '@/components/StreamingModal';

export default function TVDetail() {
  const { tvId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tv, setTV] = useState<TVSeries | null>(null);
  const [userLog, setUserLog] = useState<Log | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingLoading, setIsLoggingLoading] = useState(false);
  const [showStreaming, setShowStreaming] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  useEffect(() => {
    if (tvId) {
      fetchTVDetails();
      fetchUserLog();
    }
  }, [tvId]);

  const fetchTVDetails = async () => {
    try {
      const data = await api.getTV(tvId!);
      setTV(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load TV series details",
        variant: "destructive",
      });
      navigate('/tv');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserLog = async () => {
    try {
      const log = await api.getLog('tv', tvId!);
      setUserLog(log);
    } catch (error) {
      // User hasn't logged this TV series yet
      setUserLog(null);
    }
  };

  const handleAddToList = async (status: string) => {
    setIsLoggingLoading(true);
    try {
      const logData = {
        contentType: 'tv',
        contentId: tvId,
        status,
        currentSeason: 1,
        currentEpisode: 1,
        totalEpisodes: tv?.number_of_episodes || 0
      };

      if (userLog) {
        // Update existing log
        await api.createLog({ ...logData, _id: userLog._id });
      } else {
        // Create new log
        await api.createLog(logData);
      }

      await fetchUserLog();
      toast({
        title: "Success",
        description: `Added to ${status} list!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update list",
        variant: "destructive",
      });
    } finally {
      setIsLoggingLoading(false);
    }
  };

  const addToWatchlist = async () => {
    try {
      await api.addToWatchlist({ contentType: 'tv', contentId: tvId });
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

  const getStreamingServers = () => [
    {
      name: "Server 1",
      url: `https://vidlink.pro/tv/${tvId}/${selectedSeason}/${selectedEpisode}?icons=vid&nextbutton=true`
    },
    {
      name: "Server 2",
      url: `https://vidsrc.xyz/embed/tv?tmdb=${tvId}&season=${selectedSeason}&episode=${selectedEpisode}`
    }
  ];

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

  if (!tv) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">TV series not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div 
          className="relative h-[70vh] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${tv.backdrop_path})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row gap-8 items-end">
                <img
                  src={tv.poster_path || '/placeholder.svg'}
                  alt={tv.name}
                  className="w-64 h-96 object-cover rounded-lg shadow-2xl"
                />
                <div className="flex-1 space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold text-white">{tv.name}</h1>
                  {tv.original_name && tv.original_name !== tv.name && (
                    <p className="text-xl text-gray-300">{tv.original_name}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>{tv.number_of_seasons} Season{tv.number_of_seasons !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{tv.number_of_episodes} Episodes</span>
                    </div>
                    {tv.vote_average && tv.vote_average > 0 && (
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{tv.vote_average.toFixed(1)}/10</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tv.genres?.map((genre) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-gray-300 max-w-3xl">{tv.overview}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="container mx-auto px-8 py-8">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setShowStreaming(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Now
            </Button>
            <Button
              onClick={() => handleAddToList('watching')}
              disabled={isLoggingLoading}
              className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30"
            >
              <Eye className="w-4 h-4 mr-2" />
              {userLog?.status === 'watching' ? 'Currently Watching' : 'Mark as Watching'}
            </Button>
            <Button
              onClick={() => handleAddToList('watched')}
              disabled={isLoggingLoading}
              className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30"
            >
              <EyeOff className="w-4 h-4 mr-2" />
              {userLog?.status === 'watched' ? 'Watched' : 'Mark as Watched'}
            </Button>
            <Button
              onClick={() => handleAddToList('planned')}
              disabled={isLoggingLoading}
              className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {userLog?.status === 'planned' ? 'Planned' : 'Plan to Watch'}
            </Button>
            <Button
              onClick={addToWatchlist}
              className="bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Watchlist
            </Button>
          </div>

          {/* Episode Selection */}
          <div className="mt-4 flex gap-4">
            <Select value={selectedSeason.toString()} onValueChange={(value) => setSelectedSeason(parseInt(value))}>
              <SelectTrigger className="w-40 bg-white/10 border-white/20">
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: tv.number_of_seasons || 1 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Season {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedEpisode.toString()} onValueChange={(value) => setSelectedEpisode(parseInt(value))}>
              <SelectTrigger className="w-40 bg-white/10 border-white/20">
                <SelectValue placeholder="Episode" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 20 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Episode {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {userLog && (
            <div className="mt-4 p-4 glass-card rounded-lg">
              <p className="text-gray-300">
                Status: <span className="text-neon-blue capitalize">{userLog.status}</span>
                {userLog.currentSeason && userLog.currentEpisode && (
                  <span className="ml-4">
                    Progress: Season {userLog.currentSeason}, Episode {userLog.currentEpisode}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Details Tabs */}
        <div className="container mx-auto px-8 pb-8">
          <Tabs defaultValue="seasons" className="space-y-6">
            <TabsList className="bg-white/10 border border-white/20">
              <TabsTrigger value="seasons">Seasons & Episodes</TabsTrigger>
              <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
            </TabsList>

            <TabsContent value="seasons" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Seasons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tv.seasons?.map((season) => (
                      <Card key={season.id} className="glass-card">
                        <CardContent className="p-4">
                          <div className="flex space-x-4">
                            <img
                              src={season.poster_path 
                                ? `https://image.tmdb.org/t/p/w200${season.poster_path}` 
                                : '/placeholder.svg'
                              }
                              alt={season.name}
                              className="w-16 h-24 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{season.name}</h3>
                              <p className="text-sm text-gray-400">{season.episode_count} episodes</p>
                              {season.air_date && (
                                <p className="text-sm text-gray-400">
                                  {new Date(season.air_date).getFullYear()}
                                </p>
                              )}
                            </div>
                          </div>
                          {season.overview && (
                            <p className="text-xs text-gray-400 mt-2 line-clamp-3">{season.overview}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cast" className="space-y-4">
              {tv.credits?.cast && tv.credits.cast.length > 0 && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Cast</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {tv.credits.cast.slice(0, 12).map((actor) => (
                        <div key={actor.id} className="text-center space-y-2">
                          <img
                            src={actor.profile_path 
                              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` 
                              : '/placeholder.svg'
                            }
                            alt={actor.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-white text-sm">{actor.name}</p>
                            <p className="text-xs text-gray-400">{actor.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <StreamingModal
        isOpen={showStreaming}
        onClose={() => setShowStreaming(false)}
        title={`${tv?.name} - S${selectedSeason}E${selectedEpisode}`}
        servers={getStreamingServers()}
      />
    </>
  );
}
