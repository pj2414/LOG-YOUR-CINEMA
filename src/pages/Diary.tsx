
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Star, BookOpen, Plus, Trash2, Tv } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Diary() {
  const { toast } = useToast();
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    contentType: 'movie',
    contentId: '',
    notes: '',
    watchedDate: new Date().toISOString().split('T')[0],
    rating: '',
    season: '',
    episode: ''
  });

  useEffect(() => {
    fetchDiaryEntries();
  }, []);

  const fetchDiaryEntries = async () => {
    try {
      const response = await api.getDiaryEntries();
      setDiaryEntries(response.diaryEntries || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load diary entries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDiaryEntry = async () => {
    try {
      const entryData = {
        ...newEntry,
        rating: newEntry.rating ? parseInt(newEntry.rating) : undefined,
        season: newEntry.season ? parseInt(newEntry.season) : undefined,
        episode: newEntry.episode ? parseInt(newEntry.episode) : undefined
      };

      await api.createDiaryEntry(entryData);
      toast({
        title: "Success",
        description: "Diary entry created successfully!",
      });
      setIsCreateDialogOpen(false);
      setNewEntry({
        contentType: 'movie',
        contentId: '',
        notes: '',
        watchedDate: new Date().toISOString().split('T')[0],
        rating: '',
        season: '',
        episode: ''
      });
      fetchDiaryEntries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create diary entry",
        variant: "destructive",
      });
    }
  };

  const deleteDiaryEntry = async (diaryId: string) => {
    try {
      await api.deleteDiaryEntry(diaryId);
      toast({
        title: "Success",
        description: "Diary entry deleted successfully!",
      });
      fetchDiaryEntries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete diary entry",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'movie':
        return '🎬 Movie';
      case 'tv':
        return '📺 TV Series';
      case 'anime':
        return '🎌 Anime';
      default:
        return '📽️ Content';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading diary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold cinema-text">My Diary</h1>
          <p className="text-gray-300 text-lg">Track what you've watched</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-neon-gradient hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create Diary Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Content Type</label>
                <select
                  value={newEntry.contentType}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, contentType: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                >
                  <option value="movie">Movie</option>
                  <option value="tv">TV Series</option>
                  <option value="anime">Anime</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Content ID</label>
                <Input
                  placeholder="Enter TMDB or AniList ID"
                  value={newEntry.contentId}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, contentId: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              
              {newEntry.contentType === 'tv' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Season</label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Season number"
                      value={newEntry.season}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, season: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Episode</label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Episode number"
                      value={newEntry.episode}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, episode: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Watched Date</label>
                <Input
                  type="date"
                  value={newEntry.watchedDate}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, watchedDate: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Rating (1-10)</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Optional rating"
                  value={newEntry.rating}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, rating: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                <Textarea
                  placeholder="Your thoughts about this content..."
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <Button 
                onClick={createDiaryEntry}
                className="w-full bg-neon-gradient hover:opacity-90"
                disabled={!newEntry.contentId || !newEntry.watchedDate}
              >
                Create Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {diaryEntries.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No diary entries yet</p>
            <p className="text-sm text-gray-500">Start documenting your cinema journey!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {diaryEntries.map((entry: any) => (
            <Card key={entry._id} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {getContentTypeIcon(entry.contentType)}
                      </Badge>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(entry.watchedDate)}</span>
                      </div>
                      {entry.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-300">{entry.rating}/10</span>
                        </div>
                      )}
                    </div>
                    <p className="text-white font-medium mb-2">
                      Content ID: {entry.contentId}
                      {entry.season && entry.episode && (
                        <span className="text-gray-400 ml-2">
                          (S{entry.season}E{entry.episode})
                        </span>
                      )}
                    </p>
                    {entry.notes && (
                      <p className="text-gray-300">{entry.notes}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => deleteDiaryEntry(entry._id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
