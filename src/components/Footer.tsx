
import { Link } from 'react-router-dom';
import { Film, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neon-gradient rounded-lg flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold cinema-text">LYC</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your personal movie and anime tracking companion. Discover, rate, and share your cinematic journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4"></h3>
            <div className="space-y-2">
              <Link to="/movies" className="block text-gray-400 hover:text-neon-blue transition-colors text-sm">
                
              </Link>
              <Link to="/anime" className="block text-gray-400 hover:text-neon-blue transition-colors text-sm">
                
              </Link>
              <Link to="/diary" className="block text-gray-400 hover:text-neon-blue transition-colors text-sm">
                
              </Link>
              <Link to="/social" className="block text-gray-400 hover:text-neon-blue transition-colors text-sm">
                
              </Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/movies" className="block text-gray-400 hover:text-neon-blue transition-colors text-sm">
                Movies
              </Link>
              <Link to="/anime" className="block text-gray-400 hover:text-neon-blue transition-colors text-sm">
                Anime
              </Link>
              <Link to="/diary" className="block text-gray-400 hover:text-neon-blue transition-colors text-sm">
                Diary
              </Link>
              <Link to="/social" className="block text-gray-400 hover:text-neon-blue transition-colors text-sm">
                Social
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-gray-400 hover:text-neon-blue hover:bg-white/10"
                asChild
              >
                <a href="https://linkedin.com/in/pranav-jha-357a92290" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-gray-400 hover:text-neon-blue hover:bg-white/10"
                asChild
              >
                <a href="https://instagram.com/pranavsamraat" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zm4.624 7.512l-2.077 9.746c-.155.729-.565.899-1.144.558l-3.159-2.329-1.522 1.464c-.169.168-.31.31-.635.31l.226-3.211 5.839-5.273c.254-.226-.054-.351-.395-.125l-7.215 4.542-3.108-.971c-.676-.211-.688-.676.141-.999L15.17 6.351c.564-.207 1.055.141.872.849l-.001.014z"/>
                  </svg>
                </a>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-gray-400 hover:text-neon-blue hover:bg-white/10"
                asChild
              >
                <a href="https://github.com/pj2414" target="_blank" rel="noopener noreferrer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm flex items-center">
            <span>Designed and Developed by PJ with</span>
            <Heart className="w-4 h-4 mx-1 text-red-500" />
          </div>
          <div className="text-gray-400 text-sm mt-2 md:mt-0">
            © 2025 LYC. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
