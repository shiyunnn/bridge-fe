import React, { useState } from "react";
import { Bell, X, Check, AlertCircle, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  type: "estimate" | "leave" | "conflict";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actions?: {
    accept?: {
      label: string;
      action: () => void;
    };
    reject?: {
      label: string;
      action: () => void;
    };
  };
}

interface NotificationPanelProps {
  notifications?: Notification[];
  onAcceptSuggestion?: (notificationId: string) => void;
  onRejectSuggestion?: (notificationId: string) => void;
  onDismissNotification?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications = defaultNotifications,
  onAcceptSuggestion = () => {},
  onRejectSuggestion = () => {},
  onDismissNotification = () => {},
  onMarkAllAsRead = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "estimate":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "leave":
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case "conflict":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "estimate":
        return <Badge variant="secondary">Estimate Change</Badge>;
      case "leave":
        return <Badge variant="outline">Leave Request</Badge>;
      case "conflict":
        return <Badge variant="destructive">Resource Conflict</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-[350px] bg-white shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
            Mark all read
          </Button>
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="estimate">Estimates</TabsTrigger>
            <TabsTrigger value="leave">Leave</TabsTrigger>
            <TabsTrigger value="conflict">Conflicts</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px] pr-4">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${notification.read ? "bg-white" : "bg-blue-50"}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">
                            {notification.title}
                          </h4>
                          {getTypeBadge(notification.type)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onDismissNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {notification.actions && (
                    <div className="mt-3 flex justify-end gap-2">
                      {notification.actions.reject && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRejectSuggestion(notification.id)}
                        >
                          {notification.actions.reject.label}
                        </Button>
                      )}
                      {notification.actions.accept && (
                        <Button
                          size="sm"
                          onClick={() => onAcceptSuggestion(notification.id)}
                          className="flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          {notification.actions.accept.label}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <Bell className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-gray-500">No notifications to display</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Default mock notifications for demonstration
const defaultNotifications: Notification[] = [
  {
    id: "1",
    type: "estimate",
    title: "Estimate Updated",
    description:
      "John Doe updated the estimate for Feature A from 3 to 5 days.",
    timestamp: "10 minutes ago",
    read: false,
    actions: {
      accept: {
        label: "Accept Changes",
        action: () => {},
      },
      reject: {
        label: "Adjust Manually",
        action: () => {},
      },
    },
  },
  {
    id: "2",
    type: "leave",
    title: "Leave Request",
    description:
      "Sarah Smith requested leave from May 15-18. Timeline adjustments suggested.",
    timestamp: "1 hour ago",
    read: true,
    actions: {
      accept: {
        label: "Apply Adjustments",
        action: () => {},
      },
      reject: {
        label: "Review Later",
        action: () => {},
      },
    },
  },
  {
    id: "3",
    type: "conflict",
    title: "Resource Conflict Detected",
    description:
      "Mike Johnson is assigned to both Project X and Project Y on June 2.",
    timestamp: "2 hours ago",
    read: false,
    actions: {
      accept: {
        label: "Resolve Conflict",
        action: () => {},
      },
    },
  },
  {
    id: "4",
    type: "estimate",
    title: "QA Buffer Increased",
    description:
      "System increased QA buffer for Feature B by 2 days based on recent bug trends.",
    timestamp: "Yesterday",
    read: true,
    actions: {
      accept: {
        label: "Accept",
        action: () => {},
      },
      reject: {
        label: "Adjust",
        action: () => {},
      },
    },
  },
  {
    id: "5",
    type: "conflict",
    title: "Multiple Conflicts",
    description: "Three developers have scheduling conflicts next week.",
    timestamp: "2 days ago",
    read: true,
    actions: {
      accept: {
        label: "Review All",
        action: () => {},
      },
    },
  },
];

export default NotificationPanel;
