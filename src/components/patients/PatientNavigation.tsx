"use client";

const tabs = [
  "overview",
  "medical-history",
  "appointments",
  "encounters",
  "treatment-plans",
  "procedures",
  "billing",
  "documents",
];

interface NavProps {
  active: string;
  onChange: (v: string) => void;
}

const PatientNavigation = ({
  active,
  onChange,
}: NavProps) => {
  return (
    <div className="w-full border-b bg-white/40 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex overflow-x-auto gap-6 no-scrollbar px-1">
        {tabs.map((tab) => {
          const selected = tab === active;

          return (
            <button
              key={tab}
              onClick={() => onChange(tab)}
              className={`relative pb-3.5 pt-1 whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-all duration-200 outline-none
                ${selected
                  ? "text-brand-600 font-bold"
                  : "text-slate-400 hover:text-slate-700"
                }`}
            >
              <span>
                {tab.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>

              {selected && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-200" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PatientNavigation;
