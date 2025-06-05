import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, Search, User, LogOut, X } from "lucide-react";

interface MobileNavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold cinema-text">
            LYC
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-neon-blue border-b-2 border-neon-blue pb-1"
                  : "text-white hover:text-neon-blue transition duration-300"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                isActive
                  ? "text-neon-blue border-b-2 border-neon-blue pb-1"
                  : "text-white hover:text-neon-blue transition duration-300"
              }
            >
              Movies
            </NavLink>
            <NavLink
              to="/tv"
              className={({ isActive }) =>
                isActive
                  ? "text-neon-blue border-b-2 border-neon-blue pb-1"
                  : "text-white hover:text-neon-blue transition duration-300"
              }
            >
              TV Shows
            </NavLink>
            <NavLink
              to="/anime"
              className={({ isActive }) =>
                isActive
                  ? "text-neon-blue border-b-2 border-neon-blue pb-1"
                  : "text-white hover:text-neon-blue transition duration-300"
              }
            >
              Anime
            </NavLink>
            <NavLink
              to="/diary"
              className={({ isActive }) =>
                isActive
                  ? "text-neon-blue border-b-2 border-neon-blue pb-1"
                  : "text-white hover:text-neon-blue transition duration-300"
              }
            >
              Diary
            </NavLink>
            <NavLink
              to="/friends"
              className={({ isActive }) =>
                isActive
                  ? "text-neon-blue border-b-2 border-neon-blue pb-1"
                  : "text-white hover:text-neon-blue transition duration-300"
              }
            >
              Friends
            </NavLink>
            <NavLink
              to="/social"
              className={({ isActive }) =>
                isActive
                  ? "text-neon-blue border-b-2 border-neon-blue pb-1"
                  : "text-white hover:text-neon-blue transition duration-300"
              }
            >
              Social
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                isActive
                  ? "text-neon-blue border-b-2 border-neon-blue pb-1"
                  : "text-white hover:text-neon-blue transition duration-300"
              }
            >
              Search
            </NavLink>

            {/* Admin Link - Desktop */}
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive
                    ? "text-neon-blue border-b-2 border-neon-blue pb-1"
                    : "text-white hover:text-neon-blue transition duration-300"
                }
              >
                Admin
              </NavLink>
            )}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-2">
            {/* Search Icon (Mobile) */}
            <Link
              to="/search"
              className="md:hidden p-2 text-white hover:text-neon-blue"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* User Avatar & Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative p-1 rounded-full">
                  <Avatar className="w-8 h-8 border border-white/20">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-neon-gradient text-white">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 mr-2 bg-gray-900/95 backdrop-blur-md border-gray-700"
                align="end"
              >
                <DropdownMenuLabel className="text-white">
                  <div className="font-normal">{user?.username}</div>
                  <div className="text-xs text-gray-400 mt-1 truncate">
                    {user?.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  className="text-white hover:bg-white/10 cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:bg-white/10 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              className="md:hidden p-1"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink to="/dashboard" onClick={closeMobileMenu}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink to="/movies" onClick={closeMobileMenu}>
              Movies
            </MobileNavLink>
            <MobileNavLink to="/tv" onClick={closeMobileMenu}>
              TV Shows
            </MobileNavLink>
            <MobileNavLink to="/anime" onClick={closeMobileMenu}>
              Anime
            </MobileNavLink>
            <MobileNavLink to="/diary" onClick={closeMobileMenu}>
              Diary
            </MobileNavLink>
            <MobileNavLink to="/friends" onClick={closeMobileMenu}>
              Friends
            </MobileNavLink>
            <MobileNavLink to="/social" onClick={closeMobileMenu}>
              Social
            </MobileNavLink>
            <MobileNavLink to="/profile" onClick={closeMobileMenu}>
              Profile
            </MobileNavLink>

            {/* Admin Link - Mobile */}
            {user?.role === "admin" && (
              <MobileNavLink to="/admin" onClick={closeMobileMenu}>
                Admin
              </MobileNavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  to,
  children,
  onClick,
}) => (
  <Link
    to={to}
    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;
