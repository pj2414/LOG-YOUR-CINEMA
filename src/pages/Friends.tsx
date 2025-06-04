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
  const [activeTab, setActiveTab] = useState('followers');

  useEffect(() => {
    fetchFriendsData();
  }, [user]);

  const fetchFriendsData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const [followersResponse, followingResponse] = await Promise.all([
        api.getUserFollowers(user.id),
        api.getUserFollowing(user.id)
      ]);
      
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto" />
          <p>Loading friends data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="followers" className="w-1/2">
            <Users className="mr-2" />
            Followers ({followers.length})
          </TabsTrigger>
          <TabsTrigger value="following" className="w-1/2">
            <Activity className="mr-2" />
            Following ({following.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="followers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {followers.map((follower: any) => (
              <Card key={follower._id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage src={follower.avatar} />
                    <AvatarFallback>{follower.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>
                      <Link to={`/profile/${follower._id}`} className="hover:underline">
                        {follower.username}
                      </Link>
                    </CardTitle>
                    {follower.bio && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {follower.bio}
                      </p>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
            {followers.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">
                No followers yet
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="following">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {following.map((follow: any) => (
              <Card key={follow._id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage src={follow.avatar} />
                    <AvatarFallback>{follow.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle>
                      <Link to={`/profile/${follow._id}`} className="hover:underline">
                        {follow.username}
                      </Link>
                    </CardTitle>
                    {follow.bio && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {follow.bio}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => unfollowUser(follow._id)}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </CardHeader>
              </Card>
            ))}
            {following.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">
                Not following anyone yet
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
