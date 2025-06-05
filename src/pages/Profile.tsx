import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Save, Eye, Clock, Star, Film, BookOpen, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [logs, setLogs] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [stats, setStats] = useState({
    watched: 0,
    watching: 0,
    planned: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const [logsResponse] = await Promise.all([
          api.getLogs(),
          // ... existing code ...
        ]);

        const logs = logsResponse.logs || [];
        setLogs(logs);

        // Calculate stats from logs
        const watchedCount = logs.filter((log: any) => log.status === 'watched').length;
        const watchingCount = logs.filter((log: any) => log.status === 'watching').length;
        const plannedCount = logs.filter((log: any) => log.status === 'planned').length;
        
        const ratedLogs = logs.filter((log: any) => log.rating);
        const averageRating = ratedLogs.length > 0 
          ? ratedLogs.reduce((sum: number, log: any) => sum + log.rating, 0) / ratedLogs.length
          : 0;

        setStats({
          watched: watchedCount,
          watching: watchingCount,
          planned: plannedCount,
          averageRating: parseFloat(averageRating.toFixed(1))
        });

        // Fetch watchlist
        const watchlistResponse = await api.getWatchlist();
        setWatchlist(watchlistResponse.watchlist || []);

      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSave = async () => {
    try {
      await api.updateProfile(editData);
      updateUser(editData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const deleteLog = async (logId: string) => {
    try {
      await api.deleteLog(logId);
      toast({
        title: "Success",
        description: "Log deleted successfully!",
      });
      fetchUserData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete log",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
      {/* Profile Header */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24 border-2 border-neon-blue/30">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-neon-gradient text-white text-2xl">
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Username"
                    value={editData.username}
                    onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Textarea
                    placeholder="Bio"
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Input
                    placeholder="Avatar URL"
                    value={editData.avatar}
                    onChange={(e) => setEditData(prev => ({ ...prev, avatar: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold cinema-text">{user?.username}</h1>
                  {user?.bio && (
                    <p className="text-gray-300 mt-2">{user.bio}</p>
                  )}
                  <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
                </div>
              )}
            </div>

            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="bg-neon-gradient hover:opacity-90"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Eye className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.watched}</p>
            <p className="text-sm text-gray-400">Watched</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.watching}</p>
            <p className="text-sm text-gray-400">Watching</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.planned}</p>
            <p className="text-sm text-gray-400">Planned</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.averageRating > 0 ? stats.averageRating : '--'}
            </p>
            <p className="text-sm text-gray-400">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Logs */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Your Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <Film className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No logs yet</p>
              <p className="text-sm text-gray-500">Start tracking movies and anime!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log: any) => (
                <div key={log._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">
                        {log.contentType === 'movie' ? '🎬' : '📺'} Content ID: {log.contentId}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            log.status === 'watched' ? 'bg-green-500/20 text-green-400' :
                            log.status === 'watching' ? 'bg-blue-500/20 text-blue-400' :
                            log.status === 'planned' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {log.status}
                        </Badge>
                        {log.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-300">{log.rating}/10</span>
                          </div>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(log.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {log.review && (
                        <p className="text-sm text-gray-300 mt-1 line-clamp-2">{log.review}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteLog(log._id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Watchlist Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookmarkCheck className="w-5 h-5 text-neon-blue" />
            <span>Watchlist</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {watchlist.length === 0 ? (
            <div className="text-center py-8">
              <BookmarkCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Your watchlist is empty</p>
              <p className="text-sm text-gray-500">Add some movies, TV shows, or anime to watch later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {watchlist.map((item: any) => (
                <Link
                  key={item._id}
                  to={`/${item.contentType}/${item.contentId}`}
                  className="group"
                >
                  <Card className="glass-card hover-glow">
                    <CardContent className="p-0">
                      {item.contentDetails?.poster ? (
                        <img
                          src={item.contentDetails.poster}
                          alt={item.contentDetails.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-800 rounded-t-lg flex items-center justify-center">
                          <BookmarkCheck className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                      <div className="p-4 space-y-2">
                        <h3 className="font-medium text-white group-hover:text-neon-blue transition-colors line-clamp-2">
                          {item.contentDetails?.title || `${item.contentType} #${item.contentId}`}
                        </h3>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">
                            {item.contentDetails?.year || 'N/A'}
                          </span>
                          <Badge variant="secondary" className={`
                            ${item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'}
                          `}>
                            {item.priority}
                          </Badge>
                        </div>
                        {item.contentDetails?.genres && (
                          <div className="flex flex-wrap gap-1">
                            {item.contentDetails.genres.slice(0, 2).map((genre: any) => (
                              <Badge 
                                key={genre.id || genre} 
                                variant="outline" 
                                className="text-xs"
                              >
                                {genre.name || genre}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
