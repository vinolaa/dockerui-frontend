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
