import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";

export const useSocket = (workspaceId: string | undefined) => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!workspaceId || !token) return;

    socketRef.current = io("http://localhost:5000", {
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected!");
      socketRef.current?.emit("join:workspace", workspaceId);
    });

    socketRef.current.on("task:created", () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId],
      });
    });

    socketRef.current.on("task:updated", () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId],
      });
    });

    socketRef.current.on("task:deleted", () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", workspaceId],
      });
    });

    socketRef.current.on("project:created", () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", workspaceId],
      });
    });

    socketRef.current.on("user:joined", () => {
      queryClient.invalidateQueries({
        queryKey: ["members", workspaceId],
      });
    });

    return () => {
      socketRef.current?.emit("leave:workspace", workspaceId);
      socketRef.current?.disconnect();
    };
  }, [workspaceId, token, queryClient]);

  return socketRef.current;
};
