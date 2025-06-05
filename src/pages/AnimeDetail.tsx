
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Calendar, ArrowLeft, Play, BookmarkPlus } from 'lucide-react';
import StreamingModal from '@/components/StreamingModal';

export default function AnimeDetail() {
  const { animeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anime, setAnime] = useState<any>(null);
  const [userLog, setUserLog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState('');
  const [showStreaming, setShowStreaming] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  useEffect(() => {
    fetchAnimeData();
  }, [animeId]);

  const fetchAnimeData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching anime data for ID:', animeId);
      
      // Fetch anime data first
      const animeData = await api.getAnime(animeId!);
      console.log('Anime data received:', animeData);
      setAnime(animeData);

      // Try to fetch log data, but don't fail if it doesn't exist
      try {
        const logData = await api.getLog('anime', animeId!);
        console.log('Anime log data received:', logData);
        if (logData.log) {
          setUserLog(logData.log);
          setStatus(logData.log.status);
          setRating(logData.log.rating);
          setReview(logData.log.review || '');
        }
      } catch (logError: any) {
        console.log('No user log found for this anime (this is normal for new anime)');
        // Don't show error for missing logs, this is expected
      }

    } catch (error: any) {
      console.error('Failed to fetch anime details:', error);
      toast({
        title: "Error",
        description: "Failed to load anime details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogSubmit = async () => {
    try {
      await api.createLog({
        contentType: 'anime',
        contentId: animeId,
        status,
        rating,
        review
      });

      toast({
        title: "Success",
        description: "Anime logged successfully!",
      });

      fetchAnimeData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log anime",
        variant: "destructive",
      });
    }
  };

  const addToWatchlist = async () => {
    try {
      await api.addToWatchlist({ contentType: 'anime', contentId: animeId });
      toast({
        title: "Added to watchlist",
        description: "Anime added to your watchlist!",
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
      url: `https://vidsrc.cc/v2/embed/anime/ani${animeId}/${selectedEpisode}/sub`
    },
    {
      name: "Server 2",
      url: `https://embed.su/embed/anilist/${animeId}/${selectedEpisode}?color=ffffff`
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading anime details...</p>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Anime not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Backdrop */}
        {anime.bannerImage && (
          <div
            className="fixed inset-0 -z-10"
            style={{
              backgroundImage: `url(${anime.bannerImage})`,
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
                    src={anime.coverImage?.large || anime.coverImage?.medium || '/placeholder.svg'}
                    alt={anime.title?.english || anime.title?.romaji}
                    className="w-full rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold cinema-text mb-4">
                  {anime.title?.english || anime.title?.romaji}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">
                      {anime.startDate?.year || 'N/A'}
                    </span>
                  </div>
                  {anime.episodes && (
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-300">{anime.episodes} Episodes</span>
                    </div>
                  )}
                  {anime.averageScore && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-300">{(anime.averageScore / 10).toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {anime.genres && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {anime.genres.map((genre: string) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}

                {anime.description && (
                  <div 
                    className="text-gray-300 text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: anime.description }}
                  />
                )}
              </div>

              {/* Episode Selection */}
              {anime.episodes && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Select Episode</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedEpisode.toString()} onValueChange={(value) => setSelectedEpisode(parseInt(value))}>
                      <SelectTrigger className="bg-white/10 border-white/20">
                        <SelectValue placeholder="Select episode" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(anime.episodes)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Episode {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => setShowStreaming(true)} 
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Episode {selectedEpisode}
                </Button>
                <Button onClick={addToWatchlist} className="bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/30">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Add to Watchlist
                </Button>
              </div>

              {/* Log Anime */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Log This Anime</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="bg-white/10 border-white/20">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="watching">Watching</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="dropped">Dropped</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
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
                    {userLog ? 'Update Log' : 'Log Anime'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <StreamingModal
        isOpen={showStreaming}
        onClose={() => setShowStreaming(false)}
        title={`${anime.title?.english || anime.title?.romaji} - Episode ${selectedEpisode}`}
        servers={getStreamingServers()}
      />
    </>
  );
}
