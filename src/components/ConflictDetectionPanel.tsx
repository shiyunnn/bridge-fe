import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Calendar, Users, ArrowRight } from "lucide-react";

interface Developer {
  id: string;
  name: string;
  avatar?: string;
  role: "FE" | "BE" | "QA";
}

interface Project {
  id: string;
  name: string;
}

interface Conflict {
  id: string;
  developer: Developer;
  date: string;
  projects: Project[];
  severity: "high" | "medium" | "low";
}

interface ConflictDetectionPanelProps {
  conflicts?: Conflict[];
  onResolveConflict?: (
    conflictId: string,
    resolution: "reassign" | "reschedule",
  ) => void;
}

const ConflictDetectionPanel: React.FC<ConflictDetectionPanelProps> = ({
  conflicts = [
    {
      id: "1",
      developer: {
        id: "dev1",
        name: "Alex Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        role: "FE",
      },
      date: "2023-06-15",
      projects: [
        { id: "proj1", name: "Dashboard Redesign" },
        { id: "proj2", name: "Mobile App" },
      ],
      severity: "high",
    },
    {
      id: "2",
      developer: {
        id: "dev2",
        name: "Sam Taylor",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
        role: "BE",
      },
      date: "2023-06-16",
      projects: [
        { id: "proj1", name: "Dashboard Redesign" },
        { id: "proj3", name: "API Integration" },
      ],
      severity: "medium",
    },
    {
      id: "3",
      developer: {
        id: "dev3",
        name: "Jamie Lee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
        role: "QA",
      },
      date: "2023-06-17",
      projects: [
        { id: "proj2", name: "Mobile App" },
        { id: "proj4", name: "Analytics Platform" },
      ],
      severity: "low",
    },
  ],
  onResolveConflict = () => {},
}) => {
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("all");

  const filteredConflicts =
    activeTab === "all"
      ? conflicts
      : conflicts.filter((conflict) => conflict.severity === activeTab);

  const handleSelectConflict = (conflict: Conflict) => {
    setSelectedConflict(conflict);
  };

  const handleResolveConflict = (resolution: "reassign" | "reschedule") => {
    if (selectedConflict) {
      onResolveConflict(selectedConflict.id, resolution);
      setSelectedConflict(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Resource Conflicts
            </CardTitle>
            <CardDescription>Detected allocation conflicts</CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {conflicts.length} conflicts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="high">High Priority</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredConflicts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No conflicts found
              </div>
            ) : (
              <div className="space-y-3">
                {filteredConflicts.map((conflict) => (
                  <div
                    key={conflict.id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${selectedConflict?.id === conflict.id ? "bg-accent border-primary" : "hover:bg-accent/50"}`}
                    onClick={() => handleSelectConflict(conflict)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={conflict.developer.avatar}
                            alt={conflict.developer.name}
                          />
                          <AvatarFallback>
                            {conflict.developer.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {conflict.developer.name}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Badge variant="outline" className="mr-2">
                              {conflict.developer.role}
                            </Badge>
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(conflict.date)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={getSeverityColor(conflict.severity)}>
                        {conflict.severity}
                      </Badge>
                    </div>

                    {selectedConflict?.id === conflict.id && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="mb-2">
                          <p className="text-sm font-medium mb-1">
                            Conflicting Projects:
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {conflict.projects[0].name}
                            </Badge>
                            <ArrowRight className="h-3 w-3" />
                            <Badge variant="outline">
                              {conflict.projects[1].name}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleResolveConflict("reassign")}
                          >
                            <Users className="h-4 w-4 mr-1" /> Reassign
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleResolveConflict("reschedule")}
                          >
                            <Calendar className="h-4 w-4 mr-1" /> Reschedule
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {conflicts.length > 0 && !selectedConflict && (
          <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Select a conflict to resolve</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConflictDetectionPanel;
