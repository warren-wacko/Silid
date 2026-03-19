import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";
import {
  getWorkspaces,
  createWorkspace,
  joinWorkspace,
} from "../api/workspaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  const createMutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success(`Workspace "${workspace.name}" created!`);
      setNewWorkspaceName("");
      setCreateOpen(false);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create workspace",
        );
      }
    },
  });

  const joinMutation = useMutation({
    mutationFn: joinWorkspace,
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success(`Joined "${workspace.name}"!`);
      setInviteToken("");
      setJoinOpen(false);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Invalid invite token");
      }
    },
  });

  console.log(user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Silid</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {user?.name || "User"}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user?.name}!</h2>
            <p className="text-muted-foreground">
              Select a workspace or create a new one
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Join Workspace</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join a Workspace</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Invite Token</Label>
                    <Input
                      placeholder="Paste invite token here"
                      value={inviteToken}
                      onChange={(e) => setInviteToken(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => joinMutation.mutate(inviteToken)}
                    disabled={joinMutation.isPending || !inviteToken}
                  >
                    {joinMutation.isPending ? "Joining..." : "Join Workspace"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button>Create Workspace</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a Workspace</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Workspace Name</Label>
                    <Input
                      placeholder="My Team"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => createMutation.mutate(newWorkspaceName)}
                    disabled={createMutation.isPending || !newWorkspaceName}
                  >
                    {createMutation.isPending
                      ? "Creating..."
                      : "Create Workspace"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading workspaces...
          </div>
        ) : workspaces?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              You don't have any workspaces yet
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              Create your first workspace
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces?.map((workspace) => (
              <Card
                key={workspace._id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/workspaces/${workspace._id}`)}
              >
                <CardHeader>
                  <CardTitle>{workspace.name}</CardTitle>
                  <CardDescription>
                    Created {new Date(workspace.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Click to open workspace
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
