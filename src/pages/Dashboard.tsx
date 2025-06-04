
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  Clock, 
  Star, 
  TrendingUp, 
  Users, 
  Film, 
  BookOpen,
  Activity,
  Calendar,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  watched: number;
  watching: number;
  planned: number;
  averageRating: number;
}

interface ActivityItem {
  _id: string;
  userId: {
    username: string;
    avatar?: string;
  };
  type: string;
  description: string;
  createdAt: string;
  contentDetails?: {
    title: string;
    poster?: string;
    year?: number;
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    watched: 0,
    watching: 0,
    planned: 0,
    averageRating: 0
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [friendsWatching, setFriendsWatching] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch user logs for stats
      const logsResponse = await api.getLogs();
      const logs = logsResponse.logs || [];
      
      // Calculate stats
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

      // Fetch recent activity
      const activityResponse = await api.getFeed(1, 10);
      setRecentActivity(activityResponse.activities || []);

      // Fetch trending content
      const trendingMovies = await api.getTrendingMovies();
      setTrending(trendingMovies.results?.slice(0, 6) || []);

      // Fetch what friends are watching
      const friendsResponse = await api.getFriendsWatching();
      setFriendsWatching(friendsResponse.friendsWatching?.slice(0, 4) || []);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-white/20 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold cinema-text">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-300 text-lg">
          Ready to log some cinema? Here's what's happening in your world.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <Eye className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Watched</p>
                <p className="text-2xl font-bold text-white">{stats.watched}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <Play className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Watching</p>
                <p className="text-2xl font-bold text-white">{stats.watching}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Planned</p>
                <p className="text-2xl font-bold text-white">{stats.planned}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg Rating</p>
                <p className="text-2xl font-bold text-white">
                  {stats.averageRating > 0 ? stats.averageRating : '--'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="bg-white/10 border border-white/20">
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Recent Activity</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Trending</span>
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Friends</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-neon-blue" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No recent activity. Start logging some movies or anime!
                </p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity._id} className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white">
                        <span className="font-medium text-neon-blue">
                          {activity.userId.username}
                        </span>{' '}
                        {activity.description}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                    {activity.contentDetails && (
                      <div className="flex-shrink-0">
                        <Badge variant="secondary" className="bg-white/10 text-white">
                          {activity.contentDetails.title}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-neon-purple" />
                  <span>Trending Movies</span>
                </div>
                <Link to="/movies">
                  <Button variant="ghost" size="sm" className="text-neon-blue hover:text-neon-purple">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {trending.map((movie) => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="group cursor-pointer"
                  >
                    <div className="content-card">
                      <img
                        src={movie.poster_path 
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` 
                          : '/placeholder.svg'
                        }
                        alt={movie.title}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <h3 className="text-sm font-medium text-white group-hover:text-neon-blue transition-colors line-clamp-2">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-neon-green" />
                <span>What Friends Are Watching</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {friendsWatching.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Follow some friends to see what they're watching!
                  </p>
                  <Link to="/social">
                    <Button className="mt-4 bg-neon-gradient hover:opacity-90">
                      Find Friends
                    </Button>
                  </Link>
                </div>
              ) : (
                friendsWatching.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <img
                      src={item.contentDetails?.poster || '/placeholder.svg'}
                      alt={item.contentDetails?.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {item.contentDetails?.title}
                      </p>
                      <p className="text-sm text-gray-400">
                        Watched by <span className="text-neon-blue">{item.userId.username}</span>
                      </p>
                      {item.rating && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-300">{item.rating}/10</span>
                        </div>
                      )}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        item.status === 'watching' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'watched' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/search">
              <Button className="w-full bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/30">
                <Film className="w-4 h-4 mr-2" />
                Add Movie
              </Button>
            </Link>
            <Link to="/search">
              <Button className="w-full bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30">
                <BookOpen className="w-4 h-4 mr-2" />
                Add Anime
              </Button>
            </Link>
            <Link to="/diary">
              <Button className="w-full bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green/30">
                <Calendar className="w-4 h-4 mr-2" />
                Diary Entry
              </Button>
            </Link>
            <Link to="/social">
              <Button className="w-full bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink/30">
                <Users className="w-4 h-4 mr-2" />
                Find Friends
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
