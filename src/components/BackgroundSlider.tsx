
import { useState, useEffect } from 'react';

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1489599540771-ba0b65e6a9ee?w=1920&h=1080&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&h=1080&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1920&h=1080&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1560932678-4f37c5c9c7d5?w=1920&h=1080&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop&crop=center',
];

export default function BackgroundSlider() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % BACKGROUND_IMAGES.length
      );
    }, 8000); // Change image every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {BACKGROUND_IMAGES.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-2000 ${
            index === currentImageIndex ? 'opacity-30' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
            onLoad={() => index === 0 && setIsLoaded(true)}
          />
        </div>
      ))}
      
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-purple-900/40" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/10 via-transparent to-neon-purple/10 animate-pulse" />
    </div>
  );
}
