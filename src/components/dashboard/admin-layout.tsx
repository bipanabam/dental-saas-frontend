"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Charts from Tremor
// import { AreaChart, DonutChart, Legend } from "@tremor/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Legend } from "recharts";

import DashboardHeader from "./dashboard-header";
import StatsGrid from "./stats-grid";

const COLORS = ["#4f46e5", "#06b6d4", "#f59e0b", "#f43f5e", "#10b981"];

// Icons from lucide-react
import {
  Users,
  CalendarDays,
  DollarSign,
  PlusCircle,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Activity,
  CreditCard
} from "lucide-react";

interface AdminDashboardClientProps {
  userName?: string;
}

const AdminLayout = ({ userName = "Admin User" }: AdminDashboardClientProps) => {
  const router = useRouter();
  const [trendPeriod, setTrendPeriod] = React.useState<"daily" | "weekly" | "monthly">("weekly");

  // ==========================================
  //               DUMMY DATA
  // ==========================================
  
  const dummyStats = {
    totalPatients: 1420,
    newPatientsLast30Days: 124,
    newPatientsLast24Hours: 12,
    activePatients: 342,
    totalRevenue: 14250.00
  };

  const dummyAppointments = [
    {
      id: "1",
      patient: { fullName: "Sarah Jenkins", phone: "(555) 234-5678" },
      timeSlot: "09:00 AM",
      doctor: { fullName: "Alexander House" },
      status: "Confirmed"
    },
    {
      id: "2",
      patient: { fullName: "Michael Chang", phone: "(555) 876-5432" },
      timeSlot: "10:30 AM",
      doctor: { fullName: "Elena Rostova" },
      status: "In Progress"
    },
    {
      id: "3",
      patient: { fullName: "Emily Rodriguez", phone: "(555) 432-1098" },
      timeSlot: "11:15 AM",
      doctor: { fullName: "Alexander House" },
      status: "Pending"
    },
    {
      id: "4",
      patient: { fullName: "David Kim", phone: "(555) 789-0123" },
      timeSlot: "02:00 PM",
      doctor: { fullName: "Marcus Vance" },
      status: "Confirmed"
    }
  ];

  const trendDataMap = {
    daily: [
      { name: "Mon", Registrations: 12 },
      { name: "Tue", Registrations: 19 },
      { name: "Wed", Registrations: 15 },
      { name: "Thu", Registrations: 22 },
      { name: "Fri", Registrations: 30 },
      { name: "Sat", Registrations: 8 },
      { name: "Sun", Registrations: 5 },
    ],
    weekly: [
      { name: "Week 1", Registrations: 28 },
      { name: "Week 2", Registrations: 35 },
      { name: "Week 3", Registrations: 42 },
      { name: "Week 4", Registrations: 32 },
    ],
    monthly: [
      { name: "Jan", Registrations: 110 },
      { name: "Feb", Registrations: 125 },
      { name: "Mar", Registrations: 142 },
      { name: "Apr", Registrations: 130 },
      { name: "May", Registrations: 155 },
      { name: "Jun", Registrations: 124 },
    ],
  };

  const donutData = [
    { name: "General Medicine", amount: 540 },
    { name: "Pediatrics", amount: 310 },
    { name: "Cardiology", amount: 240 },
    { name: "Dermatology", amount: 190 },
    { name: "Orthopedics", amount: 140 },
  ];

  // ==========================================
  //            COMPONENT CONFIG
  // ==========================================

  const statCards = [
    {
      title: "Total Patients",
      value: dummyStats.totalPatients,
      description: `+${dummyStats.newPatientsLast30Days} this month`,
      icon: Users,
      className: "border-blue-100 bg-blue-50/30 text-blue-600",
    },
    {
      title: "Monthly Admissions",
      value: dummyStats.newPatientsLast30Days,
      description: `+${dummyStats.newPatientsLast24Hours} registered today`,
      icon: CalendarDays,
      className: "border-amber-100 bg-amber-50/30 text-amber-600",
    },
    {
      title: "Active Cases",
      value: dummyStats.activePatients,
      description: "Patients currently in active treatment",
      icon: Activity,
      className: "border-emerald-100 bg-emerald-50/30 text-emerald-600",
    },
    {
      title: "Today's Revenue",
      value: `$${dummyStats.totalRevenue.toFixed(2)}`,
      description: "Gross daily collected payments",
      icon: DollarSign,
      className: "border-indigo-100 bg-indigo-50/30 text-indigo-600",
    },
  ];

  return (
    <div className="space-y-8 max-w-400 mx-auto p-2">
        <DashboardHeader userName={userName} />
        <StatsGrid stats={dummyStats} />


      {/* Main Structural Division */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Column Area: Table & Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Schedule Table */}
          <Card className="border-slate-100 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  <CalendarDays className="h-5 w-5 text-indigo-600" /> Today's Schedule
                </CardTitle>
                <CardDescription>Live tracking overview of daily clinic appointments</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push("/appointments")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-600">Patient</TableHead>
                      <TableHead className="font-semibold text-slate-600">Time / Provider</TableHead>
                      <TableHead className="font-semibold text-slate-600">Status</TableHead>
                      <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyAppointments.map((appt) => (
                      <TableRow key={appt.id} className="hover:bg-slate-50/50">
                        <TableCell className="font-medium">
                          <div>
                            <p className="text-sm text-slate-900">{appt.patient.fullName}</p>
                            <p className="text-xs text-slate-400">{appt.patient.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm text-slate-700">{appt.timeSlot}</p>
                            <p className="text-xs text-indigo-600">Dr. {appt.doctor.fullName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            appt.status === "Confirmed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            appt.status === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-100" :
                            "bg-amber-50 text-amber-700 border-amber-100"
                          }`}>
                            {appt.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={() => router.push(`/appointments?id=${appt.id}`)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Registration Analytics: Time-Series Area Chart */}
          <Card className="border-slate-100 shadow-sm bg-white">
            <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">Registration Trends</CardTitle>
                <CardDescription>Visual intake metrics across window timeframes</CardDescription>
              </div>
              <Tabs value={trendPeriod} onValueChange={(v: any) => setTrendPeriod(v)} className="w-auto">
                <TabsList className="grid grid-cols-3 w-[240px]">
                  <TabsTrigger value="daily" className="text-xs">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-2">
              <AreaChart
                className="h-72 mt-4"
                data={trendDataMap[trendPeriod]}
                index="name"
                categories={["Registrations"]}
                colors={["indigo"]}
                valueFormatter={(number: number) => `${number} Patients`}
                showLegend={false}
                yAxisWidth={40}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column Area: Actions & Donut Chart */}
        <div className="space-y-6">
          
          {/* Quick Actions Card Block */}
          <Card className="border-slate-100 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-800">Quick Actions</CardTitle>
              <CardDescription>Common administrative routines</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button 
                variant="outline" 
                className="w-full justify-between h-14 border-slate-100 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all group px-4 rounded-xl"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm border border-slate-100">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  Register New Patient
                </span>
                <PlusCircle className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-between h-14 border-slate-100 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all group px-4 rounded-xl"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm border border-slate-100">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  Book Appointment
                </span>
                <PlusCircle className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </Button>

              <Button 
                variant="outline" 
                onClick={() => router.push("/billing")}
                className="w-full justify-between h-14 border-slate-100 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all group px-4 rounded-xl"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm border border-slate-100">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  Collect Payment
                </span>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </Button>
            </CardContent>
          </Card>

          {/* Patient Mix Donut Chart */}
          <Card className="border-slate-100 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-800">Patient Mix</CardTitle>
              <CardDescription>Departmental demographic breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              
                <div className="h-44 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="amount"
                    >
                        {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} cases`} />
                    </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 w-full">
                <Legend
                  categories={donutData.map((d) => d.name)}
                  colors={["indigo", "cyan", "amber", "rose", "emerald"]}
                  className="max-w-xs mx-auto"
                />
              </div>
              
              <Separator className="my-4 bg-slate-100" />
              
              <div className="flex items-center justify-between w-full text-xs font-bold px-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span>Growth Velocity</span>
                </div>
                <span className="text-slate-900">+{dummyStats.newPatientsLast30Days} New This Month</span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

export default AdminLayout;