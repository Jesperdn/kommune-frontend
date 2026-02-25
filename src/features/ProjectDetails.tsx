import useSWR from "swr";
import { useParams, Link } from "react-router";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { ProjectCostSummary, Expense } from "@/types/api";
import { fetcher, formatCurrency } from "@/lib/utils";

const ProjectDetails = () => {
    const { id } = useParams();
    const { data: costs } = useSWR<ProjectCostSummary>(`/api/projects/${id}/costs`, fetcher);
    const { data: expenses = [] } = useSWR<Expense[]>(`/api/expenses?projectId=${id}`, fetcher);

    return (
        <div>
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
                &larr; Tilbake til oversikt
            </Link>

            <h1 className="text-3xl font-bold mt-4 mb-2">
                {costs?.projectName ?? "Laster..."}
            </h1>

            {costs && (
                <p className="text-2xl font-semibold mb-8">
                    Total: {formatCurrency(costs.totalCost)}
                </p>
            )}

            {costs && costs.customers.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Kundefordeling</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {costs.customers.map((customer) => (
                            <Card key={customer.customerId}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{customer.customerName}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold">
                                        {formatCurrency(customer.cost)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {customer.percentage}%
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            <h2 className="text-xl font-semibold mb-4">Utgifter ({expenses.length})</h2>
            <div className="space-y-2">
                {expenses.map((expense) => (
                    <Card key={expense.id}>
                        <CardContent className="flex justify-between items-center py-4">
                            <div>
                                <p className="font-medium">{expense.expenseType}</p>
                                <p className="text-sm text-muted-foreground">{expense.description}</p>
                            </div>
                            <p className="text-lg font-semibold">{formatCurrency(expense.amount)}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ProjectDetails;
