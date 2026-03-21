import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { getProjects, createProject, deleteProject } from "../api/projects";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { getWorkspace, generateShareToken } from "../api/workspaces";
import { getMembers } from "../api/members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSocket } from "../hooks/useSocket";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAnalytics } from "../api/analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const statusColors = {
  todo: "secondary",
  in_progress: "default",
  completed: "outline",
} as const;

const statusLabels = {
  todo: "Todo",
  in_progress: "In Progress",
  completed: "Completed",
};

const WorkspacePage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  useSocket(workspaceId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");

  const { data: workspace } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspace(workspaceId!),
    enabled: !!workspaceId,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => getProjects(workspaceId!),
    enabled: !!workspaceId,
  });

  const { data: tasks } = useQuery({
    queryKey: ["tasks", workspaceId, selectedProjectId],
    queryFn: () => getTasks(workspaceId!, selectedProjectId!),
    enabled: !!workspaceId && !!selectedProjectId,
  });

  const { data: members } = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getMembers(workspaceId!),
    enabled: !!workspaceId,
  });

  const { data: analytics } = useQuery({
    queryKey: ["analytics", workspaceId],
    queryFn: () => getAnalytics(workspaceId!),
    enabled: !!workspaceId,
  });

  const shareTokenMutation = useMutation({
    mutationFn: () => generateShareToken(workspaceId!),
    onSuccess: (token) => {
      const shareUrl = `${window.location.origin}/share/${token}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    },
    onError: () => {
      toast.error("Failed to generate share link");
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: () => createProject(workspaceId!, { title: newProjectTitle }),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      toast.success("Project created!");
      setNewProjectTitle("");
      setCreateProjectOpen(false);
      setSelectedProjectId(project._id);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create project",
        );
      }
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(workspaceId!, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      toast.success("Project deleted!");
      setSelectedProjectId(null);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to delete project",
        );
      }
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: () =>
      createTask(workspaceId!, selectedProjectId!, {
        title: newTaskTitle,
        assigned_to: selectedAssignee || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId, selectedProjectId],
      });
      toast.success("Task created!");
      setNewTaskTitle("");
      setSelectedAssignee("");
      setCreateTaskOpen(false);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create task");
      }
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: { status?: string; title?: string };
    }) => updateTask(workspaceId!, selectedProjectId!, taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId, selectedProjectId],
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update task");
      }
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) =>
      deleteTask(workspaceId!, selectedProjectId!, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId, selectedProjectId],
      });
      toast.success("Task deleted!");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete task");
      }
    },
  });

  const tasksByStatus = {
    todo: tasks?.filter((t) => t.status === "todo") || [],
    in_progress: tasks?.filter((t) => t.status === "in_progress") || [],
    completed: tasks?.filter((t) => t.status === "completed") || [],
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            ← Back
          </Button>
          <h1 className="text-xl font-bold">
            {workspace?.name || "Workspace"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Share this invite token with anyone you want to add to this
                  workspace:
                </p>
                <div className="flex items-center gap-2">
                  <Input readOnly value={workspace?.invite_token || ""} />
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        workspace?.invite_token || "",
                      );
                      toast.success("Copied to clipboard!");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={() => shareTokenMutation.mutate()}
            disabled={shareTokenMutation.isPending}
          >
            {shareTokenMutation.isPending ? "Generating..." : "Share"}
          </Button>
        </div>
      </nav>

      <div className="flex flex-1">
        <aside className="w-64 border-r flex flex-col">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">Projects</h2>
              <Dialog
                open={createProjectOpen}
                onOpenChange={setCreateProjectOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    +
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Project Title</Label>
                      <Input
                        placeholder="My Project"
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => createProjectMutation.mutate()}
                      disabled={
                        createProjectMutation.isPending || !newProjectTitle
                      }
                    >
                      {createProjectMutation.isPending
                        ? "Creating..."
                        : "Create Project"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {projectsLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <ScrollArea className="h-48">
                {projects?.map((project) => (
                  <div
                    key={project._id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-accent ${
                      selectedProjectId === project._id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedProjectId(project._id)}
                  >
                    <span className="text-sm truncate">{project.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 hover:opacity-100 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProjectMutation.mutate(project._id);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            )}
          </div>

          <Separator />

          <div className="p-4">
            <h2 className="font-semibold text-sm mb-3">Members</h2>
            <ScrollArea className="h-48">
              {members?.map((member) => (
                <div key={member._id} className="flex items-center gap-2 p-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
                    {member.user_id?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm">{member.user_id?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <Tabs defaultValue="tasks">
            <TabsList className="mb-6">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              {!selectedProjectId ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Select a project from the sidebar
                    </p>
                    <Button onClick={() => setCreateProjectOpen(true)}>
                      Create your first project
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">
                      {
                        projects?.find((p) => p._id === selectedProjectId)
                          ?.title
                      }
                    </h2>
                    <Dialog
                      open={createTaskOpen}
                      onOpenChange={setCreateTaskOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>Add Task</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Task Title</Label>
                            <Input
                              placeholder="My Task"
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Assign To (optional)</Label>
                            <Select
                              value={selectedAssignee}
                              onValueChange={setSelectedAssignee}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a member" />
                              </SelectTrigger>
                              <SelectContent>
                                {members?.map((member) => (
                                  <SelectItem
                                    key={member._id}
                                    value={member.user_id._id}
                                  >
                                    {member.user_id.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => createTaskMutation.mutate()}
                            disabled={
                              createTaskMutation.isPending || !newTaskTitle
                            }
                          >
                            {createTaskMutation.isPending
                              ? "Creating..."
                              : "Create Task"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {(["todo", "in_progress", "completed"] as const).map(
                      (status) => (
                        <div key={status}>
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-semibold text-sm">
                              {statusLabels[status]}
                            </h3>
                            <Badge variant={statusColors[status]}>
                              {tasksByStatus[status].length}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {tasksByStatus[status].map((task) => (
                              <Card key={task._id}>
                                <CardHeader className="p-3">
                                  <CardTitle className="text-sm">
                                    {task.title}
                                  </CardTitle>
                                  {task.assigned_to && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
                                        {typeof task.assigned_to === "object"
                                          ? task.assigned_to.name
                                              .charAt(0)
                                              .toUpperCase()
                                          : "?"}
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {typeof task.assigned_to === "object"
                                          ? task.assigned_to.name
                                          : "Assigned"}
                                      </span>
                                    </div>
                                  )}
                                </CardHeader>
                                <CardContent className="p-3 pt-0">
                                  <Select
                                    value={task.status}
                                    onValueChange={(value) =>
                                      updateTaskMutation.mutate({
                                        taskId: task._id,
                                        updates: { status: value },
                                      })
                                    }
                                  >
                                    <SelectTrigger className="h-7 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="todo">Todo</SelectItem>
                                      <SelectItem value="in_progress">
                                        In Progress
                                      </SelectItem>
                                      <SelectItem value="completed">
                                        Completed
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full mt-2 h-7 text-xs text-destructive hover:text-destructive"
                                    onClick={() =>
                                      deleteTaskMutation.mutate(task._id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              {!analytics ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading analytics...
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                          Total Projects
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">
                          {analytics.overview.totalProjects}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                          Total Tasks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">
                          {analytics.overview.totalTasks}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                          Total Members
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">
                          {analytics.overview.totalMembers}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                          Completion Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">
                          {analytics.overview.completionRate}%
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Tasks by Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={analytics.tasksByStatus.map((item) => ({
                                name: item._id,
                                value: item.count,
                              }))}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {analytics.tasksByStatus.map((_, index) => (
                                <Cell
                                  key={index}
                                  fill={
                                    ["#6366f1", "#f59e0b", "#10b981"][index % 3]
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Tasks by Member
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={analytics.tasksByMember}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="user.name"
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#6366f1" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-48">
                        {analytics.recentActivity.map((log) => (
                          <div
                            key={log._id}
                            className="flex items-center gap-3 py-2 border-b last:border-0"
                          >
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
                              {log.user_id.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm">
                                <span className="font-medium">
                                  {log.user_id.name}
                                </span>{" "}
                                {log.action}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(log.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default WorkspacePage;
