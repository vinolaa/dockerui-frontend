import { ContainerDTO } from "@/lib/containers/types";


export async function getContainers(): Promise<ContainerDTO[]> {
    const res = await fetch('http://localhost:8080/api/docker/containers', {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Erro ao buscar containers");

    return res.json();
}
