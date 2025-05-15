"use client";

import { useEffect, useState } from "react";
import { ContainerCard } from "./ContainerCard";
import { ContainerDTO } from "@/lib/containers/types";
import { motion } from "framer-motion";

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
        fetchContainers().catch((err) => {
            console.error("Erro ao buscar containers:", err);
            setLoading(false);
        })
    }, []);

    if (loading) return <p className="text-blue-600">Carregando containers...</p>;

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {containers.map((container) => (
                <motion.div
                    key={container.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <ContainerCard
                        key={container.id}
                        container={container}
                        onContainerUpdatedAction={fetchContainers}
                    />
                </motion.div>
            ))}
        </div>
    );
}
