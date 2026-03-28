import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, Cell
} from "recharts";
import Sidebar from "../components/Sidebar.jsx"; 
import ChartOverLay from "../components/ChartOverLay.jsx";
import { useState } from "react";


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
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-[#020617] border border-white/20 px-2 py-1 text-xs rounded text-white">
        {payload[0]?.value ?? "No data"}
      </div>
    );
  }
  return null;
};

/* ---------------- MAIN ---------------- */

export default function Dashboard() {

  const [openOverlay, setOpenOverlay] = useState(false);

  // ✅ ADDED STATE
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ ADDED API FUNCTION (WITH TOKEN)
 // ✅ REPLACE ONLY YOUR fetchChartData FUNCTION WITH THIS

const fetchChartData = async () => {
  setLoading(true);
  try {
    // ✅ GET TOKEN (TRY MULTIPLE KEYS)
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwt");

    console.log("TOKEN USED:", token);

    if (!token) {
      alert("No token found. Please login.");
      setLoading(false);
      return;
    }

    const response = await fetch("https://dashboard-backend-cyrd.onrender.com/api/upload/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        // ✅ TRY BEARER FIRST
        "Authorization": `Bearer ${token}`,

        // ❗ If still 401 → comment above & use below:
        // "Authorization": token,
      },
      body: JSON.stringify({
        dashboardId: 1,
        fileId: "uuid-file-id",
        chartType: "BAR",
        xAxis: "campaign_name",
        yAxis: "revenue",
        filters: {
          platform: "Google"
        }
      })
    });

    // ✅ HANDLE 401 CLEARLY
    if (response.status === 401) {
      console.error("Unauthorized - Invalid or expired token");
      alert("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    const result = await response.json();
    console.log("API RESPONSE:", result);

    setApiData(result?.data || []);

  } catch (error) {
    console.error("API ERROR:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#020617] via-[#0b1120] to-[#020617] text-white p-3 overflow-hidden flex flex-col">
      
      <Sidebar />

      <div className="ml-[220px] w-[calc(100%-220px)] h-full p-3 text-white flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-semibold">Marketing ROI Dashboard</h1>

        <div className="flex items-center gap-2">

          <button 
            onClick={fetchChartData}
            className="text-xs px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/10"
          >
            {loading ? "Loading..." : "Upload Data"}
          </button>

          <button className="text-xs px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/10">
            Export Data
          </button>

          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
            U
          </div>

        </div>
      </div>

      {/* KPI */}
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {[
          { label: "Total Impressions", value: "1.5M" },
          { label: "Total Clicks", value: "230K" },
          { label: "Total Orders", value: "8,450" },
          { label: "Total Revenue", value: "$125,800" },
          { label: "Total Ad Spends", value: "$135,800" },
          { label: "ROAS", value: "4.12" }
        ].map((item, i) => (
          <div key={i} className="px-2 py-1.5 rounded-lg border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] w-fit min-w-[90px]">
            <p className="text-[9px] text-gray-400">{item.label}</p>
            <h2 className="text-sm font-semibold mt-1">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* ROW 1 */}
      <div className="grid grid-cols-2 gap-2 flex-1 mb-2">

        {/* LINE */}
        <Card>
          <p className="text-xs text-gray-400 mb-1">Impressions Trend</p>
          <ResponsiveContainer width="100%" height="92%">
            <LineChart data={trendData} onClick={() => setOpenOverlay(true)}>
              <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3"/>
              <XAxis dataKey="name" stroke="#e2e8f0" tick={{fontSize:10}}/>
              <YAxis stroke="#e2e8f0" tick={{fontSize:10}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2.5}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* PLATFORM */}
        <Card>
          <p className="text-xs text-gray-400 mb-1">Platform Performance</p>
          <ResponsiveContainer width="100%" height="92%">
            
            <BarChart 
              data={(apiData && apiData.length > 0) ? apiData : platformData} 
              onClick={() => setOpenOverlay(true)}
            >
              <XAxis dataKey="name" stroke="#e2e8f0" tick={{fontSize:10}}/>
              <YAxis stroke="#e2e8f0" tick={{fontSize:10}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="value" radius={[5,5,0,0]} fill="#ffffff">
                {((apiData && apiData.length > 0) ? apiData : platformData).map((_, i)=>(
                  <Cell key={i} fill="#ffffff" />
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
            <BarChart data={revenueData} onClick={() => setOpenOverlay(true)}>
              <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3"/>
              <XAxis dataKey="name" stroke="#e2e8f0" tick={{fontSize:10}}/>
              <YAxis stroke="#e2e8f0" tick={{fontSize:10}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="revenue" fill="#ffffff" radius={[4,4,0,0]} />
              <Bar dataKey="spend" fill="rgba(255,255,255,0.5)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* CONVERSION */}
        <Card>
          <p className="text-xs text-gray-400 mb-1">Conversion Rate</p>
          <ResponsiveContainer width="100%" height="92%">
            <BarChart data={conversionData} onClick={() => setOpenOverlay(true)}>
              <XAxis dataKey="name" stroke="#e2e8f0" tick={{fontSize:10}}/>
              <YAxis stroke="#e2e8f0" tick={{fontSize:10}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="value" fill="#ffffff" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* FUNNEL */}
      <div className="h-[200px]">
        <Card>
          <p className="text-xs text-gray-400 mb-3">Campaign Funnel</p>

          <div className="relative w-full flex flex-col items-center gap-2 text-xs">

            <div className="relative w-[95%] h-[32px] flex items-center justify-between px-4 text-white font-medium
              bg-gradient-to-r from-white/90 to-white/60
              clip-path-[polygon(5%_0,95%_0,100%_50%,95%_100%,5%_100%,0_50%)]">
              <span>1.5M Impressions</span>
              <span>230K Clicks</span>
              <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-black">15%</div>
            </div>

            <div className="relative w-[80%] h-[32px] flex items-center justify-between px-4 text-white font-medium
              bg-gradient-to-r from-white/80 to-white/50
              clip-path-[polygon(5%_0,95%_0,100%_50%,95%_100%,5%_100%,0_50%)]">
              <span></span>
              <span>45K Leads</span>
              <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-black">19%</div>
            </div>

            <div className="relative w-[65%] h-[32px] flex items-center justify-between px-4 text-white font-medium
              bg-gradient-to-r from-white/70 to-white/40
              clip-path-[polygon(5%_0,95%_0,100%_50%,95%_100%,5%_100%,0_50%)]">
              <span></span>
              <span>19% Lead Conversion</span>
              <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-black">18%</div>
            </div>

            <div className="relative w-[50%] h-[32px] flex items-center justify-between px-4 text-white font-medium
              bg-gradient-to-r from-white/60 to-white/30
              clip-path-[polygon(5%_0,95%_0,100%_50%,95%_100%,5%_100%,0_50%)]">
              <span></span>
              <span>8,450 Orders</span>
              <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-black">18%</div>
            </div>

          </div>
        </Card>
      </div>
       <ChartOverLay open={openOverlay} onClose={() => setOpenOverlay(false)} />
      </div>
    </div>
  );
}