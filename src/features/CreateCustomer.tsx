import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CreateCustomer = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        const res = await fetch("/api/customers", {
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
                    <CardTitle>Ny kunde</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Kundenavn"
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

export default CreateCustomer;
