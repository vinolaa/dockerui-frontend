"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
    containerId: string;
    defaultName: string;
    open: boolean;
    onCloseAction: () => void;
    onRenamedAction: () => void;
}

export function ContainerRenameModal({ containerId, defaultName, open, onCloseAction, onRenamedAction }: Props) {
    const [newName, setNewName] = useState(defaultName);
    const [isRenaming, setIsRenaming] = useState(false);

    const handleRename = async () => {
        setIsRenaming(true);
        const res = await fetch(`http://localhost:8080/api/docker/${containerId}/rename/${encodeURIComponent(newName)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        setIsRenaming(false);

        if (res.ok) {
            toast.success("Nome alterado com sucesso!");
            onCloseAction();
            onRenamedAction();
        } else {
            toast.error("Erro ao renomear container.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onCloseAction}>
            <DialogContent className="flex flex-col items-center gap-4">
                <DialogTitle>Alterar nome do container</DialogTitle>
                <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    disabled={isRenaming}
                    autoFocus
                    className="w-full"
                />
                <div className="flex gap-2 w-full justify-end">
                    <Button variant="outline" onClick={onCloseAction} disabled={isRenaming}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleRename}
                        disabled={isRenaming || !newName.trim() || newName === defaultName}
                    >
                        {isRenaming ? <SpinnerIcon /> : "Alterar Nome"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function SpinnerIcon() {
    return (
        <svg className="animate-spin h-4 w-4 mr-2 inline" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
    );
}
