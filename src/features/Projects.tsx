import useSWR from "swr";
import { Link } from "react-router";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Project, Expense } from "@/types/api";
import { fetcher, formatCurrency } from "@/lib/utils";

const Projects = () => {
    const { data: projects = [] } = useSWR<Project[]>("/api/projects", fetcher);
    const { data: expenses = [] } = useSWR<Expense[]>("/api/expenses", fetcher);

    const totalByProject = (projectId: number) =>
        expenses
            .filter((e) => e.projectId === projectId)
            .reduce((sum, e) => sum + e.amount, 0);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Prosjektoversikt</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <Link key={project.id} to={`/projects/${project.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Projects;
