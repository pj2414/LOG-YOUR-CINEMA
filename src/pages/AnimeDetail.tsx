import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Calendar, Clock, ArrowLeft, BookmarkPlus, Play } from 'lucide-react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Episode {
  number: number;
  title?: string;
  synopsis?: string;
}

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
  const [isWatchOpen, setIsWatchOpen] = useState(false);
  const [episode, setEpisode] = useState(1);
  const [currentServer, setCurrentServer] = useState<'server1' | 'server2'>('server1');
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    fetchAnimeData();
  }, [animeId]);

  const fetchAnimeData = async () => {
    try {
      setIsLoading(true);
      const [animeData, logData] = await Promise.all([
        api.getAnime(animeId!),
        api.getLog('anime', animeId!)
      ]);

      setAnime(animeData);
      if (logData.log) {
        setUserLog(logData.log);
        setStatus(logData.log.status);
        setRating(logData.log.rating);
        setReview(logData.log.review || '');
      }
    } catch (error: any) {
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

  // Update the getWatchUrl function
  const getWatchUrl = (episodeNumber: number, server: 'server1' | 'server2') => {
    if (server === 'server1') {
      // Using the Anilist ID directly since it's already in the correct format
      return `https://vidsrc.cc/v2/embed/anime/ani${anime.id}/${episodeNumber}/sub`;
    }
    return `https://embed.su/embed/anilist/${anime.id}/${episodeNumber}?color=ffffff`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
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
    <div className="min-h-screen">
      {/* Banner */}
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
          className="mb-4 text-white hover:text-neon-purple"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cover */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardContent className="p-0">
                <img
                  src={anime.coverImage?.large || '/placeholder.svg'}
                  alt={anime.title.romaji || anime.title.english}
                  className="w-full rounded-lg"
                />
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold cinema-text mb-4">
                {anime.title.romaji || anime.title.english}
              </h1>
              {anime.title.english && anime.title.romaji !== anime.title.english && (
                <p className="text-xl text-gray-300 mb-4">{anime.title.english}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {anime.startDate?.year && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{anime.startDate.year}</span>
                  </div>
                )}
                {anime.episodes && (
                  <div className="flex items-center space-x-1">
                    <Play className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{anime.episodes} episodes</span>
                  </div>
                )}
                {anime.duration && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{anime.duration} min</span>
                  </div>
                )}
                {anime.averageScore && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-gray-300">{anime.averageScore}%</span>
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
                  dangerouslySetInnerHTML={{ __html: anime.description.replace(/<br\s*\/?>/gi, '<br />') }}
                />
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={addToWatchlist} 
                className="bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30"
              >
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
                    <SelectItem value="watched">Completed</SelectItem>
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
                  {userLog ? 'Update Log' : 'Log Anime'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Studios */}
        {anime.studios?.nodes && anime.studios.nodes.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Studios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {anime.studios.nodes.map((studio: any, index: number) => (
                  <Badge key={index} variant="outline">
                    {studio.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Episodes List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Episodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {Array.from({ length: anime.episodes || 0 }, (_, i) => i + 1).map((episodeNum) => (
                <AccordionItem
                  key={episodeNum}
                  value={`episode-${episodeNum}`}
                  className="bg-white/5 rounded-lg border border-white/10"
                >
                  <AccordionTrigger className="px-4 py-2 hover:bg-white/5 rounded-lg [&[data-state=open]>svg]:rotate-180">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="w-12">
                        EP {episodeNum}
                      </Badge>
                      <span className="text-left">Episode {episodeNum}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3 pt-1">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setEpisode(episodeNum);
                            setCurrentServer('server1');
                            setIsWatchOpen(true);
                          }}
                          className="bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch on Server 1
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setEpisode(episodeNum);
                            setCurrentServer('server2');
                            setIsWatchOpen(true);
                          }}
                          className="bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink/30"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch on Server 2
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Watch Video */}
        <VideoPlayer
          open={isWatchOpen}
          onClose={() => setIsWatchOpen(false)}
          videoUrl={getWatchUrl(episode, currentServer)}
        />
      </div>
    </div>
  );
}
