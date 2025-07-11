import { ErrorCodes } from './enums';

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
