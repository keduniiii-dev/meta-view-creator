import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWeeklyAnalytics, getFunnelAnalytics, getKpis } from "@/crm/api/analytics";
import { getLeads, createLead, updateLead, deleteLead, assignLead } from "@/crm/api/leads";
import { getBids, createBid, updateBid, deleteBid } from "@/crm/api/bids";
import { getCampaignStats, getCampaigns, createCampaign, updateCampaign, deleteCampaign } from "@/crm/api/campaigns";
import { getProjects, createProject, updateProject, deleteProject } from "@/crm/api/projects";
import { getPipelineData } from "@/crm/api/pipeline";
import { createDemoRequest } from "@/crm/api/demo";
import { login, logout, getCurrentUser } from "@/crm/api/auth";

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

export const useAnalytics = () => ({
  useWeeklyAnalytics: () =>
    useQuery({
      queryKey: ["analytics", "weekly"],
      queryFn: getWeeklyAnalytics,
    }),
  useFunnelAnalytics: () =>
    useQuery({
      queryKey: ["analytics", "funnel"],
      queryFn: getFunnelAnalytics,
    }),
  useKpis: () =>
    useQuery({
      queryKey: ["analytics", "kpis"],
      queryFn: getKpis,
    }),
});

export const useLeads = () => ({
  useLeads: () =>
    useQuery({
      queryKey: ["leads"],
      queryFn: getLeads,
    }),
  useCreateLead: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: createLead,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
    });
  },
  useUpdateLead: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }: { id: number | string; payload: Partial<ReturnType<typeof createLead> extends never ? never : never> }) => updateLead(id, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
    });
  },
  useDeleteLead: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id }: { id: number | string }) => deleteLead(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
    });
  },
  useAssignLead: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, assigneeId }: { id: number | string; assigneeId: string | number }) => assignLead(id, assigneeId),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
    });
  },
});

export const useBids = () => ({
  useBids: () =>
    useQuery({
      queryKey: ["bids"],
      queryFn: getBids,
    }),
  useCreateBid: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: createBid,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bids"] }),
    });
  },
  useUpdateBid: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }: { id: number | string; payload: Partial<ReturnType<typeof createBid> extends never ? never : never> }) => updateBid(id, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bids"] }),
    });
  },
  useDeleteBid: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id }: { id: number | string }) => deleteBid(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bids"] }),
    });
  },
});

export const useCampaigns = () => ({
  useCampaignStats: () =>
    useQuery({
      queryKey: ["campaigns", "stats"],
      queryFn: getCampaignStats,
    }),
  useCampaigns: () =>
    useQuery({
      queryKey: ["campaigns"],
      queryFn: getCampaigns,
    }),
  useCreateCampaign: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: createCampaign,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        queryClient.invalidateQueries({ queryKey: ["campaigns", "stats"] });
      },
    });
  },
  useUpdateCampaign: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }: { id: number | string; payload: Partial<ReturnType<typeof createCampaign> extends never ? never : never> }) => updateCampaign(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        queryClient.invalidateQueries({ queryKey: ["campaigns", "stats"] });
      },
    });
  },
  useDeleteCampaign: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id }: { id: number | string }) => deleteCampaign(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        queryClient.invalidateQueries({ queryKey: ["campaigns", "stats"] });
      },
    });
  },
});

export const useProjects = () => ({
  useProjects: () =>
    useQuery({
      queryKey: ["projects"],
      queryFn: getProjects,
    }),
  useCreateProject: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: createProject,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    });
  },
  useUpdateProject: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }: { id: number | string; payload: Partial<ReturnType<typeof createProject> extends never ? never : never> }) => updateProject(id, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    });
  },
  useDeleteProject: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id }: { id: number | string }) => deleteProject(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    });
  },
});

export const usePipeline = () => ({
  usePipelineData: () =>
    useQuery({
      queryKey: ["pipeline"],
      queryFn: getPipelineData,
    }),
});

export const useDemo = () => ({
  useCreateDemoRequest: () =>
    useMutation({
      mutationFn: createDemoRequest,
    }),
});
