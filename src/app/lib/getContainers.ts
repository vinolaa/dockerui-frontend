export interface PortBinding {
    ip: string | null;
    privatePort: number | null;
    publicPort: number | null;
    type: string | null;
}

export interface ContainerDTO {
    id: string;
    name: string;
    image: string;
    state: string;
    status: string;
    ports: PortBinding[];
}

export async function getContainers(): Promise<ContainerDTO[]> {
    const res = await fetch('http://localhost:8080/api/docker/containers', {
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Erro ao buscar containers");

    return res.json();
}
