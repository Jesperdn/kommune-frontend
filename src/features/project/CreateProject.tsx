import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { apiUrl } from "@/lib/utils.ts";

const CreateProject = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        const res = await fetch(apiUrl("/api/projects"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.trim() }),
        });
        if (res.ok) {
            navigate("/");
        }
    };

    return (
        <div>
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
                &larr; Tilbake til oversikt
            </Link>

            <Card className="mt-4 max-w-lg">
                <CardHeader>
                    <CardTitle>Nytt prosjekt</CardTitle>
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
                            <Button type="submit" disabled={!name.trim()}>
                                Opprett
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/">Avbryt</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateProject;
