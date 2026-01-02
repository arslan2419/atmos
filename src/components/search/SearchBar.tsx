import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  X,
  MapPin,
  Loader2,
  Star,
  Clock,
  Navigation,
} from "lucide-react";
import { useWeather } from "@/context/WeatherContext";
import { searchLocations } from "@/services/weatherApi";
import { Location, WeatherError } from "@/types/weather";
import { Card } from "@/components/ui/Card";

interface SearchBarProps {
  onClose?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({ onClose, autoFocus = false }: SearchBarProps) {
  const {
    fetchWeatherForLocation,
    favoriteLocations,
    recentLocations,
    detectUserLocation,
    isLoading,
  } = useWeather();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Focus input on mount if autoFocus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const locations = await searchLocations(searchQuery);
      setResults(locations);
    } catch (err) {
      const weatherError = err as WeatherError;
      setError(weatherError.message);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(true);
    setSelectedIndex(-1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle location selection
  const handleSelectLocation = async (location: Location) => {
    setQuery(location.name);
    setShowDropdown(false);
    setResults([]);
    await fetchWeatherForLocation(location);
    onClose?.();
  };

  // Handle use current location
  const handleUseCurrentLocation = async () => {
    setShowDropdown(false);
    await detectUserLocation();
    onClose?.();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allItems = getAllItems();

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, allItems.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < allItems.length) {
          const item = allItems[selectedIndex];
          if (item.type === "location" && item.location) {
            handleSelectLocation(item.location);
          } else if (item.type === "current") {
            handleUseCurrentLocation();
          }
        }
        break;
      case "Escape":
        setShowDropdown(false);
        onClose?.();
        break;
    }
  };

  // Get all dropdown items for keyboard navigation
  const getAllItems = () => {
    const items: Array<{ type: "current" | "location"; location?: Location }> =
      [];

    // Current location option
    items.push({ type: "current" });

    // Search results or favorites/recent
    if (query.length >= 2 && results.length > 0) {
      results.forEach((location) => items.push({ type: "location", location }));
    } else if (query.length < 2) {
      favoriteLocations.forEach((location) =>
        items.push({ type: "location", location })
      );
      recentLocations
        .filter((loc) => !favoriteLocations.some((fav) => fav.id === loc.id))
        .forEach((location) => items.push({ type: "location", location }));
    }

    return items;
  };

  // Clear search
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const showResults = query.length >= 2;
  const showSuggestions =
    query.length < 2 &&
    (favoriteLocations.length > 0 || recentLocations.length > 0);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Search Input Row */}
      <div className="flex items-center gap-3">
        {/* Input Container */}
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a city or country..."
            className="
              w-full pl-12 pr-12 py-4
              bg-white/85 dark:bg-slate-800/85 backdrop-blur-2xl
              text-slate-800 dark:text-white placeholder:text-slate-400
              rounded-2xl border border-white/50 dark:border-slate-500/50 shadow-xl
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50
              transition-all duration-200
            "
            aria-label="Search for a location"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            role="combobox"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Dropdown - positioned relative to input */}
          {showDropdown && (
            <Card
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-auto z-50 !bg-white/90 dark:!bg-slate-800/90 backdrop-blur-xl shadow-2xl border border-slate-200/50 dark:border-slate-600/50"
              padding="sm"
            >
          {/* Current Location Option */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLoading}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl
              ${selectedIndex === 0 ? "bg-blue-500 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-700"}
              text-slate-800 dark:text-slate-200
              transition-colors duration-150
              disabled:opacity-50
            `}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Navigation className="w-5 h-5" />
            )}
            <span className="font-medium">Use current location</span>
          </button>

          <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

          {/* Loading State */}
          {isSearching && (
            <div className="flex items-center justify-center py-8 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Searching...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-4 text-red-500">{error}</div>
          )}

          {/* Search Results */}
          {showResults && !isSearching && results.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 py-1 text-xs font-medium uppercase text-slate-500">
                Results
              </p>
              {results.map((location, index) => (
                <LocationItem
                  key={location.id}
                  location={location}
                  onClick={() => handleSelectLocation(location)}
                  isSelected={selectedIndex === index + 1}
                  isFavorite={favoriteLocations.some(
                    (fav) => fav.id === location.id
                  )}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {showResults && !isSearching && results.length === 0 && !error && (
            <div className="text-center py-8 text-slate-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No locations found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}

          {/* Suggestions (Favorites & Recent) */}
          {showSuggestions && !isSearching && (
            <div className="space-y-4">
              {/* Favorites */}
              {favoriteLocations.length > 0 && (
                <div className="space-y-1">
                  <p className="px-3 py-1 text-xs font-medium uppercase text-slate-500">
                    Favorites
                  </p>
                  {favoriteLocations.map((location, index) => (
                    <LocationItem
                      key={location.id}
                      location={location}
                      onClick={() => handleSelectLocation(location)}
                      isSelected={selectedIndex === index + 1}
                      isFavorite={true}
                    />
                  ))}
                </div>
              )}

              {/* Recent */}
              {recentLocations.filter(
                (loc) => !favoriteLocations.some((fav) => fav.id === loc.id)
              ).length > 0 && (
                <div className="space-y-1">
                  <p className="px-3 py-1 text-xs font-medium uppercase text-slate-500">
                    Recent
                  </p>
                  {recentLocations
                    .filter(
                      (loc) =>
                        !favoriteLocations.some((fav) => fav.id === loc.id)
                    )
                    .map((location, index) => (
                      <LocationItem
                        key={location.id}
                        location={location}
                        onClick={() => handleSelectLocation(location)}
                        isSelected={
                          selectedIndex === favoriteLocations.length + index + 1
                        }
                        isRecent={true}
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </Card>
      )}
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-3.5 rounded-xl bg-white/85 dark:bg-slate-800/85 backdrop-blur-2xl border border-white/50 dark:border-slate-500/50 shadow-xl text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}

interface LocationItemProps {
  location: Location;
  onClick: () => void;
  isSelected?: boolean;
  isFavorite?: boolean;
  isRecent?: boolean;
}

function LocationItem({
  location,
  onClick,
  isSelected = false,
  isFavorite = false,
  isRecent = false,
}: LocationItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl
        ${isSelected ? "bg-blue-500 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"}
        transition-colors duration-150
        text-left
      `}
    >
      {isFavorite ? (
        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
      ) : isRecent ? (
        <Clock className={`w-5 h-5 ${isSelected ? "text-white" : "text-slate-500"}`} />
      ) : (
        <MapPin className={`w-5 h-5 ${isSelected ? "text-white" : "text-slate-500"}`} />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{location.name}</p>
        <p className={`text-sm truncate ${isSelected ? "text-white/80" : "text-slate-500"}`}>
          {location.admin1 ? `${location.admin1}, ` : ""}
          {location.country}
        </p>
      </div>
    </button>
  );
}
