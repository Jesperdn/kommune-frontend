import {Link} from "react-router";

export const BackArrow = () => {
    return (
        <Link to="/" className="text-sm text-muted-foreground hover:underline">
            &larr; Tilbake til oversikt
        </Link>
    )
}