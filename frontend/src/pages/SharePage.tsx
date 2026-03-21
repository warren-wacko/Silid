import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project, Task } from "../types";

const getSharedWorkspace = async (shareToken: string) => {
  const response = await api.get(`/share/${shareToken}`);
  return response.data.data;
};

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

const SharePage = () => {
  const { shareToken } = useParams<{ shareToken: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["share", shareToken],
    queryFn: () => getSharedWorkspace(shareToken!),
    enabled: !!shareToken,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading workspace...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Invalid Share Link</h2>
          <p className="text-muted-foreground">
            This link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Silid</h1>
          <Badge variant="outline">Read Only</Badge>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">{data?.workspace?.name}</h2>
          <p className="text-muted-foreground">Shared workspace — view only</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Projects & Tasks</h3>
          <div className="space-y-6">
            {data?.projects?.map((project: Project) => {
              const projectTasks =
                data?.tasks?.filter(
                  (t: Task) => t.project_id === project._id,
                ) || [];

              return (
                <div key={project._id}>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    {project.title}
                    <Badge variant="outline">{projectTasks.length} tasks</Badge>
                  </h4>
                  {projectTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground ml-2">
                      No tasks yet
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {(["todo", "in_progress", "completed"] as const).map(
                        (status) => (
                          <div key={status}>
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="text-sm text-muted-foreground">
                                {statusLabels[status]}
                              </h5>
                              <Badge variant={statusColors[status]}>
                                {
                                  projectTasks.filter(
                                    (t: Task) => t.status === status,
                                  ).length
                                }
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {projectTasks
                                .filter((t: Task) => t.status === status)
                                .map((task: Task) => (
                                  <Card key={task._id}>
                                    <CardHeader className="p-3">
                                      <CardTitle className="text-sm">
                                        {task.title}
                                      </CardTitle>
                                    </CardHeader>
                                    {task.description && (
                                      <CardContent className="p-3 pt-0">
                                        <p className="text-xs text-muted-foreground">
                                          {task.description}
                                        </p>
                                      </CardContent>
                                    )}
                                  </Card>
                                ))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharePage;
