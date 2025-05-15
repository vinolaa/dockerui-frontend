import { ContainerListClient } from "@/components/containers/ContainerListClient";

export default function ContainersPage() {
    return (
        <main className="min-h-screen bg-blue-50 py-10 px-6">
            <h1 className="text-2xl font-bold text-blue-800 mb-6">Containers Docker</h1>
            <ContainerListClient />
        </main>
    );
}
