'use client';

import {
    LayoutDashboard,
    Box,
    Layers,
    Settings,
    TerminalSquare,
    ScrollText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const menuItems = [
    {
        title: "Containers",
        items: [
            { label: "Listar", href: "/containers", icon: LayoutDashboard },
            { label: "Criar", href: "/containers/create", icon: TerminalSquare },
            { label: "Logs", href: "/containers/logs", icon: ScrollText },
        ],
    },
    {
        title: "Imagens",
        items: [
            { label: "Listar", href: "/containers/images", icon: Box },
        ],
    },
    {
        title: "Volumes e Redes",
        items: [
            { label: "Volumes", href: "/containers/volumes", icon: Layers },
        ],
    },
    {
        title: "Administração",
        items: [
            { label: "Configurações", href: "/containers/settings", icon: Settings },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-full border-r bg-background p-4">
            <div className="text-2xl font-bold mb-6">Docker Manager</div>
            <ScrollArea className="h-full pr-2">
                {menuItems.map((section, idx) => (
                    <div key={idx} className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2 font-medium">
                            {section.title}
                        </p>
                        <nav className="flex flex-col gap-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-muted text-primary"
                                                : "text-muted-foreground hover:bg-accent"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        {idx < menuItems.length - 1 && (
                            <Separator className="my-4" />
                        )}
                    </div>
                ))}
            </ScrollArea>
        </aside>
    );
}
