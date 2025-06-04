
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, Activity, UserPlus, Star } from 'lucide-react';

export default function Social() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendsActivity, setFriendsActivity] = useState([]);
  const [friendsWatching, setFriendsWatching] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const fetchFriendsData = async () => {
    try {
      const [activityResponse, watchingResponse] = await Promise.all([
        api.getFriendsRecent(),
        api.getFriendsWatching()
      ]);

      setFriendsActivity(activityResponse.friendsRecent || []);
      setFriendsWatching(watchingResponse.friendsWatching || []);
    } catch (error) {
      console.error('Failed to fetch friends data:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await api.searchUsers(searchQuery);
      setSearchResults(response.users || []);
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Failed to search users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const followUser = async (userId: string) => {
    try {
      await api.followUser(userId);
      toast({
        title: "Success",
        description: "User followed successfully!",
      });
      // Refresh search results
      if (searchQuery.trim()) {
        const response = await api.searchUsers(searchQuery);
        setSearchResults(response.users || []);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to follow user",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold cinema-text">Social</h1>
        <p className="text-gray-300 text-lg">Connect with friends and discover new content</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/10 border border-white/20">
          <TabsTrigger value="discover" className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Discover People</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Friends Activity</span>
          </TabsTrigger>
          <TabsTrigger value="watching" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Currently Watching</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Find People</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex space-x-4 mb-6">
                <Input
                  type="text"
                  placeholder="Search by username or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                <Button type="submit" disabled={isLoading}>
                  <Search className="w-4 h-4" />
                </Button>
              </form>

              {searchResults.length > 0 && (
                <div className="space-y-4">
                  {searchResults.map((searchUser: any) => (
                    <div key={searchUser._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={searchUser.avatar} />
                          <AvatarFallback className="bg-neon-gradient text-white">
                            {searchUser.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{searchUser.username}</p>
                          {searchUser.bio && (
                            <p className="text-sm text-gray-400">{searchUser.bio}</p>
                          )}
                        </div>
                      </div>
                      {searchUser._id !== user?.id && (
                        <Button
                          onClick={() => followUser(searchUser._id)}
                          size="sm"
                          className="bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/30"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Follow
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {friendsActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No recent activity from friends</p>
                  <p className="text-sm text-gray-500">Follow some friends to see their activity!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {friendsActivity.map((activity: any) => (
                    <div key={activity._id} className="flex items-start space-x-4 p-4 rounded-lg bg-white/5">
                      <Avatar className="flex-shrink-0">
                        <AvatarImage src={activity.userId.avatar} />
                        <AvatarFallback className="bg-neon-gradient text-white text-xs">
                          {activity.userId.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Link 
                            to={`/user/${activity.userId._id}`}
                            className="font-medium text-neon-blue hover:text-neon-purple"
                          >
                            {activity.userId.username}
                          </Link>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              activity.status === 'watched' ? 'bg-green-500/20 text-green-400' :
                              activity.status === 'watching' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {activity.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {formatDate(activity.updatedAt)}
                          </span>
                        </div>
                        {activity.contentDetails && (
                          <div className="flex items-center space-x-3">
                            <img
                              src={activity.contentDetails.poster || '/placeholder.svg'}
                              alt={activity.contentDetails.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="text-white font-medium">{activity.contentDetails.title}</p>
                              {activity.rating && (
                                <div className="flex items-center space-x-1 mt-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-300">{activity.rating}/10</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watching" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>What Friends Are Watching</CardTitle>
            </CardHeader>
            <CardContent>
              {friendsWatching.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No friends are currently watching anything</p>
                  <p className="text-sm text-gray-500">Follow some friends to see what they're watching!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {friendsWatching.map((item: any) => (
                    <div key={item._id} className="flex items-center space-x-4 p-4 rounded-lg bg-white/5">
                      <img
                        src={item.contentDetails?.poster || '/placeholder.svg'}
                        alt={item.contentDetails?.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-white">{item.contentDetails?.title}</p>
                        <Link 
                          to={`/user/${item.userId._id}`}
                          className="text-sm text-neon-blue hover:text-neon-purple"
                        >
                          {item.userId.username}
                        </Link>
                        {item.rating && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-300">{item.rating}/10</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
