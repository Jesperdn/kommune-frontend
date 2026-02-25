import useSWR from "swr";
import { Link } from "react-router";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Project, Expense, CustomerCostSummary } from "@/types/api";
import { fetcher, formatCurrency } from "@/lib/utils";

const Projects = () => {
    const { data: projects = [] } = useSWR<Project[]>("/api/projects", fetcher);
    const { data: expenses = [] } = useSWR<Expense[]>("/api/expenses", fetcher);
    const { data: customerCosts = [] } = useSWR<CustomerCostSummary[]>("/api/costs/per-customer", fetcher);

    const totalByProject = (projectId: number) =>
        expenses
            .filter((e) => e.projectId === projectId)
            .reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Prosjekter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                                className="flex justify-between items-center py-3 hover:bg-muted -mx-2 px-2 rounded transition-colors"
                            >
                                <div>
                                    <p className="font-medium">{project.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {expenses.filter((e) => e.projectId === project.id).length} utgifter
                                    </p>
                                </div>
                                <p className="text-lg font-semibold">
                                    {formatCurrency(totalByProject(project.id))}
                                </p>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Kunder</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {customerCosts.map((customer) => (
                            <div key={customer.customerId} className="flex justify-between items-center py-3">
                                <p className="font-medium">{customer.customerName}</p>
                                <p className="text-lg font-semibold">
                                    {formatCurrency(customer.totalCost)}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Projects;
