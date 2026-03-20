import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
  CartesianGrid,
  AreaChart, Area,
  ScatterChart, Scatter
} from "recharts";
import { FiUpload, FiDownload, FiSearch } from "react-icons/fi";
import  "../css/MainDashboard.css"

// -------------------- DATA --------------------
const kpis = [
  { title: "Impressions", value: "1.2M", change: "+12.5%", color: "green" },
  { title: "Clicks", value: "45.8K", change: "+8.2%", color: "green" },
  { title: "Leads", value: "2,410", change: "+14.1%", color: "green" },
  { title: "Orders", value: "894", change: "-2.4%", color: "red" },
  { title: "Revenue", value: "$142.5K", change: "+21.3%", color: "green" },
  { title: "Ad Spend", value: "$24,150", change: "target", color: "gray" },
  { title: "CPC", value: "$0.53", change: "+$0.02", color: "red" },
  { title: "CPA", value: "$10.02", change: "-$1.20", color: "green" },
  { title: "ROAS", value: "5.9x", change: "+0.4x", color: "green" },
  { title: "Conv Rate", value: "2.1%", change: "avg", color: "gray" }
];

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"];

// -------------------- COMPONENTS --------------------
const Sidebar = () => (
  <div className="sidebar">
    <h2>ZestBot</h2>
    <ul>
      <li className="active">Dashboards</li>
      <li>Users</li>
      <li>Data Schema</li>
      <li>Reports</li>
    </ul>
  </div>
);

const Header = () => (
  <div className="header">
    <h2>Marketing ROI</h2>
    <div className="actions">
      <div className="search">
        <FiSearch />
        <div>
         
        <input placeholder="Search data..." />
         </div>
      </div>
      <button className="btn light"><FiDownload /> Export Data</button>
      <button className="btn primary"><FiUpload /> Upload Data</button>
    </div>
  </div>
);

const KPISection = () => (
  <div className="kpi-grid">
    {kpis.map((k, i) => (
      <div key={i} className="kpi-card">
        <p>{k.title}</p>
        <h3>{k.value}</h3>
        <span className={k.color}>{k.change}</span>
      </div>
    ))}
  </div>
);

// ---------------- FUNNEL ----------------
const Funnel = () => (
  <div className="card funnel">
    <h4>Funnel</h4>
    <div className="funnel-bar imp">IMP <span>1.2M</span></div>
    <div className="funnel-bar clk">CLK <span>45K</span></div>
    <div className="funnel-bar add">ADD <span>8K</span></div>
    <div className="funnel-bar ord">ORD <span>1.2K</span></div>
    <div className="funnel-stats">
      <div>3.8% <span>CTR</span></div>
      <div>2.7% <span>CVR</span></div>
    </div>
  </div>
);

const BarChartCard = () => (
  <div className="card">
    <h4>Revenue & Orders by Campaign</h4>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={[
        { name: "C1", revenue: 12000, orders: 200 },
        { name: "C2", revenue: 19000, orders: 300 },
        { name: "C3", revenue: 3000, orders: 100 },
        { name: "C4", revenue: 5000, orders: 150 },
        { name: "C5", revenue: 20000, orders: 350 },
        { name: "C6", revenue: 15000, orders: 250 }
      ]}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="revenue" fill="#3b82f6" />
        <Bar dataKey="orders" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const PieChartCard = () => (
  <div className="card">
    <h4>Platform Contribution</h4>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={[
          { name: "Google Ads", value: 20 },
          { name: "Facebook", value: 15 },
          { name: "Instagram", value: 10 },
          { name: "LinkedIn", value: 15 }
        ]} dataKey="value" innerRadius={60} outerRadius={90}>
          {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const LineChartCard = () => (
  <div className="card">
    <h4>Engagement Trends</h4>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={[
        { name: "Week 1", clicks: 12000, leads: 500, orders: 200 },
        { name: "Week 2", clicks: 15000, leads: 600, orders: 250 },
        { name: "Week 3", clicks: 11000, leads: 450, orders: 180 },
        { name: "Week 4", clicks: 18000, leads: 700, orders: 300 }
      ]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line dataKey="clicks" stroke="#3b82f6" />
        <Line dataKey="leads" stroke="#22c55e" />
        <Line dataKey="orders" stroke="#f59e0b" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const AreaChartCard = () => (
  <div className="card">
    <h4>Daily Spend vs Revenue</h4>
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={[
        { name: "Oct 1", spend: 2000, revenue: 3000 },
        { name: "Oct 5", spend: 2500, revenue: 4000 },
        { name: "Oct 10", spend: 2200, revenue: 3500 },
        { name: "Oct 15", spend: 3000, revenue: 5000 },
        { name: "Oct 20", spend: 2800, revenue: 4200 },
        { name: "Oct 25", spend: 3200, revenue: 4800 },
        { name: "Oct 30", spend: 3500, revenue: 5500 }
      ]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area dataKey="spend" stroke="#3b82f6" fill="#bfdbfe" />
        <Area dataKey="revenue" stroke="#22c55e" fill="#bbf7d0" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const ScatterChartCard = () => (
  <div className="card">
    <h4>Campaign Efficiency (Spend vs ROAS)</h4>
    <ResponsiveContainer width="100%" height={250}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis dataKey="x" />
        <YAxis dataKey="y" />
        <Tooltip />
        <Scatter data={[{ x: 1500, y: 8 }, { x: 2500, y: 5 }, { x: 3000, y: 7 }, { x: 4000, y: 4 }]} fill="#8b5cf6" />
      </ScatterChart>
    </ResponsiveContainer>
  </div>
);

const TableSection = () => (
  <div className="card">
    <h4>Detailed Campaign Performance</h4>
    <table>
      <thead>
        <tr>
          <th>Campaign Name</th>
          <th>Impressions</th>
          <th>Clicks</th>
          <th>Leads</th>
          <th>Orders</th>
          <th>Revenue</th>
          <th>ROAS</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Summer Sale 2023</td>
          <td>450K</td>
          <td>12.2K</td>
          <td>850</td>
          <td>310</td>
          <td>$42,500</td>
          <td className="green">6.2x</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// -------------------- MAIN --------------------
export default function App() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />
        <KPISection />

        <div className="grid-3">
          <BarChartCard />
          <PieChartCard />
          <Funnel />
        </div>

        <div className="grid-2">
          <LineChartCard />
          <AreaChartCard />
        </div>

        <div className="grid-2">
          <ScatterChartCard />
          <TableSection />
        </div>
      </div>
    </div>
  );
}

