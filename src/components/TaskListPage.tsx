import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  User,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  estimatedEffort: number;
  assignee: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  subtasks: Subtask[];
  feature: string;
}

interface Subtask {
  id: string;
  title: string;
  estimatedEffort: number;
  assignee: string;
  status: "todo" | "in-progress" | "completed";
}

interface TaskListPageProps {
  initialTasks?: Task[];
  teamMembers?: string[];
  onTaskUpdate?: (tasks: Task[]) => void;
  onNavigateToGantt?: () => void;
}

const TaskListPage: React.FC<TaskListPageProps> = ({
  initialTasks = [],
  teamMembers = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Brown",
    "Charlie Davis",
  ],
  onTaskUpdate = () => {},
  onNavigateToGantt = () => {},
}) => {
  const [tasks, setTasks] = useState<Task[]>(
    initialTasks.length > 0 ? initialTasks : mockTasks
  );
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<string | null>(null);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isAddSubtaskDialogOpen, setIsAddSubtaskDialogOpen] = useState(false);
  const [selectedTaskForSubtask, setSelectedTaskForSubtask] = useState<
    string | null
  >(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [newSubtask, setNewSubtask] = useState<Partial<Subtask>>({});

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    onTaskUpdate(updatedTasks);
  };

  const updateSubtask = (
    taskId: string,
    subtaskId: string,
    updates: Partial<Subtask>
  ) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map((subtask) =>
          subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
        );
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    });
    setTasks(updatedTasks);
    onTaskUpdate(updatedTasks);
  };

  const addTask = () => {
    if (!newTask.title || !newTask.description) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      estimatedEffort: newTask.estimatedEffort || 1,
      assignee: newTask.assignee || teamMembers[0],
      status: "todo",
      priority: (newTask.priority as Task["priority"]) || "medium",
      subtasks: [],
      feature: newTask.feature || "General",
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    onTaskUpdate(updatedTasks);
    setNewTask({});
    setIsAddTaskDialogOpen(false);
  };

  const addSubtask = () => {
    if (!newSubtask.title || !selectedTaskForSubtask) return;

    const subtask: Subtask = {
      id: `subtask-${Date.now()}`,
      title: newSubtask.title,
      estimatedEffort: newSubtask.estimatedEffort || 1,
      assignee: newSubtask.assignee || teamMembers[0],
      status: "todo",
    };

    const updatedTasks = tasks.map((task) => {
      if (task.id === selectedTaskForSubtask) {
        return { ...task, subtasks: [...task.subtasks, subtask] };
      }
      return task;
    });

    setTasks(updatedTasks);
    onTaskUpdate(updatedTasks);
    setNewSubtask({});
    setIsAddSubtaskDialogOpen(false);
    setSelectedTaskForSubtask(null);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    onTaskUpdate(updatedTasks);
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    onTaskUpdate(updatedTasks);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.feature]) {
      acc[task.feature] = [];
    }
    acc[task.feature].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const getTotalEffort = () => {
    return tasks.reduce((total, task) => {
      const taskEffort = task.estimatedEffort;
      const subtaskEffort = task.subtasks.reduce(
        (subTotal, subtask) => subTotal + subtask.estimatedEffort,
        0
      );
      return total + taskEffort + subtaskEffort;
    }, 0);
  };

  const getCompletedTasks = () => {
    return tasks.filter((task) => task.status === "completed").length;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Task Management</h1>
            <p className="text-muted-foreground">
              Manage and organize your project tasks with subtask support
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddTaskDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            <Button variant="outline" onClick={onNavigateToGantt}>
              View Gantt Chart
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <Circle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <p className="text-2xl font-bold">{getCompletedTasks()}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Effort
                  </p>
                  <p className="text-2xl font-bold">{getTotalEffort()}</p>
                  <p className="text-xs text-muted-foreground">days</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Features
                  </p>
                  <p className="text-2xl font-bold">
                    {Object.keys(groupedTasks).length}
                  </p>
                </div>
                <User className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Groups */}
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([feature, featureTasks]) => (
            <Card key={feature} className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{feature}</span>
                  <Badge variant="outline">{featureTasks.length} tasks</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {featureTasks.map((task) => (
                  <Card key={task.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      {/* Task Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(task.status)}
                          <div className="flex-1">
                            {editingTask === task.id ? (
                              <Input
                                value={task.title}
                                onChange={(e) =>
                                  updateTask(task.id, { title: e.target.value })
                                }
                                onBlur={() => setEditingTask(null)}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && setEditingTask(null)
                                }
                                className="font-medium"
                                autoFocus
                              />
                            ) : (
                              <h3
                                className="font-medium cursor-pointer hover:text-blue-600"
                                onClick={() => setEditingTask(task.id)}
                              >
                                {task.title}
                              </h3>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTaskForSubtask(task.id);
                              setIsAddSubtaskDialogOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Task Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Description
                          </Label>
                          <p className="text-sm">{task.description}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Assignee
                          </Label>
                          <Select
                            value={task.assignee}
                            onValueChange={(value) =>
                              updateTask(task.id, { assignee: value })
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {teamMembers.map((member) => (
                                <SelectItem key={member} value={member}>
                                  {member}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Effort (days)
                          </Label>
                          <Input
                            type="number"
                            value={task.estimatedEffort}
                            onChange={(e) =>
                              updateTask(task.id, {
                                estimatedEffort: parseInt(e.target.value) || 1,
                              })
                            }
                            className="h-8"
                            min="1"
                          />
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="mb-3">
                        <Select
                          value={task.status}
                          onValueChange={(value) =>
                            updateTask(task.id, {
                              status: value as Task["status"],
                            })
                          }
                        >
                          <SelectTrigger className="w-40 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in-progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Subtasks */}
                      {task.subtasks.length > 0 && (
                        <Collapsible
                          open={expandedTasks.has(task.id)}
                          onOpenChange={() => toggleTaskExpansion(task.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="p-0 h-auto font-normal"
                            >
                              {expandedTasks.has(task.id) ? (
                                <ChevronDown className="h-4 w-4 mr-1" />
                              ) : (
                                <ChevronRight className="h-4 w-4 mr-1" />
                              )}
                              Subtasks ({task.subtasks.length})
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-3">
                            <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                              {task.subtasks.map((subtask) => (
                                <div
                                  key={subtask.id}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                  <div className="flex items-center gap-2 flex-1">
                                    {getStatusIcon(subtask.status)}
                                    {editingSubtask === subtask.id ? (
                                      <Input
                                        value={subtask.title}
                                        onChange={(e) =>
                                          updateSubtask(task.id, subtask.id, {
                                            title: e.target.value,
                                          })
                                        }
                                        onBlur={() => setEditingSubtask(null)}
                                        onKeyDown={(e) =>
                                          e.key === "Enter" &&
                                          setEditingSubtask(null)
                                        }
                                        className="text-sm h-8"
                                        autoFocus
                                      />
                                    ) : (
                                      <span
                                        className="text-sm cursor-pointer hover:text-blue-600 flex-1"
                                        onClick={() =>
                                          setEditingSubtask(subtask.id)
                                        }
                                      >
                                        {subtask.title}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={subtask.assignee}
                                      onValueChange={(value) =>
                                        updateSubtask(task.id, subtask.id, {
                                          assignee: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger className="w-32 h-7 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {teamMembers.map((member) => (
                                          <SelectItem
                                            key={member}
                                            value={member}
                                          >
                                            {member}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      type="number"
                                      value={subtask.estimatedEffort}
                                      onChange={(e) =>
                                        updateSubtask(task.id, subtask.id, {
                                          estimatedEffort:
                                            parseInt(e.target.value) || 1,
                                        })
                                      }
                                      className="w-16 h-7 text-xs"
                                      min="1"
                                    />
                                    <Select
                                      value={subtask.status}
                                      onValueChange={(value) =>
                                        updateSubtask(task.id, subtask.id, {
                                          status: value as Subtask["status"],
                                        })
                                      }
                                    >
                                      <SelectTrigger className="w-24 h-7 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="todo">
                                          To Do
                                        </SelectItem>
                                        <SelectItem value="in-progress">
                                          In Progress
                                        </SelectItem>
                                        <SelectItem value="completed">
                                          Done
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        deleteSubtask(task.id, subtask.id)
                                      }
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Task Dialog */}
        <Dialog
          open={isAddTaskDialogOpen}
          onOpenChange={setIsAddTaskDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task with details and assignment information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title">Task Title *</Label>
                <Input
                  id="task-title"
                  value={newTask.title || ""}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Enter task title..."
                />
              </div>
              <div>
                <Label htmlFor="task-description">Description *</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description || ""}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Describe the task..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-effort">Estimated Effort (days)</Label>
                  <Input
                    id="task-effort"
                    type="number"
                    value={newTask.estimatedEffort || 1}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        estimatedEffort: parseInt(e.target.value) || 1,
                      })
                    }
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select
                    value={newTask.priority || "medium"}
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        priority: value as Task["priority"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-assignee">Assignee</Label>
                  <Select
                    value={newTask.assignee || teamMembers[0]}
                    onValueChange={(value) =>
                      setNewTask({ ...newTask, assignee: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member} value={member}>
                          {member}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="task-feature">Feature</Label>
                  <Input
                    id="task-feature"
                    value={newTask.feature || ""}
                    onChange={(e) =>
                      setNewTask({ ...newTask, feature: e.target.value })
                    }
                    placeholder="Feature name..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddTaskDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={addTask}>Add Task</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Subtask Dialog */}
        <Dialog
          open={isAddSubtaskDialogOpen}
          onOpenChange={setIsAddSubtaskDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Subtask</DialogTitle>
              <DialogDescription>
                Add a subtask to break down the main task into smaller
                components.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subtask-title">Subtask Title *</Label>
                <Input
                  id="subtask-title"
                  value={newSubtask.title || ""}
                  onChange={(e) =>
                    setNewSubtask({ ...newSubtask, title: e.target.value })
                  }
                  placeholder="Enter subtask title..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subtask-effort">
                    Estimated Effort (days)
                  </Label>
                  <Input
                    id="subtask-effort"
                    type="number"
                    value={newSubtask.estimatedEffort || 1}
                    onChange={(e) =>
                      setNewSubtask({
                        ...newSubtask,
                        estimatedEffort: parseInt(e.target.value) || 1,
                      })
                    }
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="subtask-assignee">Assignee</Label>
                  <Select
                    value={newSubtask.assignee || teamMembers[0]}
                    onValueChange={(value) =>
                      setNewSubtask({ ...newSubtask, assignee: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member} value={member}>
                          {member}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddSubtaskDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={addSubtask}>Add Subtask</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "User Authentication System",
    description:
      "Implement secure login, registration, and password recovery flows",
    estimatedEffort: 8,
    assignee: "John Doe",
    status: "in-progress",
    priority: "high",
    feature: "Authentication",
    subtasks: [
      {
        id: "subtask-1-1",
        title: "Login form UI",
        estimatedEffort: 2,
        assignee: "Alice Johnson",
        status: "completed",
      },
      {
        id: "subtask-1-2",
        title: "Password validation logic",
        estimatedEffort: 3,
        assignee: "John Doe",
        status: "in-progress",
      },
      {
        id: "subtask-1-3",
        title: "JWT token implementation",
        estimatedEffort: 3,
        assignee: "Bob Brown",
        status: "todo",
      },
    ],
  },
  {
    id: "task-2",
    title: "User Profile Management",
    description:
      "Create user profile pages with edit capabilities and avatar upload",
    estimatedEffort: 6,
    assignee: "Jane Smith",
    status: "todo",
    priority: "medium",
    feature: "User Management",
    subtasks: [
      {
        id: "subtask-2-1",
        title: "Profile page layout",
        estimatedEffort: 2,
        assignee: "Alice Johnson",
        status: "todo",
      },
      {
        id: "subtask-2-2",
        title: "Avatar upload functionality",
        estimatedEffort: 2,
        assignee: "Charlie Davis",
        status: "todo",
      },
    ],
  },
  {
    id: "task-3",
    title: "Admin Dashboard",
    description:
      "Build comprehensive admin interface for user management and analytics",
    estimatedEffort: 12,
    assignee: "Bob Brown",
    status: "todo",
    priority: "medium",
    feature: "Admin Panel",
    subtasks: [
      {
        id: "subtask-3-1",
        title: "User management table",
        estimatedEffort: 4,
        assignee: "Jane Smith",
        status: "todo",
      },
      {
        id: "subtask-3-2",
        title: "Analytics charts",
        estimatedEffort: 4,
        assignee: "Charlie Davis",
        status: "todo",
      },
      {
        id: "subtask-3-3",
        title: "System configuration panel",
        estimatedEffort: 4,
        assignee: "Bob Brown",
        status: "todo",
      },
    ],
  },
  {
    id: "task-4",
    title: "API Integration",
    description:
      "Connect frontend with backend services and implement error handling",
    estimatedEffort: 5,
    assignee: "Charlie Davis",
    status: "completed",
    priority: "high",
    feature: "Backend Integration",
    subtasks: [],
  },
];

export default TaskListPage;
