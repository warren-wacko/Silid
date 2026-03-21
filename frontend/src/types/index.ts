export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Workspace {
  _id: string;
  name: string;
  owner_id: string;
  invite_token: string;
  createdAt: string;
}

export interface Membership {
  _id: string;
  user_id: User;
  workspace_id: string;
  role: "owner" | "admin" | "member";
}

export interface Project {
  _id: string;
  workspace_id: string;
  title: string;
  description?: string;
  created_by: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  project_id: string;
  workspace_id: string;
  title: string;
  description?: string;
  assigned_to?: string | User;
  status: "todo" | "in_progress" | "completed";
  created_by: string;
  createdAt: string;
}

export interface ActivityLog {
  _id: string;
  workspace_id: string;
  user_id: User;
  action: string;
  entity_type: string;
  entity_id: string;
  createdAt: string;
}

export interface Analytics {
  overview: {
    totalProjects: number;
    totalMembers: number;
    totalTasks: number;
    completionRate: number;
  };
  tasksByStatus: { _id: string; count: number }[];
  tasksByMember: { count: number; user: { name: string; email: string } }[];
  recentActivity: ActivityLog[];
}
