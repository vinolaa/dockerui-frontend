import { Sidebar } from "@/components/Sidebar";
import type { ReactNode } from "react";

export default function ContainersLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto p-6 bg-muted">
                {children}
            </main>
        </div>
    );
}
