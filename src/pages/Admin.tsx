import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Trash2 } from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLogs: 0,
    totalDiaryEntries: 0,
    totalCollections: 0,
    totalActivities: 0,
    totalAdmins: 0,
    movieLogs: 0,
    animeLogs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const [usersResponse, statsResponse] = await Promise.all([
        api.getAllUsers(),
        api.getAppStats(),
      ]);

      setUsers(usersResponse.users || []);
      setStats(statsResponse);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.deleteUser(userId);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      fetchAdminData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
    setUserToDelete(null);
  };

  if (!user?.role || user.role !== 'admin') {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center">Access Denied</h1>
        <p className="text-center mt-4">You don't have permission to view this page.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="container mx-auto p-4 space-y-8">
        <h1 className="text-3xl font-bold sticky top-0 pt-4 pb-2 bg-background/95 backdrop-blur-sm z-10">
          Admin Dashboard
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Total Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalLogs}</p>
              <div className="text-sm text-muted-foreground">
                Movies: {stats.movieLogs} | Anime: {stats.animeLogs}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Diary Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalDiaryEntries}</p>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalCollections}</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.role !== 'admin' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setUserToDelete(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user
                and all their associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => userToDelete && handleDeleteUser(userToDelete.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ScrollArea>
  );
}