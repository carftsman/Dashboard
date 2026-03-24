import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, Cell
} from "recharts";
import Sidebar from "../components/Sidebar.jsx"; 

/* ---------------- DATA ---------------- */

const trendData = [
  { name: "Jan", value: 20000 },
  { name: "Feb", value: 80000 },
  { name: "Mar", value: 150000 },
  { name: "Apr", value: 120000 },
  { name: "May", value: 200000 },
  { name: "Jun", value: 270000 },
];

const platformData = [
  { name: "Facebook", value: 420 },
  { name: "Google", value: 350 },
  { name: "Instagram", value: 280 },
  { name: "Other", value: 150 },
];

const revenueData = [
  { name: "Jan", revenue: 540, spend: 500 },
  { name: "Feb", revenue: 520, spend: 480 },
  { name: "Mar", revenue: 530, spend: 470 },
  { name: "Apr", revenue: 510, spend: 460 },
  { name: "May", revenue: 520, spend: 480 },
  { name: "Jun", revenue: 530, spend: 490 },
];

const conversionData = [
  { name: "A", value: 90 },
  { name: "B", value: 75 },
  { name: "C", value: 60 },
  { name: "D", value: 50 },
  { name: "E", value: 40 },
];

/* ---------------- UI CARD ---------------- */

const Card = ({ children }) => (
  <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] shadow-[0_0_30px_rgba(0,0,0,0.6)] p-3">
    {children}
  </div>
);

/* ---------------- TOOLTIP ---------------- */

const CustomTooltip = ({ active, payload }) => {
  if (active && payload) {
    return (
      <div className="bg-[#020617] border border-white/10 px-2 py-1 text-xs rounded">
        {payload[0].value}
      </div>
    );
  }
  return null;
};

/* ---------------- MAIN ---------------- */

export default function Dashboard() {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#020617] via-[#0b1120] to-[#020617] text-white p-3 overflow-hidden flex flex-col">
          {/* ✅ SIDEBAR (LEFT FIXED) */}
      <Sidebar />

      {/* ✅ MAIN DASHBOARD */}
      <div className="ml-[220px] w-[calc(100%-220px)] h-full p-3 text-white flex flex-col overflow-hidden">

      {/* HEADER */}
      <h1 className="text-lg font-semibold mb-2">Marketing ROI Dashboard</h1>

      {/* KPI */}
     {/* KPI */}
<div className="grid grid-cols-6 gap-2 mb-2">
  {[
    { label: "Total Impressions", value: "1.5M" },
    { label: "Total Clicks", value: "230K" },
    { label: "Total Orders", value: "8,450" },
    { label: "Total Revenue", value: "$125,800" },
       { label: "Total Ad Spends", value: "$135,800" },
    { label: "ROAS", value: "4.12" }
  ].map((item, i) => (
    <Card key={i}>
      <p className="text-[10px] text-gray-400">{item.label}</p>
      <h2 className="text-xl font-bold mt-1">{item.value}</h2>
    </Card>
  ))}
</div>
      {/* ROW 1 */}
      <div className="grid grid-cols-2 gap-2 flex-1 mb-2">

        {/* LINE */}
        <Card>
          <p className="text-xs text-gray-400 mb-1">Impressions Trend</p>
          <ResponsiveContainer width="100%" height="92%">
            <LineChart data={trendData}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3"/>
              <XAxis dataKey="name" stroke="#475569" tick={{fontSize:10}}/>
              <YAxis stroke="#475569" tick={{fontSize:10}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* PLATFORM */}
        <Card>
          <p className="text-xs text-gray-400 mb-1">Platform Performance</p>
          <ResponsiveContainer width="100%" height="92%">
            <BarChart data={platformData}>
              <XAxis dataKey="name" stroke="#475569" tick={{fontSize:10}}/>
              <YAxis stroke="#475569" tick={{fontSize:10}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="value" radius={[5,5,0,0]}>
                {platformData.map((_, i)=>(
                  <Cell key={i} fill={["#3b82f6","#22c55e","#ec4899","#ef4444"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-2 gap-2 flex-1 mb-2">

        {/* REVENUE */}
        <Card>
          <p className="text-xs text-gray-400 mb-1">Revenue vs Ad Spend</p>
          <ResponsiveContainer width="100%" height="92%">
            <BarChart data={revenueData}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3"/>
              <XAxis dataKey="name" stroke="#475569" tick={{fontSize:10}}/>
              <YAxis stroke="#475569" tick={{fontSize:10}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="revenue" fill="#22c55e" radius={[4,4,0,0]} />
              <Bar dataKey="spend" fill="#f43f5e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* CONVERSION */}
        <Card>
          <p className="text-xs text-gray-400 mb-1">Conversion Rate</p>
          <ResponsiveContainer width="100%" height="92%">
            <BarChart data={conversionData}>
              <XAxis dataKey="name" stroke="#475569" tick={{fontSize:10}}/>
              <YAxis stroke="#475569" tick={{fontSize:10}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="value" fill="#f59e0b" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

       {/* FUNNEL */}
     <div className="h-[200px]">
  <Card>
    <p className="text-xs text-gray-400 mb-3">Campaign Funnel</p>

    <div className="relative w-full flex flex-col items-center gap-2 text-xs">

      {/* ROW 1 */}
      <div className="relative w-[95%] h-[32px] flex items-center justify-between px-4 text-white font-medium
        bg-gradient-to-r from-purple-400 to-blue-400
        clip-path-[polygon(5%_0,95%_0,100%_50%,95%_100%,5%_100%,0_50%)]">
        <span>1.5M Impressions</span>
        <span>230K Clicks</span>

        {/* CENTER % */}
        <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-gray-200">
          15%
        </div>
      </div>

      {/* ROW 2 */}
      <div className="relative w-[80%] h-[32px] flex items-center justify-between px-4 text-white font-medium
        bg-gradient-to-r from-blue-400 to-green-400
        clip-path-[polygon(5%_0,95%_0,100%_50%,95%_100%,5%_100%,0_50%)]">
        <span></span>
        <span>45K Leads</span>

        <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-gray-200">
          19%
        </div>
      </div>

      {/* ROW 3 */}
      <div className="relative w-[65%] h-[32px] flex items-center justify-between px-4 text-white font-medium
        bg-gradient-to-r from-green-400 to-lime-200
        clip-path-[polygon(5%_0,95%_0,100%_50%,95%_100%,5%_100%,0_50%)]">
        <span></span>
        <span>19% Lead Conversion</span>

        <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-gray-200">
          18%
        </div>
      </div>

      {/* ROW 4 */}
      <div className="relative w-[50%] h-[32px] flex items-center justify-between px-4 text-white font-medium
        bg-gradient-to-r from-orange-400 to-red-400
        clip-path-[polygon(5%_0,95%_0,100%_50%,95%_100%,5%_100%,0_50%)]">
        <span></span>
        <span>8,450 Orders</span>

        <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-gray-200">
          18%
        </div>
      </div>

    </div>
  </Card>
</div>

    </div>
    </div>
  );
}