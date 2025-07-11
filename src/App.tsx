import { Suspense, useState } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import TaskListPage from "./components/TaskListPage";
import Header from "./components/Header";
import NotificationPanel from "./components/NotificationPanel";
import ConflictDetectionPanel from "./components/ConflictDetectionPanel";
import { Notification, Conflict } from "./types";
import ReactGanttChart from "./components/ReactGanttChart";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      throwOnError: true,
      // Must disable retry since it doesn't work on react-native
      // and causing another exception (hard to debug)
      retry: false,
      placeholderData: (previousData) => previousData,
    },
  },
});

function App() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showConflicts, setShowConflicts] = useState(false);

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

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const unresolvedConflictsCount = conflicts.filter((c) => !c.resolved).length;


  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<p>Loading...</p>}>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <Header
            unreadNotificationsCount={unreadNotificationsCount}
            unresolvedConflictsCount={unresolvedConflictsCount}
            onToggleNotifications={() => setShowNotifications(!showNotifications)}
            onToggleConflicts={() => setShowConflicts(!showConflicts)}
          />
          <main className="container py-6">
            <>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects/:id/tasks" element={<TaskListPage />} />
                <Route path="/projects/:id/gantt-chart" element={<ReactGanttChart />} />
              </Routes>
              {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            </>
          </main>

          {/* Floating panels */}
          {showNotifications && (
            <div className="fixed top-16 right-4 z-50 w-96">
              <NotificationPanel
                notifications={notifications as any[]}
                onClose={() => setShowNotifications(false)}
              />
            </div>
          )}

          {showConflicts && (
            <div className="fixed top-16 right-4 z-50 w-96">
              <ConflictDetectionPanel
                conflicts={conflicts as any[]}
                onClose={() => setShowConflicts(false)}
              />
            </div>
          )}
        </div>

      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
