"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ContainerDTO } from "@/lib/containers/types";
import { ContainerStatusBadge } from "./ContainerStatusBadge";
import { ContainerRenameModal } from "./ContainerRenameModal";
import { ContainerActions } from "./ContainerActions";
import { Pencil1Icon } from "@radix-ui/react-icons";

interface Props {
    container: ContainerDTO;
    onContainerUpdatedAction: () => void;
}

export function ContainerCard({ container, onContainerUpdatedAction }: Props) {
    const [renameOpen, setRenameOpen] = useState(false);
    const cleanName = container.name.replace(/^\/+/, "");

    return (
        <>
            <Card className="bg-white shadow-md border-blue-100">
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-blue-700">{cleanName}</h2>
                            <button
                                type="button"
                                aria-label="Editar nome"
                                className="p-1 rounded hover:bg-blue-100"
                                onClick={() => setRenameOpen(true)}
                            >
                                <Pencil1Icon className="w-4 h-4 text-blue-600" />
                            </button>
                        </div>
                        <ContainerStatusBadge state={container.state} />
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

                    <ContainerActions container={container} onUpdatedAction={onContainerUpdatedAction} />
                </CardContent>
            </Card>

            <ContainerRenameModal
                containerId={container.id}
                defaultName={cleanName}
                open={renameOpen}
                onCloseAction={() => setRenameOpen(false)}
                onRenamedAction={onContainerUpdatedAction}
            />
        </>
    );
}
