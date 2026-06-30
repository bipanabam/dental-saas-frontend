"use client";

interface Props {
    wait?: {
        estimated_wait_mins: number;
        patients_ahead: number;
    };
    fallback?: number | null;
    isLoading?: boolean;
}

const QueueWaitBadge = ({
    wait,
    fallback,
    isLoading,
}: Props) => {
    const minutes =
        wait?.estimated_wait_mins ?? fallback;

    return (
        <div className="flex flex-col items-end justify-center min-h-9">

            {isLoading ? (
                <div className="h-5 w-12 rounded animate-pulse bg-slate-100 border border-slate-200/50" />
            ) : (
                <span className="text-[11px] font-mono font-black px-1.5 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-100 shadow-3xs">
                    {minutes != null
                        ? `${minutes}m`
                        : "—"}
                </span>
            )}

            {!isLoading && wait && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1 whitespace-nowrap">
                    {wait.patients_ahead}{" "}
                    {wait.patients_ahead === 1
                        ? "patient"
                        : "patients"}{" "}
                    ahead
                </span>
            )}
        </div>
    );
};

export default QueueWaitBadge;