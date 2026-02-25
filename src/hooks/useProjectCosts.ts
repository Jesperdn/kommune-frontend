import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import type { ProjectCostSummary } from "@/types/project";

export const useProjectCosts = (projectId: string) => useSWR<ProjectCostSummary>(`/api/projects/${projectId}/costs`, fetcher);
