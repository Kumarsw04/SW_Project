
export interface HeaderProps {
  locationName?: string;
  avatarInitials?: string;
  onSearch?: (value: string) => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onHelpClick?: () => void;
  onTourClick?: () => void;
  onAskclick?: () => void;
}

export function formatHeaderTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}