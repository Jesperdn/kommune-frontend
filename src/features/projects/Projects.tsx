import { Link } from "react-router";
import { ChevronRight, Plus } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { formatCurrency } from "@/lib/utils.ts";
import { useProjects } from "@/hooks/useProjects.ts";
import { useExpenses } from "@/hooks/useExpenses.ts";
import { useCustomers, useCustomerCosts } from "@/hooks/useCustomers.ts";
import {TotalCost} from "@/features/projects/TotalCost.tsx";

const Projects = () => {
    const { data: projects = [] } = useProjects();
    const { data: expenses = [] } = useExpenses();
    const { data: customerCosts = [] } = useCustomerCosts();
    const { data: customers = [] } = useCustomers();
    const totalByProject = (projectId: number) =>
        expenses
            .filter((e) => e.projectId === projectId)
            .reduce((sum, e) => sum + e.amount, 0);

    const grandTotal = projects.reduce((sum, p) => sum + totalByProject(p.id), 0);

    return (
        <div className="flex flex-col gap-4">
            <TotalCost grandTotal={grandTotal} />
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
                    </CardContent>
                </Card>
                <Card className="self-start">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Kunder</CardTitle>
                        <Button asChild size="sm">
                            <Link to="/customers/new"><Plus className="size-4" /> Ny kunde</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y">
                            {customers.map((customer) => (
                                <Link
                                    key={customer.id}
                                    to={`/customers/${customer.id}`}
                                    className="flex justify-between items-center py-3 hover:bg-muted -mx-2 px-2 rounded transition-colors group"
                                >
                                    <p className="font-medium">{customer.name}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-semibold">
                                            {formatCurrency(customerCosts.find((c) => c.customerId === customer.id)?.totalCost || 0)}
                                        </p>
                                        <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Projects;
