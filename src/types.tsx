import { ErrorCodes, PriorityType, ProjectStatus, RoleType, TaskType } from './enums';


export interface Notification {
  id: string;
  type: "estimate_change" | "leave_request" | "conflict";
  message: string;
  date: Date;
  read: boolean;
  relatedFeatureId?: string;
  relatedResourceId?: string;
}

export interface Conflict {
  id: string;
  resourceId: string;
  resourceName: string;
  featureIds: string[];
  featureNames: string[];
  date: Date;
  resolved: boolean;
}

export interface APIResponse<ResponseData = unknown> {
  data: ResponseData;
  code: ErrorCodes;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface GanttTask {
  id: string | number;
  // start is mandatory in incoming data; end or duration is optional - but one of them must be
  start: Date;
  end?: Date;
  duration?: number;

  text?: string;
  progress?: number;
  parent?: string | number;
  type?: 'task' | 'summary' | 'milestone' | any; //can be custom type
  open?: boolean;
  lazy?: boolean;

  // data for task baseline
  // base_start is mandatory in incoming data; end or duration is optional - but one of them must be
  base_start?: Date;
  base_end?: Date;
  base_duration?: number;

  user?: string;
}

export interface GanttTasksResponse {
  tasks: GanttTask[];
}

export interface GanttLink {
  id: string | number;
  source: string | number;
  target: string | number;
  type: 's2s' | 's2e' | 'e2s' | 'e2e';
}

export interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  status: ProjectStatus;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: RoleType;
}

export interface ProjectTask {
  id: number;
  title: string;
  description: string;
  estimates: number;
  priority: PriorityType;
  task_type: TaskType;
  assignee_id: number;
  children?: ProjectTask[];
}

export interface ResponseError {
  message: string;
  code: ErrorCodes;
  path: (string | number)[];
  extra: Record<string, unknown>;
}
