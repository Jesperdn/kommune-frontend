import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {formatCurrency} from "@/lib/utils.ts";

type Props = {
    grandTotal: number;
}

export const TotalCost = ({grandTotal} :Props) => {

    return <Card className={"max-w-[400px] gap-1"}>
        <CardHeader>
            <CardTitle>Totale utgifter:</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-xl font-semibold">{formatCurrency(grandTotal)}</p>
        </CardContent>
    </Card>
}