"use client";

import { useState } from "react";
import { useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContainerDTO } from "@/app/lib/getContainers";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";

interface Props {
    container: ContainerDTO;
}

export function ContainerCard({ container }: Props) {
    const [isPending, startTransition] = useTransition();
    const [pendingAction, setPendingAction] = useState<"start" | "stop" | null>(null);

    const [renameOpen, setRenameOpen] = useState(false);
    const [newName, setNewName] = useState(container.name.replace(/^\/+/, ""));
    const [isRenaming, setIsRenaming] = useState(false);


    const handleAction = async (action: "start" | "stop") => {
        setPendingAction(action);
        startTransition(async () => {
            const res = await fetch(
                `http://localhost:8080/api/docker/${container.id}/${action}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    }
                }
            );
            if (res.ok) {
                toast.success(`Container ${action}ed com sucesso!`);
                setTimeout(() => {
                    window.location.reload();
                }, 1200);
            } else {
                toast.error(`Erro ao tentar ${action} o container.`);
                setPendingAction(null);
            }
        });
    };

    const handleRename = async () => {
        setIsRenaming(true);
        const res = await fetch(
            `http://localhost:8080/api/docker/${container.id}/rename/${encodeURIComponent(newName)}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        );
        setIsRenaming(false);
        if (res.ok) {
            toast.success("Nome alterado com sucesso!");
            setRenameOpen(false);
            setTimeout(() => window.location.reload(), 1200);
        } else {
            toast.error("Erro ao alterar o nome do container.");
        }
    };

    const isRunning = container.state === "running";

    return (
        <>
            <Card className="bg-white shadow-md border-blue-100">
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-blue-700">
                                {container.name.replace(/^\/+/, "")}
                            </h2>
                            <button
                                type="button"
                                aria-label="Editar nome"
                                className="p-1 rounded hover:bg-blue-100"
                                onClick={() => {
                                    setNewName(container.name.replace(/^\/+/, ""));
                                    setRenameOpen(true);
                                }}
                            >
                                <Pencil1Icon className="w-4 h-4 text-blue-600" />
                            </button>
                        </div>
                        <Badge variant="outline" className="text-sm text-blue-600 border-blue-300">
                            {container.state.toUpperCase()}
                        </Badge>
                    </div>

                    <p className="text-sm text-gray-700">Status: {container.status}</p>

                    {container.ports.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Portas:</p>
                            <ul className="text-sm text-gray-800 list-disc pl-5">
                                {container.ports.map((port, i) => (
                                    <li key={i}>
                                        {port.ip ?? "0.0.0.0"}:{port.publicPort} → {port.privatePort} ({port.type})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex gap-2 pt-2 flex-wrap">
                        {!isRunning && (
                            <Button
                                variant="default"
                                disabled={isPending}
                                onClick={() => handleAction("start")}
                            >
                                {isPending && pendingAction === "start" ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 mr-2 inline" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Starting...
                                    </>
                                ) : (
                                    "Start"
                                )}
                            </Button>
                        )}
                        {isRunning && (
                            <Button
                                variant="destructive"
                                disabled={isPending}
                                onClick={() => handleAction("stop")}
                            >
                                {isPending && pendingAction === "stop" ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 mr-2 inline" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Stopping...
                                    </>
                                ) : (
                                    "Stop"
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Rename Modal */}
            <Dialog open={renameOpen} onOpenChange={open => setRenameOpen(open)}>
                <DialogContent className="flex flex-col items-center gap-4">
                    <DialogTitle>Alterar nome do container</DialogTitle>
                    <Input
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        disabled={isRenaming}
                        className="w-full"
                        autoFocus
                    />
                    <div className="flex gap-2 w-full justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setRenameOpen(false)}
                            disabled={isRenaming}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleRename}
                            disabled={isRenaming || !newName.trim() || newName === container.name}
                        >
                            {isRenaming ? (
                                <svg className="animate-spin h-4 w-4 mr-2 inline" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            ) : null}
                            Alterar Nome
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Action Modal */}
            <Dialog open={isPending}>
                <DialogContent className="flex flex-col items-center gap-4 pointer-events-auto">
                    <DialogTitle className="sr-only">
                        {pendingAction === "start" ? "Starting container" : "Stopping container"}
                    </DialogTitle>
                    <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span className="text-lg font-medium text-blue-700">
                        {pendingAction === "start"
                            ? "Starting container..."
                            : pendingAction === "stop"
                                ? "Stopping container..."
                                : "Processing..."}
                    </span>
                </DialogContent>
            </Dialog>
        </>
    );
}