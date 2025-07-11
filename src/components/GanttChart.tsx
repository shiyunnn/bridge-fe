import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Developer {
  id: string;
  name: string;
  role: "FE" | "BE" | "QA" | "UI/UX";
  avatar: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  resources: ResourceAllocation[];
  status: "planning" | "development" | "testing" | "complete";
}

interface ResourceAllocation {
  developerId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  hasConflict?: boolean;
}

interface GanttChartProps {
  features?: Feature[];
  developers?: Developer[];
  startDate?: Date;
  endDate?: Date;
  onResourceAllocate?: (
    featureId: string,
    resourceAllocation: ResourceAllocation,
  ) => void;
  onTimelineAdjust?: (
    featureId: string,
    startDate: Date,
    endDate: Date,
  ) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({
  features = [],
  developers = [],
  startDate = new Date(),
  endDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
  onResourceAllocate = () => {},
  onTimelineAdjust = () => {},
}) => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentViewStartDate, setCurrentViewStartDate] = useState(startDate);
  const [draggingResource, setDraggingResource] = useState<{
    featureId: string;
    resourceId: string;
  } | null>(null);

  // Generate array of dates for the chart
  const getDaysArray = (start: Date, end: Date) => {
    const arr = [];
    const dt = new Date(start);
    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  };

  const daysToShow = getDaysArray(
    currentViewStartDate,
    new Date(currentViewStartDate.getTime() + 13 * 24 * 60 * 60 * 1000),
  );

  const handleFeatureClick = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsDialogOpen(true);
  };

  const handleDragStart = (featureId: string, resourceId: string) => {
    setDraggingResource({ featureId, resourceId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, featureId: string, date: Date) => {
    e.preventDefault();
    if (draggingResource) {
      // In a real implementation, this would update the resource allocation
      console.log(
        `Moved resource ${draggingResource.resourceId} to feature ${featureId} on date ${date}`,
      );
      setDraggingResource(null);
    }
  };

  const navigateDays = (direction: "forward" | "backward") => {
    const newDate = new Date(currentViewStartDate);
    if (direction === "forward") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentViewStartDate(newDate);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "FE":
        return "bg-blue-500";
      case "BE":
        return "bg-green-500";
      case "QA":
        return "bg-purple-500";
      case "UI/UX":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  // Mock data for demonstration
  const mockDevelopers: Developer[] =
    developers.length > 0
      ? developers
      : [
          {
            id: "d1",
            name: "Alex Johnson",
            role: "FE",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
          },
          {
            id: "d2",
            name: "Sam Chen",
            role: "BE",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
          },
          {
            id: "d3",
            name: "Taylor Kim",
            role: "QA",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=taylor",
          },
          {
            id: "d4",
            name: "Jordan Lee",
            role: "UI/UX",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan",
          },
        ];

  // Get today's date for relative calculations
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const mockFeatures: Feature[] =
    features.length > 0
      ? features
      : [
          {
            id: "f1",
            name: "[HRIS-123] New entry dialog",
            description: "Implement secure login and registration system",
            startDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
            endDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
            resources: [
              {
                developerId: "d1",
                startDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
                endDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
                days: 3,
              },
              {
                developerId: "d2",
                startDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
                endDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
                days: 4,
                hasConflict: true,
              },
            ],
            status: "development",
          },
          {
            id: "f2",
            name: "[UX] Entry Dialog",
            description: "Create responsive dashboard interface",
            startDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
            endDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
            resources: [
              {
                developerId: "d4",
                startDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
                endDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
                days: 2,
              },
              {
                developerId: "d1",
                startDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
                endDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
                days: 4,
              },
            ],
            status: "planning",
          },
          {
            id: "f3",
            name: "Stakeholder Consult",
            description: "Connect frontend with backend services",
            startDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
            endDate: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
            resources: [
              {
                developerId: "d2",
                startDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
                endDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
                days: 4,
              },
              {
                developerId: "d1",
                startDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
                endDate: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
                days: 3,
              },
            ],
            status: "planning",
          },
        ];

  const displayFeatures = features.length > 0 ? features : mockFeatures;
  const displayDevelopers = developers.length > 0 ? developers : mockDevelopers;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  const getDeveloperById = (id: string) => {
    return (
      displayDevelopers.find((dev) => dev.id === id) || {
        id: "",
        name: "Unknown",
        role: "FE" as const,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=unknown",
      }
    );
  };

  return (
    <div className="bg-background w-full h-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-xl font-semibold">Resource Allocation</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDays("backward")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {formatDate(currentViewStartDate)} -{" "}
            {formatDate(daysToShow[daysToShow.length - 1])}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDays("forward")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-[1000px]">
          {/* Header row with dates */}
          <div className="flex border-b">
            <div className="w-48 min-w-48 border-r p-2 font-medium">
              Features
            </div>
            {daysToShow.map((day, index) => (
              <div
                key={index}
                className={`w-24 min-w-24 text-center p-1 text-xs ${isWeekend(day) ? "bg-muted" : ""}`}
              >
                <div className="font-medium">{formatDate(day)}</div>
                <div className="text-muted-foreground">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
              </div>
            ))}
          </div>

          {/* Feature rows */}
          {displayFeatures.map((feature) => (
            <div key={feature.id} className="flex border-b hover:bg-muted/30">
              <div
                className="w-48 min-w-48 border-r p-2 cursor-pointer"
                onClick={() => handleFeatureClick(feature)}
              >
                <div className="font-medium">{feature.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(feature.startDate)} -{" "}
                  {formatDate(feature.endDate)}
                </div>
                <Badge
                  variant="outline"
                  className={`mt-1 ${
                    feature.status === "development"
                      ? "bg-blue-100"
                      : feature.status === "testing"
                        ? "bg-purple-100"
                        : feature.status === "complete"
                          ? "bg-green-100"
                          : "bg-orange-100"
                  }`}
                >
                  {feature.status.charAt(0).toUpperCase() +
                    feature.status.slice(1)}
                </Badge>
              </div>

              {/* Days cells with resource allocations */}
              {daysToShow.map((day, dayIndex) => {
                const dayResources = feature.resources.filter((resource) => {
                  const resourceStartDate = new Date(resource.startDate);
                  const resourceEndDate = new Date(resource.endDate);
                  return day >= resourceStartDate && day <= resourceEndDate;
                });

                return (
                  <div
                    key={dayIndex}
                    className={`w-24 min-w-24 p-1 relative ${isWeekend(day) ? "bg-muted" : ""}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, feature.id, day)}
                  >
                    {dayResources.map((resource, resourceIndex) => {
                      const developer = getDeveloperById(resource.developerId);
                      return (
                        <TooltipProvider key={resourceIndex}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`mb-1 p-1 rounded text-xs text-white ${getRoleColor(developer.role)} ${resource.hasConflict ? "border-2 border-red-500" : ""}`}
                                draggable
                                onDragStart={() =>
                                  handleDragStart(
                                    feature.id,
                                    resource.developerId,
                                  )
                                }
                              >
                                <div className="flex items-center gap-1">
                                  <img
                                    src={
                                      developer.avatar ||
                                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.name}`
                                    }
                                    alt={developer.name}
                                    className="h-4 w-4 rounded-full"
                                  />
                                  <span className="truncate">
                                    {developer.name}
                                  </span>
                                  {resource.hasConflict && (
                                    <AlertCircle className="h-3 w-3 text-white" />
                                  )}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div>
                                <p className="font-medium">{developer.name}</p>
                                <p className="text-xs">
                                  {developer.role} Developer
                                </p>
                                <div className="flex items-center gap-1 text-xs mt-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{resource.days} days</span>
                                </div>
                                {resource.hasConflict && (
                                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    Resource conflict detected
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Feature detail dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedFeature?.name}</DialogTitle>
            <DialogDescription>
              {selectedFeature?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Timeline</h4>
              <div className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {selectedFeature && formatDate(selectedFeature.startDate)} -{" "}
                  {selectedFeature && formatDate(selectedFeature.endDate)}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Assigned Resources</h4>
              <div className="space-y-2">
                {selectedFeature?.resources.map((resource, index) => {
                  const developer = getDeveloperById(resource.developerId);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted p-2 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            developer.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.name}`
                          }
                          alt={developer.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {developer.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {developer.role} Developer
                          </p>
                        </div>
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{resource.days} days</span>
                        </div>
                        {resource.hasConflict && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Conflict
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              <Button>Edit Allocation</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GanttChart;
