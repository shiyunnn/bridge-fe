import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Calendar,
  BarChart3,
} from "lucide-react";

interface ResourceDetailsSidebarProps {
  isOpen?: boolean;
  selectedFeature?: FeatureDetails;
  onClose?: () => void;
}

interface FeatureDetails {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in-progress" | "testing" | "completed";
  startDate: string;
  endDate: string;
  progress: number;
  resources: ResourceAllocation[];
  bufferDays: number;
  bugTrend: "increasing" | "stable" | "decreasing";
  suggestedBufferDays?: number;
}

interface ResourceAllocation {
  id: string;
  name: string;
  role: "FE" | "BE" | "QA" | "UI/UX";
  avatar?: string;
  allocatedDays: number;
  conflicts?: number;
}

const ResourceDetailsSidebar: React.FC<ResourceDetailsSidebarProps> = ({
  isOpen = true,
  selectedFeature = {
    id: "feat-123",
    name: "User Authentication System",
    description:
      "Implement secure login, registration, and password recovery flows with OAuth integration.",
    status: "in-progress",
    startDate: "2023-06-15",
    endDate: "2023-07-10",
    progress: 45,
    resources: [
      {
        id: "dev-1",
        name: "Alex Johnson",
        role: "FE",
        allocatedDays: 12,
        conflicts: 0,
      },
      {
        id: "dev-2",
        name: "Sarah Chen",
        role: "BE",
        allocatedDays: 15,
        conflicts: 2,
      },
      {
        id: "dev-3",
        name: "Miguel Rodriguez",
        role: "QA",
        allocatedDays: 8,
        conflicts: 0,
      },
    ],
    bufferDays: 3,
    bugTrend: "increasing",
    suggestedBufferDays: 5,
  },
  onClose = () => {},
}) => {
  const [bufferDays, setBufferDays] = useState(selectedFeature.bufferDays);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "testing":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "FE":
        return "bg-indigo-100 text-indigo-800";
      case "BE":
        return "bg-emerald-100 text-emerald-800";
      case "QA":
        return "bg-amber-100 text-amber-800";
      case "UI/UX":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const handleBufferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBufferDays(parseInt(e.target.value) || 0);
  };

  const acceptSuggestedBuffer = () => {
    if (selectedFeature.suggestedBufferDays) {
      setBufferDays(selectedFeature.suggestedBufferDays);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg overflow-y-auto z-10">
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-semibold">Feature Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <XCircle className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-xl font-bold">{selectedFeature.name}</h3>
          <div className="flex items-center mt-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedFeature.status)}`}
            >
              {selectedFeature.status.charAt(0).toUpperCase() +
                selectedFeature.status.slice(1)}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              ID: {selectedFeature.id}
            </span>
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="buffer">Buffer</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Description
              </Label>
              <p className="mt-1 text-sm">{selectedFeature.description}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Start Date
                </Label>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm">
                    {formatDate(selectedFeature.startDate)}
                  </span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  End Date
                </Label>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm">
                    {formatDate(selectedFeature.endDate)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <Label className="text-sm font-medium text-gray-500">
                  Progress
                </Label>
                <span className="text-sm font-medium">
                  {selectedFeature.progress}%
                </span>
              </div>
              <Progress value={selectedFeature.progress} className="h-2" />
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-gray-500">
                Assigned Resources
              </Label>
              <Badge variant="outline" className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {selectedFeature.resources.length}
              </Badge>
            </div>

            <div className="space-y-3">
              {selectedFeature.resources.map((resource) => (
                <Card key={resource.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${resource.name}`}
                          alt={resource.name}
                          className="h-8 w-8 rounded-full mr-2"
                        />
                        <div>
                          <p className="text-sm font-medium">{resource.name}</p>
                          <div className="flex items-center">
                            <Badge
                              className={`text-xs ${getRoleColor(resource.role)}`}
                            >
                              {resource.role}
                            </Badge>
                            {resource.conflicts > 0 && (
                              <Badge
                                variant="destructive"
                                className="ml-2 text-xs"
                              >
                                {resource.conflicts} conflicts
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {resource.allocatedDays} days
                        </p>
                        <p className="text-xs text-gray-500">allocated</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                // This would open a resource management dialog
                console.log(
                  "Opening resource management for feature:",
                  selectedFeature.id,
                );
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              Edit Resources
            </Button>
          </TabsContent>

          <TabsContent value="buffer" className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium text-gray-500">
                  QA Testing Buffer
                </Label>
                <Badge
                  variant={
                    selectedFeature.bugTrend === "increasing"
                      ? "destructive"
                      : selectedFeature.bugTrend === "decreasing"
                        ? "secondary"
                        : "outline"
                  }
                  className="text-xs"
                >
                  Bug trend: {selectedFeature.bugTrend}
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={bufferDays}
                  onChange={handleBufferChange}
                  className="w-20"
                  min="0"
                />
                <span className="text-sm">days</span>
              </div>
            </div>

            {selectedFeature.suggestedBufferDays &&
              selectedFeature.suggestedBufferDays !==
                selectedFeature.bufferDays && (
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          Suggested Buffer Adjustment
                        </p>
                        <p className="text-xs text-gray-600">
                          Based on recent bug trends, we recommend increasing
                          the buffer to {selectedFeature.suggestedBufferDays}{" "}
                          days.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={acceptSuggestedBuffer}
                    >
                      Accept Suggestion
                    </Button>
                  </CardContent>
                </Card>
              )}

            <div>
              <Label className="text-sm font-medium text-gray-500">
                Historical Bug Trends
              </Label>
              <div className="h-32 mt-2 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-6 w-6 mx-auto mb-1" />
                  <p className="text-xs">Bug trend visualization</p>
                </div>
              </div>
            </div>

            <Button className="w-full">Save Buffer Changes</Button>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button variant="outline" className="w-full" onClick={onClose}>
          Close Panel
        </Button>
      </div>
    </div>
  );
};

export default ResourceDetailsSidebar;
