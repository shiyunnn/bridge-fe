import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Settings, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  unreadNotificationsCount: number;
  unresolvedConflictsCount: number;
  onToggleNotifications: () => void;
  onToggleConflicts: () => void;
}

const Header: React.FC<HeaderProps> = ({
  unreadNotificationsCount,
  unresolvedConflictsCount,
  onToggleNotifications,
  onToggleConflicts,
}) => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3" style={{ cursor: 'pointer' }} onClick={() => {
          navigate('/');
        }}>
          <img
            src="/bridge-logo.png"
            alt="Bridge Logo"
            className="h-8 w-auto"
          />
          <div className="h-6 w-[2px] bg-gray-300"></div>
          <h1 className="text-xl font-bold text-[#000F4E]">Bridge</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleNotifications}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white">
                {unreadNotificationsCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleConflicts}
            className="relative"
          >
            <AlertTriangle className="h-5 w-5" />
            {unresolvedConflictsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white">
                {unresolvedConflictsCount}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header; 