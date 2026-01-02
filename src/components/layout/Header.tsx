import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cloud, Search, Settings, Menu, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { SearchBar } from "@/components/search/SearchBar";
import { IconButton } from "@/components/ui/Button";

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const { theme } = useTheme();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navLinks = [
    { path: "/", label: "Current" },
    { path: "/forecast", label: "Forecast" },
    { path: "/historical", label: "Historical" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-lg ${theme.cardBg} border-b ${theme.cardBorder}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center gap-2 ${theme.textPrimary}`}
          >
            <Cloud className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">Atmos</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${
                    isActive(link.path)
                      ? `${theme.accent} text-white`
                      : `${theme.textSecondary} hover:bg-white/10`
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <IconButton
              icon={<Search className="w-5 h-5" />}
              onClick={() => setShowSearch(true)}
              label="Search location"
            />
            <IconButton
              icon={<Settings className="w-5 h-5" />}
              onClick={onSettingsClick}
              label="Settings"
            />
            <IconButton
              icon={
                showMobileMenu ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )
              }
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              label="Menu"
              className="md:hidden"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <nav className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`
                    px-4 py-3 rounded-lg text-sm font-medium
                    transition-colors duration-200
                    ${
                      isActive(link.path)
                        ? `${theme.accent} text-white`
                        : `${theme.textSecondary} hover:bg-white/10`
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-20"
          onClick={() => setShowSearch(false)}
        >
          <div
            className="w-full max-w-xl mx-4 animate-in fade-in slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <SearchBar onClose={() => setShowSearch(false)} autoFocus />
          </div>
        </div>
      )}
    </header>
  );
}
