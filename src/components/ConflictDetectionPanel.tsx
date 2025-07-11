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
import { AlertCircle, Calendar, Users, ArrowRight, X } from "lucide-react";

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
    resolution: "reassign" | "reschedule"
  ) => void;
  onClose?: () => void;
}

const ConflictDetectionPanel: React.FC<ConflictDetectionPanelProps> = ({
  conflicts = [],
  onResolveConflict = () => {},
  onClose = () => {},
}) => {
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("all");

  // Transform conflicts to match the expected format
  const transformedConflicts = conflicts.map((conflict: any) => ({
    id: conflict.id,
    developer: {
      id: conflict.resourceId || conflict.id,
      name: conflict.resourceName || "Unknown Developer",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${
        conflict.resourceName || conflict.id
      }`,
      role: "FE" as const,
    },
    date: conflict.date
      ? new Date(conflict.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    projects: conflict.featureNames
      ? conflict.featureNames.map((name: string, index: number) => ({
          id: conflict.featureIds?.[index] || `proj-${index}`,
          name: name,
        }))
      : [
          { id: "proj1", name: "Project A" },
          { id: "proj2", name: "Project B" },
        ],
    severity: conflict.resolved ? "low" : ("high" as "high" | "medium" | "low"),
  }));

  const filteredConflicts =
    activeTab === "all"
      ? transformedConflicts
      : transformedConflicts.filter(
          (conflict) => conflict.severity === activeTab
        );

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
        return "secondary";
      case "low":
        return "outline";
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
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="ml-2">
              {transformedConflicts.length} conflicts
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
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
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedConflict?.id === conflict.id
                        ? "bg-accent border-primary"
                        : "hover:bg-accent/50"
                    }`}
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
