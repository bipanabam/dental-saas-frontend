import { LucideIcon } from "lucide-react";

interface Props {
    title: string;
    description: string;
    icon?: LucideIcon;
    actions?: React.ReactNode;
}

const SettingsHeader = ({ title, description, icon: Icon, actions }: Props) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    {Icon &&
                        <Icon className="h-5 w-5 text-brand-700" />
                        }
                    <h1 className="text-lg font-black text-slate-800 tracking-tight">{title}</h1>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                {description}
                </p>
            </div>
            {actions}
        </div>
    );
};

export default SettingsHeader;
