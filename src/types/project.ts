export type Project = {
    id: number;
    name: string;
    createdAt: string;
}

export type ProjectCostSummary =  {
    projectId: number;
    projectName: string;
    totalCost: number;
    customers: ProjectCustomerCost[];
}

export type ProjectCustomerCost = {
    customerId: number;
    customerName: string;
    percentage: number;
    cost: number;
}