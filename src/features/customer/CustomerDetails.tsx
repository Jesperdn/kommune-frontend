import { useParams, Link } from "react-router";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Pencil } from "lucide-react";
import { formatCurrency } from "@/lib/utils.ts";
import { useCustomer, useCustomerCosts, useCustomerProjectCosts } from "@/hooks/useCustomers.ts";
import {BackArrow} from "@/components/BackArrow.tsx";

const CustomerDetails = () => {
    const { id } = useParams();
    const { data: customer } = useCustomer(id!);
    const { data: customerCosts = [] } = useCustomerCosts();
    const { data: projectCosts = [] } = useCustomerProjectCosts();

    const totalCost = customerCosts.find((c) => c.customerId === Number(id))?.totalCost ?? 0;
    const customerProjects = projectCosts.filter((c) => c.customerId === Number(id));

    return (
        <div>
            <BackArrow />

            <div className="mt-4 mb-8 flex flex-col gap-2">
                <div className="flex justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold">
                        {customer?.name ?? "Laster..."}
                    </h1>
                    <Button variant="outline" size="sm" asChild>
                        <Link to={`/customers/${id}/edit`}><Pencil className="size-4" /> Rediger</Link>
                    </Button>
                </div>
                <p className="text-lg text-muted-foreground mt-1">
                    Total kostnad: {formatCurrency(totalCost)}
                </p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Prosjekter</CardTitle>
                </CardHeader>
                <CardContent>
                    {customerProjects.length > 0 ? (
                        <div className="divide-y">
                            {customerProjects.map((cp) => (
                                <Link
                                    key={cp.projectId}
                                    to={`/projects/${cp.projectId}`}
                                    className="flex justify-between items-center py-3 hover:bg-muted -mx-2 px-2 rounded transition-colors"
                                >
                                    <div>
                                        <p className="font-medium">{cp.projectName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {cp.percentage}% av {formatCurrency(cp.projectTotal)}
                                        </p>
                                    </div>
                                    <p className="text-lg font-semibold">
                                        {formatCurrency(cp.customerCost)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Ingen prosjekter tilknyttet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CustomerDetails;
