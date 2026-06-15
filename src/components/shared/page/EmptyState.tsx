import { SearchX } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon: Icon = SearchX,
}: {

  title: string;
  description: string;
  icon?: any;
}) {
  return (
    <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
      <Icon className="mx-auto mb-3 h-10 w-10 text-slate-400" />

      <h3>{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
      
    </div>
  );
}
