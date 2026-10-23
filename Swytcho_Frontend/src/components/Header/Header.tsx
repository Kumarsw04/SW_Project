
import { useEffect, useState } from 'react';
import {
  Search,
  MapPin,
  ChevronDown,
  Bell,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import './Header.css';

interface HeaderProps {
  locationName?: string;
  avatarInitials?: string;
  onSearch?: (value: string) => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onHelpClick?: () => void;
  onTourClick?: () => void;
  onAskclick?: () => void;
}

export default function Header({
  locationName = 'Bhubaneswar, India',
  avatarInitials = 'KS',
  onSearch,
  onNotificationsClick,
  onProfileClick,
  onHelpClick,
  onTourClick,
  onAskclick,
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [DarkMode, setDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date()
);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(
        new Date()
      );
    }, 30_000); // Update every 30 seconds

    return () => window.clearInterval(timer);
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <header className="header">
      <form
        className="header-search"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          type="search"
          value={searchValue}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search buildings, connections, locations..."
          aria-label="Search buildings, connections, and locations"
        />
        <Search size={17} aria-hidden="true" />
      </form>

      <div className="header-actions">
        <button
          type="button"
          className="header-location"
          aria-label={`Selected location: ${locationName}`}
        >
          <MapPin size={17} aria-hidden="true" />
          <span>{locationName}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="header-icon-button header-notifications"
          onClick={onNotificationsClick}
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} aria-hidden="true" />
          <span className="header-notification-dot" />
        </button>

        <span className ="header-divider" aria-label='true' />

        <time className ="header-clock">
          {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit',
             minute: '2-digit' , 
             hour12: false })}
        </time>

        <button type= "button" 
        className="header-icon-button header-theme" 
        onClick={() => setDarkMode((previous) => !previous)}
        aria-label="Toggle theme"
        title="Toggle theme">
          {DarkMode ? (
            <Moon size={15} aria-hidden="true" />
          ) : (
            <Sun size={15} aria-hidden="true" />
          )}
        </button>

        <button type= "button"
        className="header-icon-button header-help"
        onClick={onHelpClick}
        aria-label="Help"
        title="Help">
          <Sparkles size={16} aria-hidden="true" />
        </button>

        <button type= "button"
        className="header-icon-button header-tour"
        onClick={onTourClick}>
          Tour
        </button>

        <button type= "button"
        className="header-icon-button header-ask"
        onClick={onAskclick}>
          <Sparkles size={16} aria-hidden="true" />
          Ask
        </button>

        <button
          type="button"
          className="header-avatar"
          onClick={onProfileClick}
          aria-label="Open profile"
          title="My profile"
        >
          {avatarInitials}
        </button>
      </div>
    </header>
  );
}
