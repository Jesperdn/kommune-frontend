export interface Customer {
    id: number;
    name: string;
    createdAt: string;
}

export interface CustomerCostSummary {
    customerId: number;
    customerName: string;
    totalCost: number;
}

export interface Project {
    id: number;
    name: string;
    createdAt: string;
}

export interface Expense {
    id: number;
    projectId: number;
    expenseType: string;
    amount: number;
    description: string;
    createdAt: string;
}

export interface ProjectCostSummary {
    projectId: number;
    projectName: string;
    totalCost: number;
    customers: ProjectCustomerCost[];
}

export interface ProjectCustomerCost {
    customerId: number;
    customerName: string;
    percentage: number;
    cost: number;
}
