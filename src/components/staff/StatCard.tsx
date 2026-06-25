import { Card, CardContent } from "@/components/ui/card";

const StatCard = ({
    icon,
    iconBg,
    title,
    value,
}: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    value: number;
}) => {
    return (
        <Card className="rounded-2xl border-slate-100 shadow-3xs bg-white overflow-hidden transition-all duration-200 hover:border-slate-200/80">
            <CardContent className="p-4 flex items-center gap-4">
                <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-4xs ${iconBg}`}
                >
                    {icon}
                </div>

                <div className="space-y-0.5 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
                        {title}
                    </p>
                    <p className="text-2xl font-black text-slate-800 font-mono tracking-tight leading-none">
                        {value}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default StatCard;
