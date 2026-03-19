import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { getProjects, createProject, deleteProject } from "../api/projects";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

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
      createTask(workspaceId!, selectedProjectId!, { title: newTaskTitle }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId, selectedProjectId],
      });
      toast.success("Task created!");
      setNewTaskTitle("");
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
          <h1 className="text-xl font-bold">Silid</h1>
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
                  {projects?.find((p) => p._id === selectedProjectId)?.title}
                </h2>
                <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
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
                      <Button
                        className="w-full"
                        onClick={() => createTaskMutation.mutate()}
                        disabled={createTaskMutation.isPending || !newTaskTitle}
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
        </main>
      </div>
    </div>
  );
};

export default WorkspacePage;
