export type Customer =  {
    id: number;
    name: string;
    createdAt: string;
}

export type CustomerCostSummary =  {
    customerId: number;
    customerName: string;
    totalCost: number;
}

export type CustomerProjectCostSummary = {
    customerId: number;
    customerName: string;
    projectId: number;
    projectName: string;
    percentage: number;
    projectTotal: number;
    customerCost: number;
}