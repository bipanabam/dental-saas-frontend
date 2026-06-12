import {
Card,
CardHeader,
CardTitle,
CardContent
}
from "@/components/ui/card";

import {LucideIcon} from "lucide-react";

interface Props {
    title:string
    value:string|number
    description:string
    icon:LucideIcon
    className:string
}

const StatCard = ({
title,
value,
description,
icon:Icon,
className

}:Props) => {

  return (
    <Card className="bg-white border-brand-100 shadow-sm">

        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
            {title}
            </CardTitle>

              <div className={`rounded-xl border p-2.5 ${className}`}>
                <Icon className="h-5 w-5" />
            </div>
        </CardHeader>

        <CardContent>
            <div className="text-3xl font-bold text-slate-900">
            {value}
            </div>

            <p className="text-xs text-muted-foreground mt-1">
            {description}
            </p>
        </CardContent>
    </Card>
  );
}

export default StatCard;