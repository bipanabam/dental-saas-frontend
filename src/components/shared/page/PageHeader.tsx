import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: React.ReactNode;
}

const PageHeader = ({ title, description, icon: Icon, actions }: Props) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <Icon className="h-8 w-8 text-brand-700" />

          <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
          {description}
        </p>
      </div>

      {actions}
    </div>
  );
};

export default PageHeader;
