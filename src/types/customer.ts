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