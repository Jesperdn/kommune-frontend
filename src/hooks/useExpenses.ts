import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import type { Expense } from "@/types/expense";

export const useExpenses = () => useSWR<Expense[]>("/api/expenses", fetcher);

export const useProjectExpenses = (projectId: string) => useSWR<Expense[]>(`/api/expenses?projectId=${projectId}`, fetcher);
