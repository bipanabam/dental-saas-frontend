"use client";

type Props = {
    queue: React.ReactNode;
    workflow: React.ReactNode;
};

const QueueLayout = ({
    queue,
    workflow,
}: Props) => {
    return (
        <div className="grid gap-6 xl:grid-cols-[360px_1fr] items-start">
            <aside>
                {queue}
            </aside>

            <main>
                {workflow}
            </main>
        </div>
    );
}

export default QueueLayout;