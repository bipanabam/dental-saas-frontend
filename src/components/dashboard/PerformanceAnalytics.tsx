"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  TrendingUp,
  CalendarDays,
  CreditCard,
  UserPlus,
  ArrowRight,
} from "lucide-react";

const COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#ef4444", "#22c55e"];

const trendData = {
  daily: [
    { name: "Mon", value: 12 },
    { name: "Tue", value: 18 },
    { name: "Wed", value: 21 },
    { name: "Thu", value: 16 },
    { name: "Fri", value: 30 },
  ],

  weekly: [
    { name: "W1", value: 28 },
    { name: "W2", value: 35 },
    { name: "W3", value: 42 },
    { name: "W4", value: 31 },
  ],

  monthly: [
    { name: "Jan", value: 110 },
    { name: "Feb", value: 124 },
    { name: "Mar", value: 142 },
    { name: "Apr", value: 130 },
  ],
};

const mix = [
  { name: "General", value: 540 },
  { name: "Pediatrics", value: 310 },
  { name: "Cardiology", value: 240 },
  { name: "Dermatology", value: 190 },
];

const PerformanceAnalytics = () => {
  const router = useRouter();

  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "weekly",
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* LEFT */}
      <Card className="xl:col-span-8 overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Registration Analytics</CardTitle>
              <CardDescription>Patient acquisition overview</CardDescription>
            </div>

            <Tabs
              value={period}
              onValueChange={(v) => setPeriod(v as typeof period)}
            >
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-90">
            <ResponsiveContainer>
              <AreaChart data={trendData[period]}>
                <defs>
                  <linearGradient id="brand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />

                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="url(#brand)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT */}
      <div className="xl:col-span-4 space-y-6">
        {/* ACTIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {[
              {
                icon: UserPlus,
                label: "Register Patient",
              },
              {
                icon: CalendarDays,
                label: "Book Appointment",
              },
              {
                icon: CreditCard,
                label: "Collect Payment",
              },
            ].map((a) => (
              <Button
                key={a.label}
                variant="outline"
                className="w-full h-14 justify-between rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <a.icon className="h-4 w-4 text-brand-600" />

                  {a.label}
                </div>

                <ArrowRight size={16} />
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* DONUT */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Mix</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-55">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={mix}
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {mix.map((v, i) => (
                      <Cell key={v.name} fill={COLORS[i]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-4">
              {mix.map((v, i) => (
                <div key={v.name} className="flex justify-between text-sm">
                  <div className="flex gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        background: COLORS[i],
                      }}
                    />

                    {v.name}
                  </div>

                  <span>{v.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t pt-4 flex items-center gap-2 text-emerald-600">
              <TrendingUp size={16} />
              +124 new patients
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
