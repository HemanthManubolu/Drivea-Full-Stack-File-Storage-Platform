import { Loader2Icon } from "lucide-react";

export function Spinner({ size = "md", className = "text-orange-500" }) {
    const sizes = {
        sm: "size-4",
        md: "size-6",
        lg: "size-10",
    };

    return <Loader2Icon className={`animate-spin ${sizes[size]} ${className}`} />;
}
