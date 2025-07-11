import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Settings,
  Calendar,
  Users,
  AlertTriangle,
  FileText,
  List,
} from "lucide-react";
import GanttChart from "./GanttChart";
import NotificationPanel from "./NotificationPanel";
import ConflictDetectionPanel from "./ConflictDetectionPanel";
import ResourceDetailsSidebar from "./ResourceDetailsSidebar";
import PRDInputPage from "./PRDInputPage";
import TaskListPage from "./TaskListPage";

interface Feature {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  resources: Resource[];
  status: "planning" | "design" | "development" | "qa" | "released";
}

interface Resource {
  id: string;
  name: string;
  type: "FE" | "BE" | "QA" | "UI/UX";
  availability: {
    startDate: Date;
    endDate: Date;
  }[];
}

interface Notification {
  id: string;
  type: "estimate_change" | "leave_request" | "conflict";
  message: string;
  date: Date;
  read: boolean;
  relatedFeatureId?: string;
  relatedResourceId?: string;
}

interface Conflict {
  id: string;
  resourceId: string;
  resourceName: string;
  featureIds: string[];
  featureNames: string[];
  date: Date;
  resolved: boolean;
}

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("prd-input");
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showConflicts, setShowConflicts] = useState(false);
  const [currentTasks, setCurrentTasks] = useState([]);
  const [currentPRD, setCurrentPRD] = useState(null);

  // Get today's date for relative calculations
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Mock data with dates relative to today
  const [features] = useState<Feature[]>([
    {
      id: "1",
      name: "[HRIS-123] New entry dialog",
      startDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      resources: [
        {
          id: "1",
          name: "John Doe",
          type: "FE",
          availability: [
            {
              startDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
              endDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
            },
          ],
        },
        {
          id: "2",
          name: "Jane Smith",
          type: "BE",
          availability: [
            {
              startDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
              endDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      ],
      status: "development",
    },
    {
      id: "2",
      name: "UI/UX - Entry dialog",
      startDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      resources: [
        {
          id: "1",
          name: "John Doe",
          type: "FE",
          availability: [
            {
              startDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
              endDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
            },
          ],
        },
        {
          id: "3",
          name: "Alice Johnson",
          type: "UI/UX",
          availability: [
            {
              startDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
              endDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      ],
      status: "design",
    },
    {
      id: "3",
      name: "Finance team PRD gathering",
      startDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
      resources: [
        {
          id: "2",
          name: "Jane Smith",
          type: "BE",
          availability: [
            {
              startDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
              endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
            },
          ],
        },
        {
          id: "4",
          name: "Bob Brown",
          type: "QA",
          availability: [
            {
              startDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
              endDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      ],
      status: "planning",
    },
  ]);

  // Mock resources data
  const [resources] = useState([
    {
      id: "1",
      name: "John Doe",
      role: "Frontend Developer",
      type: "FE",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      skills: ["React", "TypeScript", "CSS", "JavaScript"],
      currentProjects: ["User Authentication", "Dashboard UI"],
      availability: "Available",
      workload: 85,
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Backend Developer",
      type: "BE",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      skills: ["Node.js", "Python", "PostgreSQL", "API Design"],
      currentProjects: ["User Authentication", "API Integration"],
      availability: "Busy",
      workload: 95,
    },
    {
      id: "3",
      name: "Alice Johnson",
      role: "UI/UX Designer",
      type: "UI/UX",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
      currentProjects: ["Dashboard UI"],
      availability: "Available",
      workload: 60,
    },
    {
      id: "4",
      name: "Bob Brown",
      role: "QA Engineer",
      type: "QA",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      skills: ["Test Automation", "Manual Testing", "Cypress", "Jest"],
      currentProjects: ["API Integration"],
      availability: "Available",
      workload: 70,
    },
    {
      id: "5",
      name: "Charlie Davis",
      role: "Full Stack Developer",
      type: "FE",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie",
      skills: ["React", "Node.js", "MongoDB", "GraphQL"],
      currentProjects: [],
      availability: "Available",
      workload: 30,
    },
    {
      id: "6",
      name: "Diana Wilson",
      role: "DevOps Engineer",
      type: "BE",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diana",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      currentProjects: [],
      availability: "Available",
      workload: 45,
    },
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      type: "estimate_change",
      message:
        "John Doe updated estimate for User Authentication from 7 to 10 days",
      date: new Date(2025, 5, 3),
      read: false,
      relatedFeatureId: "1",
      relatedResourceId: "1",
    },
    {
      id: "2",
      type: "leave_request",
      message: "Jane Smith requested leave from June 10-12",
      date: new Date(2025, 5, 5),
      read: false,
      relatedResourceId: "2",
    },
    {
      id: "3",
      type: "conflict",
      message:
        "Resource conflict detected: John Doe assigned to multiple projects on June 5-7",
      date: new Date(2025, 5, 4),
      read: false,
      relatedResourceId: "1",
    },
  ]);

  const [conflicts] = useState<Conflict[]>([
    {
      id: "1",
      resourceId: "1",
      resourceName: "John Doe",
      featureIds: ["1", "2"],
      featureNames: ["User Authentication", "Dashboard UI"],
      date: new Date(2025, 5, 5),
      resolved: false,
    },
    {
      id: "2",
      resourceId: "2",
      resourceName: "Jane Smith",
      featureIds: ["1", "3"],
      featureNames: ["User Authentication", "API Integration"],
      date: new Date(2025, 5, 15),
      resolved: false,
    },
  ]);

  const handleFeatureSelect = (feature: Feature) => {
    setSelectedFeature(feature);
  };

  const handlePRDSubmit = (prdData: any) => {
    setCurrentPRD(prdData);
    // Generate mock tasks based on PRD
    const generatedTasks = generateTasksFromPRD(prdData);
    setCurrentTasks(generatedTasks);
    setSelectedTab("tasks");
  };

  const generateTasksFromPRD = (prdData: any) => {
    // Mock task generation logic
    return [
      {
        id: "generated-1",
        title: "Setup Project Structure",
        description:
          "Initialize project with required dependencies and folder structure",
        estimatedEffort: 2,
        assignee: "John Doe",
        status: "todo",
        priority: "high",
        feature: "Project Setup",
        subtasks: [],
      },
      {
        id: "generated-2",
        title: "Implement Core Features",
        description: "Develop the main functionality as outlined in the PRD",
        estimatedEffort: 8,
        assignee: "Jane Smith",
        status: "todo",
        priority: "high",
        feature: "Core Development",
        subtasks: [
          {
            id: "sub-1",
            title: "Database schema design",
            estimatedEffort: 2,
            assignee: "Bob Brown",
            status: "todo",
          },
          {
            id: "sub-2",
            title: "API endpoints",
            estimatedEffort: 3,
            assignee: "Jane Smith",
            status: "todo",
          },
          {
            id: "sub-3",
            title: "Frontend components",
            estimatedEffort: 3,
            assignee: "Alice Johnson",
            status: "todo",
          },
        ],
      },
    ];
  };

  const handleTaskUpdate = (updatedTasks: any[]) => {
    setCurrentTasks(updatedTasks);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const unresolvedConflictsCount = conflicts.filter((c) => !c.resolved).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
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
              onClick={() => setShowNotifications(!showNotifications)}
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
              onClick={() => setShowConflicts(!showConflicts)}
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

      {/* Main Content */}
      <main className="container py-6">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="prd-input">
              <FileText className="mr-2 h-4 w-4" />
              PRD Input
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <List className="mr-2 h-4 w-4" />
              Task List
            </TabsTrigger>
            <TabsTrigger value="gantt">
              <Calendar className="mr-2 h-4 w-4" />
              Gantt Chart
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prd-input" className="w-full">
            <PRDInputPage
              onSubmit={handlePRDSubmit}
              onGenerateTasks={handlePRDSubmit}
            />
          </TabsContent>

          <TabsContent value="tasks" className="w-full">
            <TaskListPage
              initialTasks={currentTasks}
              onTaskUpdate={handleTaskUpdate}
              onNavigateToGantt={() => setSelectedTab("gantt")}
            />
          </TabsContent>

          <TabsContent value="gantt" className="w-full">
            <div className="flex gap-6">
              <div className="flex-1">
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Resource Allocation Timeline
                    </h2>
                    <GanttChart
                      features={features}
                      onFeatureSelect={handleFeatureSelect}
                    />
                  </CardContent>
                </Card>
              </div>

              {selectedFeature && (
                <div className="w-80">
                  <ResourceDetailsSidebar
                    feature={selectedFeature}
                    onClose={() => setSelectedFeature(null)}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="grid gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Team Resources</h2>
                    <Button>Add New Resource</Button>
                  </div>

                  <div className="grid gap-4">
                    {resources.map((resource) => (
                      <Card key={resource.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={resource.avatar}
                              alt={resource.name}
                              className="h-12 w-12 rounded-full"
                            />
                            <div>
                              <h3 className="font-semibold">{resource.name}</h3>
                              <p className="text-sm text-gray-600">
                                {resource.role}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    resource.availability === "Available"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {resource.availability}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {resource.workload}% workload
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="mb-2">
                              <p className="text-sm font-medium">
                                Current Projects
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {resource.currentProjects.length > 0 ? (
                                  resource.currentProjects.map(
                                    (project, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                      >
                                        {project}
                                      </span>
                                    )
                                  )
                                ) : (
                                  <span className="text-xs text-gray-500">
                                    No active projects
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="mb-2">
                              <p className="text-sm font-medium">Skills</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {resource.skills
                                  .slice(0, 3)
                                  .map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                {resource.skills.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    +{resource.skills.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setSelectedFeature(
                                  features.find((f) =>
                                    f.resources.some(
                                      (r) => r.id === resource.id
                                    )
                                  ) || null
                                )
                              }
                            >
                              View Details
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">
                              Workload
                            </span>
                            <span className="text-sm">
                              {resource.workload}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                resource.workload > 90
                                  ? "bg-red-500"
                                  : resource.workload > 70
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${resource.workload}%` }}
                            ></div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating panels */}
      {showNotifications && (
        <div className="fixed top-16 right-4 z-50 w-96">
          <NotificationPanel
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>
      )}

      {showConflicts && (
        <div className="fixed top-16 right-4 z-50 w-96">
          <ConflictDetectionPanel
            conflicts={conflicts}
            onClose={() => setShowConflicts(false)}
          />
        </div>
      )}
    </div>
  );
}
