"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FilePlus2, XOctagon } from "lucide-react";

const ActionAlertsPanel = () => {
    const alerts = [
        {
            id: "alert-1",
            title: "3 Incomplete encounters",
            desc: "Charts from previous session require final clinical authorization.",
            actionText: "Resolve Now",
            type: "priority",
            icon: AlertCircle,
            accentClass: "bg-red-50 text-red-700 border-red-100 hover:bg-red-100/50",
            btnClass: "bg-red-600 hover:bg-red-700 text-white"
        },
        {
            id: "alert-2",
            title: "5 Pending treatment plans",
            desc: "Waiting for patient electronic signatures or insurance pre-auth limits.",
            actionText: "Review Plans",
            type: "revenue",
            icon: FilePlus2,
            accentClass: "bg-cyan-50 text-cyan-700 border-cyan-100 hover:bg-cyan-100/50",
            btnClass: "bg-cyan-600 hover:bg-cyan-700 text-white"
        },
        {
            id: "alert-3",
            title: "2 Cancelled today",
            desc: "Slot recovery sequence initialized. Telehealth backfills pending.",
            actionText: "Audit Losses",
            type: "ops",
            icon: XOctagon,
            accentClass: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
            btnClass: "bg-slate-800 hover:bg-slate-900 text-white"
        }
    ];

    return (
        <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base font-bold text-slate-900">Action Alerts</CardTitle>
                    <CardDescription className="text-xs">Required administrative signoffs</CardDescription>
                </div>
                <Badge className="bg-red-500 text-white hover:bg-red-500 font-bold text-[10px] px-1.5 py-0.5 rounded">
                    10 NEW
                </Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
                {alerts.map((alert) => {
                    const Icon = alert.icon;
                    return (
                        <div
                            key={alert.id}
                            className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col gap-3 ${alert.accentClass}`}
                        >
                            <div className="flex items-start gap-2.5">
                                <div className="p-1.5 bg-white rounded-lg shadow-3xs shrink-0">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-60">{alert.type}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{alert.title}</h4>
                                    <p className="text-xs text-slate-600/90 leading-normal font-medium">{alert.desc}</p>
                                </div>
                            </div>
                            <Button size="sm" className={`w-full h-8 rounded-lg text-xs font-bold transition-all shadow-3xs ${alert.btnClass}`}>
                                {alert.actionText}
                            </Button>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

export default ActionAlertsPanel;