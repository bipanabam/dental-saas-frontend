"use client";

import { SectionLoader } from "../base/loading-view";

type PaginatedResponse<T> = {
    items: T[];
    total: number;
    skip: number;
    limit: number;
    has_more?: boolean;
    stats?: unknown;
};

type Props<T> = {
    data?: PaginatedResponse<T>;
    isLoading: boolean;
    emptyTitle?: string;
    emptyDescription?: string;

    renderItem: (
        item: T,
        index: number,
        array: T[]
    ) => React.ReactNode;
};

export function PaginatedList<T>({
    data,
    isLoading,
    emptyTitle = "No data found",
    emptyDescription = "Nothing to show here",
    renderItem,
}: Props<T>) {
    const items = data?.items ?? [];
    const hasMore =
        data?.has_more ??
        ((data?.skip ?? 0) + items.length < (data?.total ?? 0));

    if (isLoading) {
        return <SectionLoader message="Loading data..." />;
    }

    if (!items.length) {
        return (
            <div className="text-center py-10 border rounded-xl bg-slate-50 text-slate-500">
                <p className="font-semibold">{emptyTitle}</p>
                <p className="text-xs mt-1">{emptyDescription}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item, index) =>
                renderItem(item, index, items)
            )}

            {hasMore && (
                <div className="text-center text-xs text-slate-400 pt-2">
                    Showing {items.length} of {data?.total}
                </div>
            )}
        </div>
    );
}