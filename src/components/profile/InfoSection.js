import React from "react";
import {FaEnvelope,FaPhone,FaBriefcase,FaMapMarkerAlt} from "react-icons/fa";

export default function InfoSection({user}) {

return(

<div className="profile-details">

<div className="details-box">

<span className="section-label">CONTACT DETAILS</span>

<div className="detail-row">
<FaEnvelope/>
<div>
<span>Email Address</span>
<p>{user.email}</p>
</div>
</div>

<div className="detail-row">
<FaPhone/>
<div>
<span>Phone Number</span>
<p>{user.phone}</p>
</div>
</div>

</div>


<div className="details-box">

<span className="section-label">WORK INFORMATION</span>

<div className="detail-row">
<FaBriefcase/>
<div>
<span>Current Role</span>
<p>{user.role}</p>
</div>
</div>

<div className="detail-row">
<FaMapMarkerAlt/>
<div>
<span>Office Location</span>
<p>{user.location}</p>
</div>
</div>

</div>

</div>

)

}