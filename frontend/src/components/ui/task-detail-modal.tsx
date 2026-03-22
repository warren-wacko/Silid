import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import type { Task, Membership } from "../../types";
import { updateTask, deleteTask } from "../../api/tasks";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTasks } from "../../api/tasks";

interface TaskDetailModalProps {
  task: Task | null;
  workspaceId: string;
  projectId: string;
  members: Membership[];
  open: boolean;
  onClose: () => void;
}

const priorityColors = {
  low: "secondary",
  medium: "default",
  high: "destructive",
} as const;

const TaskDetailModal = ({
  task,
  workspaceId,
  projectId,
  members,
  open,
  onClose,
}: TaskDetailModalProps) => {
  const queryClient = useQueryClient();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const { data: tasks } = useQuery({
    queryKey: ["tasks", workspaceId, projectId],
    queryFn: () => getTasks(workspaceId, projectId),
    enabled: !!workspaceId && !!projectId,
  });

  const liveTask = tasks?.find((t: Task) => t._id === task?._id) || task;

  const [editedTitle, setEditedTitle] = useState(liveTask?.title || "");
  const [editedDescription, setEditedDescription] = useState(
    liveTask?.description || "",
  );

  const updateMutation = useMutation({
    mutationFn: (updates: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      assigned_to?: string;
      due_date?: string;
    }) => updateTask(workspaceId, projectId, task!._id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId, projectId],
      });
      toast.success("Task updated!");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update task");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(workspaceId, projectId, task!._id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId, projectId],
      });
      toast.success("Task deleted!");
      onClose();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete task");
      }
    },
  });

  if (!liveTask) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant={priorityColors[liveTask.priority]}>
              {liveTask.priority}
            </Badge>
            <Badge variant="outline">{liveTask.status.replace("_", " ")}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            {isEditingTitle ? (
              <div className="flex gap-2">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-xl font-bold"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    updateMutation.mutate({ title: editedTitle });
                    setIsEditingTitle(false);
                  }}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditedTitle(liveTask.title);
                    setIsEditingTitle(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <h2
                className="text-xl font-bold cursor-pointer hover:bg-accent rounded px-1"
                onClick={() => {
                  setEditedTitle(liveTask.title);
                  setIsEditingTitle(true);
                }}
              >
                {liveTask.title}
              </h2>
            )}
          </div>

          <div>
            <Label className="text-muted-foreground mb-2 block">
              Description
            </Label>
            {isEditingDescription ? (
              <div className="space-y-2">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full min-h-24 p-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-1"
                  placeholder="Add a description..."
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      updateMutation.mutate({
                        description: editedDescription,
                      });
                      setIsEditingDescription(false);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditedDescription(liveTask.description || "");
                      setIsEditingDescription(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p
                className="text-sm cursor-pointer hover:bg-accent rounded p-2 min-h-12"
                onClick={() => {
                  setEditedDescription(liveTask.description || "");
                  setIsEditingDescription(true);
                }}
              >
                {liveTask.description || (
                  <span className="text-muted-foreground">
                    Click to add description...
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Status</Label>
              <Select
                value={liveTask.status}
                onValueChange={(value) =>
                  updateMutation.mutate({ status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Priority</Label>
              <Select
                value={liveTask.priority}
                onValueChange={(value) =>
                  updateMutation.mutate({ priority: value })
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

            <div className="space-y-2">
              <Label className="text-muted-foreground">Assignee</Label>
              <Select
                value={
                  typeof liveTask.assigned_to === "object"
                    ? liveTask.assigned_to._id
                    : liveTask.assigned_to || ""
                }
                onValueChange={(value) =>
                  updateMutation.mutate({ assigned_to: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  {members?.map((member) => (
                    <SelectItem key={member._id} value={member.user_id._id}>
                      {member.user_id.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Due Date</Label>
              <Input
                type="date"
                value={
                  liveTask.due_date
                    ? new Date(liveTask.due_date).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  updateMutation.mutate({ due_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Created {new Date(liveTask.createdAt).toLocaleDateString()}
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Task"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
