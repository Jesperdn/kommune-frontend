import { useState, useEffect } from "react";
import useSWR from "swr";
import { useNavigate, useParams, Link } from "react-router";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { Project } from "@/types/project.ts";
import { fetcher } from "@/lib/utils.ts";

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: project } = useSWR<Project>(`/api/projects/${id}`, fetcher);
    const [name, setName] = useState("");

    useEffect(() => {
        if (project) setName(project.name);
    }, [project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        const res = await fetch(`/api/projects/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.trim() }),
        });
        if (res.ok) {
            navigate(`/projects/${id}`);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Er du sikker på at du vil slette dette prosjektet?")) return;
        const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
        if (res.ok) {
            navigate("/");
        }
    };

    return (
        <div>
            <Link to={`/projects/${id}`} className="text-sm text-muted-foreground hover:underline">
                &larr; Tilbake til prosjekt
            </Link>

            <Card className="mt-4 max-w-lg">
                <CardHeader>
                    <CardTitle>Rediger prosjekt</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Prosjektnavn"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button type="submit" disabled={!name.trim() || name === project?.name}>
                                Lagre
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to={`/projects/${id}`}>Avbryt</Link>
                            </Button>
                            <Button variant="destructive" type="button" onClick={handleDelete} className="ml-auto">
                                Slett
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditProject;
