import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useParams, Link } from "react-router";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Pencil, X } from "lucide-react";
import { fetcher, formatCurrency } from "@/lib/utils.ts";
import type {ProjectCostSummary} from "@/types/project.ts";
import type {Expense} from "@/types/expense.ts";
import type {Customer} from "@/types/customer.ts";

const ProjectDetails = () => {
    const { id } = useParams();
    const { data: costs } = useSWR<ProjectCostSummary>(`/api/projects/${id}/costs`, fetcher);
    const { data: expenses = [] } = useSWR<Expense[]>(`/api/expenses?projectId=${id}`, fetcher);
    const { data: customers = [] } = useSWR<Customer[]>("/api/customers", fetcher);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
    const [percentage, setPercentage] = useState<string>("100");

    const assignedCustomerIds = new Set(costs?.customers.map((c) => c.customerId) ?? []);
    const availableCustomers = customers.filter((c) => !assignedCustomerIds.has(c.id));

    const assignedPercentage = costs?.customers.reduce((sum, c) => sum + c.percentage, 0) ?? 0;
    const remainingPercentage = 100 - assignedPercentage;

    const revalidate = async () => {
        await mutate(`/api/projects/${id}/costs`);
        await mutate("/api/costs/per-customer");
    };

    const handleAssign = async () => {
        if (!selectedCustomerId || !percentage) return;
        const pct = Number(percentage);
        if (pct <= 0 || pct > remainingPercentage) return;
        const res = await fetch(`/api/projects/${id}/customers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId: Number(selectedCustomerId), percentage: pct }),
        });
        if (res.ok) {
            setSelectedCustomerId("");
            setPercentage(String(Math.min(100, remainingPercentage - pct)));
            await revalidate();
        }
    };

    const handleUpdatePercentage = async (customerId: number, newPercentage: number) => {
        const res = await fetch(`/api/projects/${id}/customers/${customerId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId, percentage: newPercentage }),
        });
        if (res.ok) await revalidate();
    };

    const handleRemoveCustomer = async (customerId: number) => {
        const res = await fetch(`/api/projects/${id}/customers/${customerId}`, {
            method: "DELETE",
        });
        if (res.ok) await revalidate();
    };

    return (
        <div>
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
                &larr; Tilbake til oversikt
            </Link>

            <div className="mt-4 mb-8 flex items-start justify-between">
                <h1 className="text-3xl font-bold">
                    {costs?.projectName ?? "Laster..."}
                </h1>
                <Button variant="outline" size="sm" asChild>
                    <Link to={`/projects/${id}/edit`}><Pencil className="size-4" /> Rediger</Link>
                </Button>
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
                                    <div key={customer.customerId} className="flex items-center gap-2 py-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{customer.customerName}</p>
                                            <p className="text-sm text-muted-foreground">{formatCurrency(customer.cost)}</p>
                                        </div>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={customer.percentage + remainingPercentage}
                                            defaultValue={customer.percentage}
                                            className="w-16 text-center"
                                            onBlur={(e) => {
                                                const val = Number(e.target.value);
                                                if (val > 0 && val !== customer.percentage) {
                                                    handleUpdatePercentage(customer.customerId, val);
                                                }
                                            }}
                                        />
                                        <span className="text-sm text-muted-foreground">%</span>
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={() => handleRemoveCustomer(customer.customerId)}
                                        >
                                            <X className="size-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {costs && costs.customers.length === 0 && (
                            <p className="text-sm text-muted-foreground">Ingen kunder tilordnet ennå.</p>
                        )}
                        {availableCustomers.length > 0 && remainingPercentage > 0 && (
                            <div className="mt-4 space-y-3 pt-4 border-t">
                                <p className="text-sm font-medium">
                                    Tilordne kunde ({remainingPercentage}% gjenstår)
                                </p>
                                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                                    <SelectTrigger>
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
                                <div className="flex gap-2 items-center">
                                    <Input
                                        type="number"
                                        min={1}
                                        max={remainingPercentage}
                                        value={percentage}
                                        onChange={(e) => setPercentage(e.target.value)}
                                        placeholder="Prosent"
                                    />
                                    <span className="text-sm text-muted-foreground shrink-0">%</span>
                                    <Button
                                        onClick={handleAssign}
                                        disabled={!selectedCustomerId || !percentage || Number(percentage) <= 0 || Number(percentage) > remainingPercentage}
                                        className="shrink-0"
                                    >
                                        Tilordne
                                    </Button>
                                </div>
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
