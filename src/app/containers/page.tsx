import { getContainers } from "@/app/lib/getContainers";
import { ContainerCard } from "@/components/ContainerCard";

export default async function ContainersPage() {
    const containers = await getContainers();

    return (
        <main className="min-h-screen bg-blue-50 py-10 px-6">
            <h1 className="text-2xl font-bold text-blue-800 mb-6">Containers Docker</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {containers.map((container) => (
                    <ContainerCard key={container.id} container={container} />
                ))}
            </div>
        </main>
    );
}
