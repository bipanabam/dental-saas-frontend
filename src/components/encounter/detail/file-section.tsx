import { FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { InvestigationOut } from "@/lib/api";

export default function FilesSection({ investigations }: { investigations: InvestigationOut[] }) {
    const files = investigations.filter((inv) => !!inv.result_file_url);

    if (files.length === 0) return null;

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                    Investigation Attachments
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {files.map((inv) => (
                        <a
                            key={inv.id}
                            href={inv.result_file_url as string}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3 hover:bg-slate-50 transition-colors"
                        >
                            <FileText className="h-4 w-4 text-brand-600" />
                            <span className="text-sm font-medium text-slate-700">{inv.investigation_name}</span>
                        </a>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}