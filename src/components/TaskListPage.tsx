import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Trash2,
  User as UserIcon,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  BarChartBig,
  GanttChart,
} from "lucide-react";

import { APIResponse, ProjectTask } from "@/types";
import { PriorityType, RoleType, TaskType } from "@/enums";
import { useNavigate, useParams } from "react-router-dom";
import SelectTeamMember from "./SelectTeamMember";
import useApiQuery from "@/hooks/useApiQuery";
import { formatRounded } from "@/utils/formatRounded";
import { API_URL } from "@/const";
import { useMutation } from "@tanstack/react-query";

function useCreateTaskMutation(id: number) {
  return useMutation({
    mutationFn: async (task: ProjectTask) => {
      const res = await fetch(`${API_URL}/projects/${id}/tasks/create/`, {
        method: "POST",
        body: JSON.stringify({ ...task, assignee_id: task.assignee?.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      return data;
    }
  })
}

function useGenerateGanttChartMutation(id: number) {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/projects/${id}/gantt-chart/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      return data;
    },
  })
}

interface TaskListPageProps {
  initialTasks?: ProjectTask[];
  onTaskUpdate?: (tasks: ProjectTask[]) => void;
  projectId: number;
}

const TaskListPage: React.FC<TaskListPageProps> = ({
  initialTasks = [],
  onTaskUpdate = () => { },
  projectId,
}) => {
  const navigate = useNavigate();
  const { mutateAsync: createTask } = useCreateTaskMutation(projectId);
  const { mutateAsync: generateGanttChart, isPending: isGeneratingGanttChart } = useGenerateGanttChartMutation(projectId);

  const [tasks, setTasks] = useState<ProjectTask[]>(
    initialTasks.length > 0 ? initialTasks : []
  );
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set(initialTasks.map(task => task.id)));
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editingTaskDescription, setEditingTaskDescription] = useState<
    number | null
  >(null);
  const [editingSubtask, setEditingSubtask] = useState<number | null>(null);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isAddSubtaskDialogOpen, setIsAddSubtaskDialogOpen] = useState(false);
  const [selectedTaskForSubtask, setSelectedTaskForSubtask] = useState<
    number | null
  >(null);
  const [newTask, setNewTask] = useState<Partial<ProjectTask>>({});
  const [newSubtask, setNewSubtask] = useState<Partial<ProjectTask>>({});

  const toggleTaskExpansion = (taskId: number) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const updateTask = (taskId: number, updates: Partial<ProjectTask>) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    onTaskUpdate(updatedTasks);
  };

  const updateSubtask = (
    taskId: number,
    subtaskId: number,
    updates: Partial<ProjectTask>
  ) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedSubtasks = task.children.map((subtask) =>
          subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
        );
        return { ...task, children: updatedSubtasks };
      }
      return task;
    });
    setTasks(updatedTasks);
    onTaskUpdate(updatedTasks);
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.description) return;

    const task: ProjectTask = {
      id: Math.random(),
      title: newTask.title,
      description: newTask.description,
      estimates: newTask.estimates || "1",
      assignee: newTask.assignee || null,
      priority: newTask.priority || 1,
      children: [],
      task_type: newTask.task_type || TaskType.General,
    };

    try {
      const res = await createTask(task);
      console.log(res);
    } catch (error) {
      console.error(error);
    }

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    onTaskUpdate(updatedTasks);
    setNewTask({});
    setIsAddTaskDialogOpen(false);
  };

  const addSubtask = () => {
    if (!newSubtask.title || !selectedTaskForSubtask) return;

    const subtask: ProjectTask = {
      id: Math.random(),
      title: newSubtask.title,
      estimates: newSubtask.estimates || "1",
      assignee: null,
      priority: newSubtask.priority || 1,
      description: newSubtask.description || "",
      task_type: newSubtask.task_type || TaskType.General,
    };

    const updatedTasks = tasks.map((task) => {
      if (task.id === selectedTaskForSubtask) {
        return { ...task, children: [...task.children, subtask] };
      }
      return task;
    });

    setTasks(updatedTasks);
    onTaskUpdate(updatedTasks);
    setNewSubtask({});
    setIsAddSubtaskDialogOpen(false);
    setSelectedTaskForSubtask(null);
  };

  const deleteTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    onTaskUpdate(updatedTasks);
  };

  const deleteSubtask = (taskId: number, subtaskId: number) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          children: task.children.filter((subtask) => subtask.id !== subtaskId),
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    onTaskUpdate(updatedTasks);
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-red-100 text-red-800";
      case 2:
        return "bg-yellow-100 text-yellow-800";
      case 3:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTotalEffort = () => {
    return tasks.reduce((total, task) => {
      const taskEffort = parseInt(task.estimates || "0");
      const subtaskEffort = task.children.reduce(
        (subTotal, subtask) => subTotal + parseInt(subtask.estimates || "0"),
        0
      );
      return total + taskEffort;
    }, 0);
  };

  const getCompletedTasks = () => {
    return tasks.filter((task) => task.priority === 1).length;
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Management</h1>
            <p className="text-muted-foreground">
              Manage and organize your project tasks with subtask support
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddTaskDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
            <Button
              variant="outline"
              disabled={isGeneratingGanttChart}
              onClick={async () => {
                const res = await generateGanttChart();
                console.log(res);
                if (res.code === 0) {
                  navigate(`/projects/${projectId}/gantt-chart`);
                }
              }}
            >
              Generate Gantt Chart
              {isGeneratingGanttChart && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <BarChartBig className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Subtasks
                  </p>
                  <p className="text-2xl font-bold">
                    {tasks.reduce((total, task) => total + task.children?.length, 0)}
                  </p>
                </div>
                <GanttChart className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          {false && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Completed
                    </p>
                    <p className="text-2xl font-bold">{getCompletedTasks()}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          )}
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
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Groups */}
        <div className="space-y-6">
          {tasks.map((task) => (
            <Card key={task.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                {/* Task Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
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
                          placeholder="Enter task title"
                          style={{ minWidth: 400 }}
                        />
                      ) : (
                        <h3
                          className={`font-medium cursor-pointer hover:text-blue-600 min-w-400 ${!task.title && "text-gray-400"
                            }`}
                          onClick={() => setEditingTask(task.id)}
                        >
                          {task.title || "Enter task title"}
                        </h3>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {false && (
                      <Badge className={getPriorityColor(task.priority)}>
                        {PriorityType[task.priority]}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTaskForSubtask(task.id);
                        setIsAddSubtaskDialogOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Task Details */}
                <div className="grid grid-cols-1 gap-4 mb-3 md:grid-cols-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Description
                    </Label>
                    {editingTaskDescription === task.id ? (
                      <Textarea
                        value={task.description}
                        onChange={(e) =>
                          updateTask(task.id, { description: e.target.value })
                        }
                        onBlur={() => setEditingTaskDescription(null)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && setEditingTaskDescription(null)
                        }
                        className="text-sm min-h-[60px] resize-none"
                        autoFocus
                        placeholder="Enter task description"
                      />
                    ) : (
                      <p
                        className={`text-sm cursor-pointer hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors ${!task.description && "text-gray-400"
                          }`}
                        onClick={() => setEditingTaskDescription(task.id)}
                      >
                        {task.description || "Enter task description"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Task type
                    </Label>
                    <Select
                      value={task.task_type?.toString() || "0"}
                      onValueChange={(value) =>
                        updateTask(task.id, { task_type: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select task type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">NA</SelectItem>
                        <SelectItem value="1">FE</SelectItem>
                        <SelectItem value="2">BE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Assignee
                    </Label>
                    <SelectTeamMember
                      value={`${task.assignee?.id || 0}`}
                      onValueChange={(value) =>
                        updateTask(task.id, { assignee: value })
                      }
                      taskType={task.task_type}
                    />
                    {/* <Select
                      value={`${task.assignee_id}`}
                      onValueChange={(value) =>
                        updateTask(task.id, { assignee_id: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={`${member.id}`}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Effort (days)
                    </Label>
                    <Input
                      type="number"
                      value={task.estimates}
                      onChange={(e) => {
                        const val = e.target.value;

                        // Allow empty string input (clearing input)
                        if (val === "") {
                          updateTask(task.id, { estimates: undefined }); // or null
                          return;
                        }

                        // Otherwise parse normally
                        const parsed = parseInt(val, 10);
                        if (!isNaN(parsed)) {
                          updateTask(task.id, { estimates: parsed.toString() });
                        }
                      }}
                      className="h-8"
                      min="0"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Status Selector */}
                {false && (
                  <div className="mb-3">
                    <Select
                      value={`${task.priority}`}
                      onValueChange={(value) =>
                        updateTask(task.id, {
                          priority: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger className="w-40 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Subtasks */}
                {task.children?.length > 0 && (
                  <Collapsible
                    open={expandedTasks.has(task.id)}
                    onOpenChange={() => toggleTaskExpansion(task.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-normal"
                      >
                        {expandedTasks.has(task.id) ? (
                          <ChevronDown className="w-4 h-4 mr-1" />
                        ) : (
                          <ChevronRight className="w-4 h-4 mr-1" />
                        )}
                        Subtasks ({task.children.length})
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                        {task.children.map((subtask) => (
                          <div
                            key={subtask.id}
                            className="flex items-center justify-between p-2 rounded bg-gray-50"
                          >
                            <div className="flex items-center flex-1 gap-2 mr-2">
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
                                    e.key === "Enter" && setEditingSubtask(null)
                                  }
                                  className="h-8 text-sm"
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className="flex-1 text-sm cursor-pointer hover:text-blue-600"
                                  onClick={() => setEditingSubtask(subtask.id)}
                                >
                                  {subtask.title}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Select
                                value={subtask.task_type.toString()}
                                onValueChange={(value) =>
                                  updateSubtask(task.id, subtask.id, {
                                    task_type: parseInt(value),
                                  })
                                }
                              >
                                <SelectTrigger className="w-32 h-7 text-xs">
                                  <SelectValue placeholder="Select task type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">NA</SelectItem>
                                  <SelectItem value="1">FE</SelectItem>
                                  <SelectItem value="2">BE</SelectItem>
                                </SelectContent>
                              </Select>

                              <SelectTeamMember
                                variant="small"
                                value={`${subtask.assignee?.id}`}
                                onValueChange={(value) =>
                                  updateSubtask(task.id, subtask.id, {
                                    assignee: value,
                                  })
                                }
                                taskType={subtask.task_type}
                              />

                              <Input
                                type="number"
                                value={subtask.estimates}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "") {
                                    updateSubtask(task.id, subtask.id, {
                                      estimates: undefined,
                                    });
                                    return;
                                  }
                                  const parsed = parseInt(val, 10);
                                  if (!isNaN(parsed)) {
                                    updateSubtask(task.id, subtask.id, {
                                      estimates: parsed.toString(),
                                    });
                                  }
                                }}
                                className="w-16 text-xs h-7"
                                min="0"
                                placeholder="0"
                              />
                              {false && (
                                <Select
                                  value={`${subtask.priority}`}
                                  onValueChange={(value) =>
                                    updateSubtask(task.id, subtask.id, {
                                      priority: parseInt(value),
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-24 text-xs h-7">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="in-progress">
                                      In Progress
                                    </SelectItem>
                                    <SelectItem value="completed">
                                      Done
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  deleteSubtask(task.id, subtask.id)
                                }
                              >
                                <Trash2 className="w-3 h-3" />
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
              <div>
                <Label htmlFor="task-type">Task type</Label>
                <Select
                  value={newTask.task_type?.toString() || "0"}
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, task_type: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">NA</SelectItem>
                    <SelectItem value="1">FE</SelectItem>
                    <SelectItem value="2">BE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-effort">Estimated Effort (days)</Label>
                  <Input
                    id="task-effort"
                    type="number"
                    value={newTask.estimates || 1}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        estimates: (parseInt(e.target.value) || 1).toString(),
                      })
                    }
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="task-assignee">Assignee</Label>
                  <SelectTeamMember
                    value={`${newTask.assignee?.id}`}
                    onValueChange={(value) =>
                      setNewTask({ ...newTask, assignee: value })
                    }
                    taskType={newTask.task_type}
                    className="h-9"
                  />
                </div>
                {false && (
                  <div>
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select
                      value={`${newTask.priority}` || "1"}
                      onValueChange={(value) =>
                        setNewTask({
                          ...newTask,
                          priority: parseInt(value),
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
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                  <Label htmlFor="task-feature">Feature</Label>
                  <Input
                    id="task-feature"
                    value={newTask.feature || ""}
                    onChange={(e) =>
                      setNewTask({ ...newTask, feature: e.target.value })
                    }
                    placeholder="Feature name..."
                  />
                </div> */}
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
                    value={newSubtask.estimates || 1}
                    onChange={(e) =>
                      setNewSubtask({
                        ...newSubtask,
                        estimates: (parseInt(e.target.value) || 1).toString(),
                      })
                    }
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="subtask-assignee">Assignee</Label>
                  <SelectTeamMember
                    value={`${newSubtask.assignee?.id}`}
                    onValueChange={(value) =>
                      setNewSubtask({ ...newSubtask, assignee: value })
                    }
                    taskType={newTask.task_type}
                    className="h-9"
                  />
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

// // Mock data for demonstration
// const mockTasks: ProjectTask[] = [
//   {
//     id: 1,
//     title: "User Authentication System",
//     description:
//       "Implement secure login, registration, and password recovery flows",
//     estimates: "8",
//     assignee_id: 1,
//     priority: 1,
//     task_type: TaskType.BE,
//     children: [
//       {
//         id: 101,
//         title: "Login form UI",
//         estimates: "2",
//         assignee_id: 2,
//         priority: 1,
//         task_type: TaskType.BE,
//         description: "Test describe",
//       },
//       {
//         id: 102,
//         title: "Password validation logic",
//         estimates: "3",
//         assignee_id: 1,
//         priority: 1,
//         task_type: TaskType.FE,
//         description: "Test describe",
//       },
//       {
//         id: 3,
//         title: "JWT token implementation",
//         estimates: "3",
//         assignee_id: 3,
//         priority: 1,
//         task_type: TaskType.BE,
//         description: "Test describe",
//       },
//     ],
//   },
// {
//   id: 2,
//   title: "User Profile Management",
//   description:
//     "Create user profile pages with edit capabilities and avatar upload",
//   estimates: 6,
//   assignee_id: 2,
//   priority: 1,
//   task_type: TaskType.FE,
//   children: [
//     {
//       id: 201,
//       title: "Profile page layout",
//       estimates: 2,
//       assignee_id: 1,
//       priority: 1,
//       task_type: TaskType.FE,
//       description: 'Test describe',
//     },
//     {
//       id: 202,
//       title: "Avatar upload functionality",
//       estimates: 2,
//       assignee_id: 3,
//       priority: 1,
//       task_type: TaskType.FE,
//       description: 'Test describe',
//     },
//   ],
// },
// {
//   id: 3,
//   title: "Admin Dashboard",
//   description:
//     "Build comprehensive admin interface for user management and analytics",
//   estimates: 12,
//   assignee_id: 3,
//   priority: 1,
//   task_type: TaskType.FE,
//   children: [
//     {
//       id: 301,
//       title: "User management table",
//       estimates: 4,
//       assignee_id: 3,
//       priority: 1,
//       task_type: TaskType.FE,
//       description: 'Test describe',
//     },
//     {
//       id: 302,
//       title: "Analytics charts",
//       estimates: 4,
//       assignee_id: 3,
//       priority: 1,
//       task_type: TaskType.FE,
//       description: 'Test describe',
//     },
//     {
//       id: 303,
//       title: "System configuration panel",
//       estimates: 4,
//       assignee_id: 3,
//       priority: 1,
//       task_type: TaskType.FE,
//       description: 'Test describe',
//     },
//   ],
// },
// {
//   id: 4,
//   title: "API Integration",
//   description:
//     "Connect frontend with backend services and implement error handling",
//   estimates: 5,
//   assignee_id: 3,
//   priority: 1,
//   task_type: TaskType.BE,
//   children: [],
// },
// ];

const TaskListPageWrapper = () => {
  const { id } = useParams();
  const { data, isLoading } = useApiQuery<APIResponse<ProjectTask[]>>(`/projects/${id}/tasks/`);

  return !isLoading && data ? (
    <TaskListPage initialTasks={data.data?.map((ele) => ({
      ...ele,
      estimates: ele.estimates ? formatRounded(ele.estimates) : "0",
      children: ele.children?.map((child) => ({
        ...child,
        estimates: child.estimates ? formatRounded(child.estimates) : "0",
      })),
    }))}
      projectId={parseInt(id)}
    />
  ) : (
    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
  )
}

export default TaskListPageWrapper;
