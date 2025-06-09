import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, TrendingUp } from 'lucide-react';

export default function Movies() {
const { toast } = useToast();
const [trending, setTrending] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
fetchTrendingMovies();
}, []);

const fetchTrendingMovies = async () => {
try {
const response = await api.getTrendingMovies();
setTrending(response.results || []);
} catch (error) {
toast({
title: "Error",
description: "Failed to load trending movies",
variant: "destructive",
});
} finally {
setIsLoading(false);
}
};

if (isLoading) {
return (
<div className="min-h-screen flex items-center justify-center">
<div className="text-center space-y-4">
<div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
<p className="text-gray-400">Loading movies...</p>
</div>
</div>
);
}

return (
<div className="container mx-auto px-4 py-8 mt-16 space-y-8">
<div className="text-center space-y-4">
<h1 className="text-4xl font-bold cinema-text">Movies</h1>
<p className="text-gray-300 text-lg">Discover and track your favorite movies</p>
</div>

<Card className="glass-card">
<CardHeader>
<CardTitle className="flex items-center space-x-2">
<TrendingUp className="w-5 h-5 text-neon-blue" />
<span>Trending Movies</span>
</CardTitle>
</CardHeader>
<CardContent>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
{trending.map((movie: any) => (
<Link key={movie.id} to={`/movie/${movie.id}`} className="group">
<Card className="glass-card hover-glow">
<CardContent className="p-0">
<img
src={movie.poster_path
? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
: '/placeholder.svg'
}
alt={movie.title}
className="w-full h-64 object-cover rounded-t-lg"
/>
<div className="p-4 space-y-2">
<h3 className="font-semibold text-white group-hover:text-neon-blue transition-colors line-clamp-2">
{movie.title}
</h3>
<div className="flex items-center justify-between">
<div className="flex items-center space-x-2">
<Calendar className="w-4 h-4 text-gray-400" />
<span className="text-sm text-gray-400">
{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
</span>
</div>
{movie.vote_average > 0 && (
<div className="flex items-center space-x-1">
<Star className="w-4 h-4 text-yellow-400 fill-current" />
<span className="text-sm text-gray-300">{movie.vote_average.toFixed(1)}</span>
</div>
)}
</div>
<p className="text-xs text-gray-400 line-clamp-3">{movie.overview}</p>
</div>
</CardContent>
</Card>
</Link>
))}
</div>
</CardContent>
</Card>
</div>
);
}
