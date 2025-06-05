import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Film, 
  BookOpen, 
  Activity,
  Tv,
  Trash2,
  Shield,
  Database
} from 'lucide-react';
import { format } from 'date-fns';

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsResponse, usersResponse] = await Promise.all([
        api.getAppStats(),
        api.getAllUsers(currentPage)
      ]);

      setStats(statsResponse);
      setUsers(usersResponse.users);
      setTotalPages(usersResponse.totalPages);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await api.deleteUser(userId);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  if (!user?.role || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold cinema-text">Admin Dashboard</h1>
        <p className="text-gray-300 text-lg">Manage your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats?.stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Film className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Movie Logs</p>
                <p className="text-2xl font-bold text-white">{stats?.stats.movieLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <Tv className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">TV Logs</p>
                <p className="text-2xl font-bold text-white">{stats?.stats.tvLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-pink-500/20 rounded-full">
                <BookOpen className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Anime Logs</p>
                <p className="text-2xl font-bold text-white">{stats?.stats.animeLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-white/10 border border-white/20">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Recent Activity</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>Detailed Stats</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                      <p className="font-medium text-white">{user.username}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <p className="text-xs text-gray-500">
                          Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    {user.role !== 'admin' && (
                      <Button
                        onClick={() => deleteUser(user._id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                  <Button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentActivity.map((activity: any) => (
                  <div key={activity._id} className="flex items-start space-x-4 p-4 rounded-lg bg-white/5">
                    <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-white">
                        <span className="font-medium text-neon-blue">
                          {activity.userId.username}
                        </span>{' '}
                        {activity.description}
                      </p>
                      <p className="text-sm text-gray-400">
                        {format(new Date(activity.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Detailed Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-gray-400 mb-1">Total Diary Entries</p>
                  <p className="text-2xl font-bold text-white">{stats?.stats.totalDiaryEntries}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-gray-400 mb-1">Total Collections</p>
                  <p className="text-2xl font-bold text-white">{stats?.stats.totalCollections}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-gray-400 mb-1">Total Activities</p>
                  <p className="text-2xl font-bold text-white">{stats?.stats.totalActivities}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-gray-400 mb-1">Admin Users</p>
                  <p className="text-2xl font-bold text-white">{stats?.stats.totalAdmins}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-gray-400 mb-1">Total Logs</p>
                  <p className="text-2xl font-bold text-white">{stats?.stats.totalLogs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}