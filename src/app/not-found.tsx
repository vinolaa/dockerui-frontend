import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4 text-center">
            <ExclamationTriangleIcon className="w-16 h-16 text-blue-700 mb-4" />
            <h1 className="text-4xl font-bold text-blue-800 mb-2">Página não encontrada</h1>
            <p className="text-gray-700 mb-6">
                A página que você tentou acessar não existe ou foi removida.
            </p>
            <Link href="/containers">
                <Button variant="default">Voltar para o início</Button>
            </Link>
        </div>
    );
}
