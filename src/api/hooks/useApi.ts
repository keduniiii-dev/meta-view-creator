import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDemoRequest } from "@/api/demo";
import { getCurrentUser, login, logout } from "@/api/auth";

export const useAuth = () => ({
  useCurrentUser: () =>
    useQuery({
      queryKey: ["auth", "me"],
      queryFn: getCurrentUser,
      retry: false,
    }),
  useLogin: () =>
    useMutation({
      mutationFn: login,
    }),
  useLogout: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: logout,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      },
    });
  },
});

export const useDemo = () => ({
  useCreateDemoRequest: () =>
    useMutation({
      mutationFn: createDemoRequest,
    }),
});
