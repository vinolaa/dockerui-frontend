"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { ContainerDTO } from "@/lib/containers/types";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Props {
    container: ContainerDTO;
    onUpdatedAction: () => void;
}

export function ContainerActions({ container, onUpdatedAction }: Props) {
    const [isPending, startTransition] = useTransition();
    const [action, setAction] = useState<"start" | "stop" | null>(null);
    const isRunning = container.state === "running";

    const handleAction = (act: "start" | "stop") => {
        setAction(act);
        startTransition(async () => {
            const res = await fetch(`http://localhost:8080/api/docker/${container.id}/${act}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            if (res.ok) {
                toast.success(`Container ${act}ed com sucesso!`);
                onUpdatedAction();
            } else {
                toast.error(`Erro ao ${act} o container.`);
            }

            setAction(null);
        });
    };

    return (
        <>
            <div className="flex gap-2 pt-2 flex-wrap">
                {!isRunning && (
                    <Button variant="default" disabled={isPending} onClick={() => handleAction("start")}>
                        {isPending && action === "start" ? <SpinnerIcon /> : "Start"}
                    </Button>
                )}

                {isRunning && (
                    <Button variant="destructive" disabled={isPending} onClick={() => handleAction("stop")}>
                        {isPending && action === "stop" ? <SpinnerIcon /> : "Stop"}
                    </Button>
                )}
            </div>

            <Dialog open={isPending}>
                <DialogContent className="flex flex-col items-center gap-4">
                    <DialogTitle className="sr-only">
                        {action === "start" ? "Iniciando" : "Parando"}...
                    </DialogTitle>
                    <SpinnerIcon size={8} />
                    <span className="text-lg font-medium text-blue-700">
            {action === "start" ? "Starting..." : "Stopping..."}
          </span>
                </DialogContent>
            </Dialog>
        </>
    );
}

function SpinnerIcon({ size = 4 }: { size?: number }) {
    return (
        <svg className={`animate-spin inline mr-2 h-${size} w-${size}`} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
    );
}
