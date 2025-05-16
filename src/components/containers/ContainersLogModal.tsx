"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContainerDTO } from "@/lib/containers/types";
import { toast } from "sonner";

interface ContainerLogsModalProps {
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
    container: ContainerDTO;
    logs: string;
    onRefreshLogsAction: () => Promise<void>;
}

export function ContainerLogsModal({
                                       open,
                                       onOpenChangeAction,
                                       container,
                                       logs,
                                       onRefreshLogsAction,
                                   }: ContainerLogsModalProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentMatch, setCurrentMatch] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefreshLogsAction();
        setIsRefreshing(false);
        toast.success("Logs atualizados com sucesso!");
    };

    const handleDownload = () => {
        const blob = new Blob([logs], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `logs-${container.name}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(logs);
            toast.success("Logs copiados para a área de transferência!");
        } catch {
            toast.error("Erro ao copiar os logs.");
        }
    };

    const matches = useMemo(() => {
        if (!searchTerm) return [];
        const regex = new RegExp(searchTerm, "gi");
        const result: { start: number; end: number }[] = [];
        let match;
        while ((match = regex.exec(logs)) !== null) {
            result.push({ start: match.index, end: match.index + match[0].length });
        }
        return result;
    }, [logs, searchTerm]);

    const highlightedLogs = useMemo(() => {
        if (!searchTerm || matches.length === 0) return logs;

        let offset = 0;
        let highlighted = logs;

        matches.forEach((match, index) => {
            const before = highlighted.slice(0, match.start + offset);
            const middle = highlighted.slice(match.start + offset, match.end + offset);
            const after = highlighted.slice(match.end + offset);
            const className =
                index === currentMatch
                    ? "bg-yellow-500 text-black font-bold px-1"
                    : "bg-yellow-300 text-black px-1";
            const wrapped = `<mark class="${className}">${middle}</mark>`;
            highlighted = before + wrapped + after;
            offset += wrapped.length - middle.length;
        });

        return highlighted;
    }, [logs, matches, currentMatch, searchTerm]);

    const goToMatch = (direction: "prev" | "next") => {
        if (!matches.length) return;
        if (direction === "next") {
            setCurrentMatch((prev) => (prev + 1) % matches.length);
        } else {
            setCurrentMatch((prev) => (prev - 1 + matches.length) % matches.length);
        }
    };

    useEffect(() => {
        if (containerRef.current) {
            const highlighted = containerRef.current.querySelectorAll("mark");
            if (highlighted[currentMatch]) {
                (highlighted[currentMatch] as HTMLElement).scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }
    }, [currentMatch, highlightedLogs]);

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="w-full max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="text-blue-700">
                        Logs de {container.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Saída completa do container. Logs atualizados em tempo real não são exibidos.
                    </DialogDescription>
                </DialogHeader>

                <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center">
                    <Input
                        placeholder="Buscar nos logs..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentMatch(0);
                        }}
                        className="text-sm md:w-1/2"
                    />

                    {matches.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          {currentMatch + 1} de {matches.length}
                        </span>
                            <Button variant="outline" size="sm" onClick={() => goToMatch("prev")}>
                                ⬅️
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => goToMatch("next")}>
                                ➡️
                            </Button>
                        </div>
                    )}

                    {searchTerm && matches.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">
                            Nenhum resultado encontrado.
                        </p>
                    )}

                </div>

                <ScrollArea className="h-[60vh] w-full rounded-md border bg-black text-green-400 text-sm font-mono whitespace-pre overflow-auto">
                    <div
                        ref={containerRef}
                        className="p-3"
                        dangerouslySetInnerHTML={{ __html: highlightedLogs || "Carregando..." }}
                    />
                </ScrollArea>

                <DialogFooter className="pt-4 flex flex-wrap justify-between gap-2">
                    <div className="flex gap-2 flex-wrap">
                        <Button variant="secondary" onClick={handleRefresh} disabled={isRefreshing}>
                            {isRefreshing ? <SpinnerIcon size={4} /> : "Atualizar"}
                        </Button>
                        <Button variant="outline" onClick={handleCopy}>
                            Copiar logs
                        </Button>
                        <Button variant="outline" onClick={handleDownload}>
                            Baixar .txt
                        </Button>
                    </div>
                    <Button onClick={() => onOpenChangeAction(false)}>Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function SpinnerIcon({ size = 4 }: { size?: number }) {
    return (
        <svg className={`animate-spin inline mr-2 h-${size} w-${size}`} viewBox="0 0 24 24">
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
            />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
    );
}
