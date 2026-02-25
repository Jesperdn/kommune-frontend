import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useParams, Link } from "react-router";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { ProjectCostSummary, Expense, Customer } from "@/types/api";
import { fetcher, formatCurrency } from "@/lib/utils";

const ProjectDetails = () => {
    const { id } = useParams();
    const { data: costs } = useSWR<ProjectCostSummary>(`/api/projects/${id}/costs`, fetcher);
    const { data: expenses = [] } = useSWR<Expense[]>(`/api/expenses?projectId=${id}`, fetcher);
    const { data: customers = [] } = useSWR<Customer[]>("/api/customers", fetcher);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

    const assignedCustomerIds = new Set(costs?.customers.map((c) => c.customerId) ?? []);
    const availableCustomers = customers.filter((c) => !assignedCustomerIds.has(c.id));

    const handleAssign = async () => {
        if (!selectedCustomerId) return;
        const res = await fetch(`/api/projects/${id}/customers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId: Number(selectedCustomerId) }),
        });
        if (res.ok) {
            setSelectedCustomerId("");
            await mutate(`/api/projects/${id}/costs`);
            await mutate("/api/costs/per-customer");
        }
    };

    return (
        <div>
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
                &larr; Tilbake til oversikt
            </Link>

            <div className="mt-4 mb-8">
                <h1 className="text-3xl font-bold">
                    {costs?.projectName ?? "Laster..."}
                </h1>
                {costs && (
                    <p className="text-lg text-muted-foreground mt-1">
                        Total: {formatCurrency(costs.totalCost)}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Kundefordeling</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {costs && costs.customers.length > 0 && (
                            <div className="divide-y">
                                {costs.customers.map((customer) => (
                                    <div key={customer.customerId} className="flex justify-between items-center py-3">
                                        <div>
                                            <p className="font-medium">{customer.customerName}</p>
                                            <p className="text-sm text-muted-foreground">{customer.percentage}%</p>
                                        </div>
                                        <p className="text-lg font-semibold">{formatCurrency(customer.cost)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {costs && costs.customers.length === 0 && (
                            <p className="text-sm text-muted-foreground">Ingen kunder tilordnet ennå.</p>
                        )}
                        {availableCustomers.length > 0 && (
                            <div className="flex gap-2 items-center mt-4">
                                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Velg kunde..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCustomers.map((customer) => (
                                            <SelectItem key={customer.id} value={String(customer.id)}>
                                                {customer.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAssign} disabled={!selectedCustomerId}>
                                    Tilordne
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Utgifter ({expenses.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                            {expenses.map((expense) => (
                                <div key={expense.id} className="flex justify-between items-center py-3">
                                    <div>
                                        <p className="font-medium">{expense.expenseType}</p>
                                        <p className="text-sm text-muted-foreground">{expense.description}</p>
                                    </div>
                                    <p className="text-lg font-semibold">{formatCurrency(expense.amount)}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProjectDetails;
