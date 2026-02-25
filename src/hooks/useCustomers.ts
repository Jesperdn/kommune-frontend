import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import type { Customer } from "@/types/customer";
import type { CustomerCostSummary } from "@/types/customer";

export const useCustomers = () => useSWR<Customer[]>("/api/customers", fetcher);

export const useCustomer = (id: string) => useSWR<Customer>(`/api/customers/${id}`, fetcher);

export const useCustomerCosts = () => useSWR<CustomerCostSummary[]>("/api/costs/per-customer", fetcher);
