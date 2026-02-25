import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Link } from "react-router";
import { ChevronRight, Plus } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Project, Expense, CustomerCostSummary } from "@/types/api";
import { fetcher, formatCurrency } from "@/lib/utils";

const Projects = () => {
    const { data: projects = [] } = useSWR<Project[]>("/api/projects", fetcher);
    const { data: expenses = [] } = useSWR<Expense[]>("/api/expenses", fetcher);
    const { data: customerCosts = [] } = useSWR<CustomerCostSummary[]>("/api/costs/per-customer", fetcher);
    const [newCustomerName, setNewCustomerName] = useState("");

    const handleCreateCustomer = async () => {
        const name = newCustomerName.trim();
        if (!name) return;
        const res = await fetch("/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (res.ok) {
            setNewCustomerName("");
            await mutate("/api/customers");
            await mutate("/api/costs/per-customer");
        }
    };

    const totalByProject = (projectId: number) =>
        expenses
            .filter((e) => e.projectId === projectId)
            .reduce((sum, e) => sum + e.amount, 0);

    const grandTotal = projects.reduce((sum, p) => sum + totalByProject(p.id), 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Prosjekter</CardTitle>
                    <Button asChild size="sm">
                        <Link to="/projects/new"><Plus className="size-4" /> Nytt prosjekt</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                                className="flex justify-between items-center py-3 hover:bg-muted -mx-2 px-2 rounded transition-colors group"
                            >
                                <div>
                                    <p className="font-medium">{project.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {expenses.filter((e) => e.projectId === project.id).length} utgifter
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-semibold">
                                        {formatCurrency(totalByProject(project.id))}
                                    </p>
                                    <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </Link>
                        ))}
                    </div>
                    {projects.length > 0 && (
                        <div className="flex justify-between items-center pt-4 mt-4 border-t">
                            <p className="font-medium text-muted-foreground">Totalt</p>
                            <p className="text-lg font-semibold">{formatCurrency(grandTotal)}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card className="self-start">
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
                    <div className="flex gap-2 items-center mt-4">
                        <Input
                            value={newCustomerName}
                            onChange={(e) => setNewCustomerName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCreateCustomer()}
                            placeholder="Nytt kundenavn..."
                        />
                        <Button onClick={handleCreateCustomer} disabled={!newCustomerName.trim()}>
                            Legg til
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Projects;
