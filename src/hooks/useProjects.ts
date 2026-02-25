import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import type { Project } from "@/types/project";

export const useProjects = () => useSWR<Project[]>("/api/projects", fetcher);

export const useProject = (id: string) => useSWR<Project>(`/api/projects/${id}`, fetcher);
