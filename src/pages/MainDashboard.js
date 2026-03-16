import React from "react";
import "../css/MainDashboard.css";
import { useNavigate } from "react-router-dom";

function MainDashboard() {

  const navigate = useNavigate();

  return (
    <div className="layout">

      {/* Sidebar */}

      <div className="sidebar">
        <div className="logo">ZestBot</div>

        <div className="menu">
          <div className="menuItem active">Dashboards</div>
          <div className="menuItem">Users Log</div>
        </div>
      </div>

      {/* Main Section */}

      <div className="main">

        {/* Header */}

        <div className="header">

          <div className="back" onClick={() => navigate(-1)}>
            ← Back
          </div>

          <div className="search">
            <input type="text" placeholder="Search data..." />
          </div>

          <div className="actions">
            <button className="export">Export Data</button>
            <button className="upload">Upload Data</button>

            <div className="profile">SK</div>
          </div>

        </div>


        {/* Title */}

        <div className="titleSection">
          <h2>Marketing Performance</h2>
          <span>Real-time tracking of marketing campaigns</span>
        </div>


        {/* Metric Cards */}

        <div className="cards">

          <div className="card">
            <p>IMPRESSIONS</p>
            <h3>1.2M</h3>
            <span className="green">+5.2%</span>
          </div>

          <div className="card">
            <p>TOTAL CLICKS</p>
            <h3>45.8K</h3>
            <span className="green">+3.1%</span>
          </div>

          <div className="card">
            <p>TOTAL ORDERS</p>
            <h3>1,240</h3>
            <span className="red">-1.5%</span>
          </div>

          <div className="card">
            <p>TOTAL REVENUE</p>
            <h3>$54.2K</h3>
            <span className="green">+8.4%</span>
          </div>

          <div className="card">
            <p>AD SPEND</p>
            <h3>$12.4K</h3>
            <span className="green">+2.0%</span>
          </div>

          <div className="card">
            <p>ROAS</p>
            <h3>4.37x</h3>
            <span className="red">-0.5%</span>
          </div>

        </div>


        {/* Charts Section */}

        <div className="charts">

          {/* Performance Trends */}

          <div className="chartBox">
            <h4>Performance Trends</h4>

            <div className="trendChart">
              <svg viewBox="0 0 300 120">

                <polyline
                  fill="none"
                  stroke="#1f2e55"
                  strokeWidth="3"
                  points="10,100 80,85 150,70 220,60 290,45"
                />

                <polyline
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  points="10,90 80,80 150,75 220,65 290,60"
                />

              </svg>
            </div>

            {/* Added Week Labels */}

            <div className="trendLabels">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
            </div>

          </div>


          {/* Spend by Channel */}

          <div className="chartBox">
            <h4>Spend by Channel</h4>
            <div className="circleChart"></div>

            {/* Added Legend */}

            <div className="spendLegend">

              <div className="legendItem">
                <span className="dot dark"></span>
                Social
                <span className="percent">65%</span>
              </div>

              <div className="legendItem">
                <span className="dot light"></span>
                Search
                <span className="percent">25%</span>
              </div>

            </div>

          </div>


          {/* Conversions */}

          <div className="chartBox">
            <h4>Conversions</h4>

            <div className="bar">
              <div className="barTop">
                <span>Electronics</span>
                <span>462</span>
              </div>
              <div className="barFill" style={{width:"80%"}}></div>
            </div>

            <div className="bar">
              <div className="barTop">
                <span>Home</span>
                <span>315</span>
              </div>
              <div className="barFill" style={{width:"60%"}}></div>
            </div>

            <div className="bar">
              <div className="barTop">
                <span>Fashion</span>
                <span>240</span>
              </div>
              <div className="barFill" style={{width:"40%"}}></div>
            </div>

          </div>


          {/* Funnel */}

          <div className="chartBox">
            <h4>Funnel</h4>

            <div className="funnel f1">IMP 1.2M</div>
            <div className="funnel f2">CLK 45K</div>
            <div className="funnel f3">ADD 8K</div>
            <div className="funnel f4">ORD 1.2K</div>

            {/* Added Stats */}

            <div className="funnelStats">

              <div>
                <p>3.8%</p>
                <span>CTR</span>
              </div>

              <div>
                <p>2.7%</p>
                <span>CVR</span>
              </div>

            </div>

          </div>

        </div>


        {/* Overview */}

        <div className="overview">

          <h3>Dashboard Overview</h3>

          <p>
            This dashboard provides a real-time overview of marketing
            performance by centralizing key metrics like impressions,
            CTR, and ROAS across all channels. It enables teams to
            identify customer journey bottlenecks and optimize campaign
            spending to maximize overall revenue and ROI.
          </p>

        </div>


      </div>

    </div>
  );
}

export default MainDashboard;