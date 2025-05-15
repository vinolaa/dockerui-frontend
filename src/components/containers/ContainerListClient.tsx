"use client";

import { useEffect, useState } from "react";
import { ContainerCard } from "./ContainerCard";
import { ContainerDTO } from "@/lib/containers/types";

export function ContainerListClient() {
    const [containers, setContainers] = useState<ContainerDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchContainers = async () => {
        const res = await fetch("http://localhost:8080/api/docker/containers");
        const data = await res.json();
        setContainers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchContainers();
    }, []);

    if (loading) return <p className="text-blue-600">Carregando containers...</p>;

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {containers.map((container) => (
                <ContainerCard
                    key={container.id}
                    container={container}
                    onContainerUpdatedAction={fetchContainers}
                />
            ))}
        </div>
    );
}
