
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Film, Star, Users, BookOpen, TrendingUp, Play } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-neon-blue/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-neon-purple/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-neon-pink/20 rounded-full animate-ping"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="space-y-8 animate-fade-in">
            {/* Logo Animation */}
            <div className="mx-auto w-24 h-24 bg-neon-gradient rounded-3xl flex items-center justify-center animate-float mb-8">
              <Film className="w-12 h-12 text-white" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold cinema-text leading-tight">
              Log Your Cinema
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your personal movie and anime tracking companion. Discover, rate, and share your cinematic journey with a vibrant community.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login">
                <Button size="lg" className="bg-neon-gradient hover:opacity-90 text-white font-semibold px-8 py-4 text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold cinema-text mb-4">
              Why Choose LYC?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to track, discover, and share your love for movies and anime
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <Card className="glass-card hover-glow group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-neon-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Personal Diary</h3>
                <p className="text-gray-300">
                  Keep a detailed log of everything you watch with ratings, reviews, and personal notes.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-glow group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-neon-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Social Community</h3>
                <p className="text-gray-300">
                  Connect with fellow movie and anime enthusiasts. Follow friends and discover new content.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-glow group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-neon-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Smart Discovery</h3>
                <p className="text-gray-300">
                  Get personalized recommendations based on your viewing history and preferences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-glow group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-neon-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Advanced Ratings</h3>
                <p className="text-gray-300">
                  Rate and review with detailed scoring systems. Track your taste evolution over time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-glow group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-neon-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Film className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Movies & Anime</h3>
                <p className="text-gray-300">
                  Comprehensive database covering both movies and anime with detailed information.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-glow group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-neon-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Watchlists</h3>
                <p className="text-gray-300">
                  Organize content you want to watch with custom lists and priority rankings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold cinema-text mb-12">Join the Community</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-neon-blue mb-2">10K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-neon-purple mb-2">50K+</div>
              <div className="text-gray-300">Movies Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-neon-pink mb-2">25K+</div>
              <div className="text-gray-300">Anime Series</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-neon-blue mb-2">100K+</div>
              <div className="text-gray-300">Reviews Written</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold cinema-text mb-6">
            Ready to Start Your Cinema Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of movie and anime lovers who are already tracking their favorites on LYC.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-neon-gradient hover:opacity-90 text-white font-semibold px-12 py-4 text-xl">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
