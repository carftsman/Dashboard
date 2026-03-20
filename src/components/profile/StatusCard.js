import React from "react";

export default function StatusCard({status}){

return(

<div className="status-card">

<span className="section-label">ACCOUNT STATUS</span>

<div className="status-pill">{status}</div>

<p className="member">Member since January 2021</p>

</div>

)

}