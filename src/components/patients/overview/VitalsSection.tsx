import { TrendingUp, Thermometer, Heart } from "lucide-react";

const VitalsSection = ({ patient }: any) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[
        {
          title: "BP",
          val: "138/92",
          icon: TrendingUp,
          border: "border-brand-500",
          color: "text-brand-700 bg-brand-50",
        },
        {
          title: "HR",
          val: "74 bpm",
          icon: Heart,
          border: "border-amber-500",
          color: "text-amber-700 bg-amber-50",
        },
        {
          title: "Temp",
          val: "98.6 F",
          icon: Thermometer,
          border: "border-cyan-500",
          color: "text-cyan-700 bg-cyan-50",
        },
      ].map((card, i) => (
        <div
          key={i}
          className={`bg-white border border-slate-100 shadow-sm p-4 rounded-2xl flex items-center justify-between relative overflow-hidden group border-b-2 ${card.border}`}
        >
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
              {card.title}
            </span>
            <p className="text-2xl font-black text-slate-900 leading-none">
              {card.val}
            </p>
          </div>
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${card.color}`}
          >
            <card.icon className="h-5 w-5 stroke-[2.5]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default VitalsSection;
