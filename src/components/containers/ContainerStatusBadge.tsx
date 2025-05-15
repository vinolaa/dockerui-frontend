import { Badge } from "@/components/ui/badge";

export function ContainerStatusBadge({ state }: { state: string }) {
    const colorMap: Record<string, string> = {
        running: "text-green-600 border-green-300",
        exited: "text-red-600 border-red-300",
        paused: "text-yellow-600 border-yellow-300",
    };

    const className = colorMap[state] ?? "text-blue-600 border-blue-300";

    return (
        <Badge variant="outline" className={`text-sm ${className}`}>
            {state.toUpperCase()}
        </Badge>
    );
}
