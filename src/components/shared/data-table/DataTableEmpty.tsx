import { ShieldAlert } from "lucide-react";

interface Props {
  title: string;

  description: string;
}

const DataTableEmpty = ({ title, description }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
      <ShieldAlert className="mb-3 h-10 w-10 text-muted-foreground"/>

      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default DataTableEmpty;