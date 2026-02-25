import useSWR from "swr";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Project, Expense } from "@/types/api";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("nb-NO", {
        style: "currency",
        currency: "NOK",
        minimumFractionDigits: 0,
    }).format(amount);

const App = () => {
    const { data: projects = [] } = useSWR<Project[]>("/api/projects", fetcher);
    const { data: expenses = [] } = useSWR<Expense[]>("/api/expenses", fetcher);

    const totalByProject = (projectId: number) =>
        expenses
            .filter((e) => e.projectId === projectId)
            .reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="min-h-screen bg-background p-8">
            <h1 className="text-3xl font-bold mb-8">Prosjektoversikt</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">
                                {formatCurrency(totalByProject(project.id))}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {expenses.filter((e) => e.projectId === project.id).length}{" "}
                                utgifter
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default App;
