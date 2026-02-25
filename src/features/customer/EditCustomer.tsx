import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useCustomer } from "@/hooks/useCustomers";

const EditCustomer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: customer } = useCustomer(id!);
    const [name, setName] = useState("");

    useEffect(() => {
        if (customer) setName(customer.name);
    }, [customer]);

    const handleDelete = async () => {
        if (!confirm("Er du sikker på at du vil slette denne kunden?")) return;
        const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
        if (res.ok) {
            navigate("/");
        }
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        const res = await fetch(`/api/customers/${id}`, {
            method: "PUT",
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
                    <CardTitle>Rediger kunde</CardTitle>
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
                            <Button type="submit" disabled={!name.trim() || name === customer?.name}>
                                Lagre
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/">Avbryt</Link>
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

export default EditCustomer;
