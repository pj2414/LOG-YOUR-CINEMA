
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserMinus, Activity } from 'lucide-react';

export default function Friends() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFriendsData();
  }, [user]);

  const fetchFriendsData = async () => {
    if (!user?.id) return;
    
    try {
      console.log('Fetching friends data for user:', user.id);
      
      const [followersResponse, followingResponse] = await Promise.all([
        api.getUserFollowers(user.id),
        api.getUserFollowing(user.id)
      ]);

      console.log('Followers response:', followersResponse);
      console.log('Following response:', followingResponse);
      
      setFollowers(followersResponse.followers || []);
      setFollowing(followingResponse.following || []);
      
    } catch (error) {
      console.error('Failed to fetch friends data:', error);
      toast({
        title: "Error",
        description: "Failed to load friends data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unfollowUser = async (userId: string) => {
    try {
      await api.unfollowUser(userId);
      toast({
        title: "Success",
        description: "User unfollowed successfully!",
      });
      fetchFriendsData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to unfollow user",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading friends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold cinema-text">Friends</h1>
        <p className="text-gray-300 text-lg">Your cinema community</p>
      </div>

      <Tabs defaultValue="following" className="space-y-6">
        <TabsList className="bg-white/10 border border-white/20">
          <TabsTrigger value="following" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Following ({following.length})</span>
          </TabsTrigger>
          <TabsTrigger value="followers" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Followers ({followers.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="following" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>People You Follow</CardTitle>
            </CardHeader>
            <CardContent>
              {following.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">You're not following anyone yet</p>
                  <p className="text-sm text-gray-500">
                    <Link to="/social" className="text-neon-blue hover:text-neon-purple">
                      Discover people to follow
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {following.map((friend: any) => (
                    <div key={friend._id || friend.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback className="bg-neon-gradient text-white">
                            {friend.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link 
                            to={`/user/${friend._id || friend.id}`}
                            className="font-medium text-white hover:text-neon-blue"
                          >
                            {friend.username}
                          </Link>
                          {friend.bio && (
                            <p className="text-sm text-gray-400">{friend.bio}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => unfollowUser(friend._id || friend.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Unfollow
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followers" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Your Followers</CardTitle>
            </CardHeader>
            <CardContent>
              {followers.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No followers yet</p>
                  <p className="text-sm text-gray-500">
                    Start sharing your cinema journey to attract followers!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {followers.map((follower: any) => (
                    <div key={follower._id || follower.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={follower.avatar} />
                          <AvatarFallback className="bg-neon-gradient text-white">
                            {follower.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link 
                            to={`/user/${follower._id || follower.id}`}
                            className="font-medium text-white hover:text-neon-blue"
                          >
                            {follower.username}
                          </Link>
                          {follower.bio && (
                            <p className="text-sm text-gray-400">{follower.bio}</p>
                          )}
                        </div>
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
