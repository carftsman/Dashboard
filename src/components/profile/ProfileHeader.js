import React from "react";
import { FaPen, FaLock } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function ProfileHeader({user}) {

const navigate= useNavigate();    

return(

<>
<div className="profile-gradient"></div>

<div className="profile-top">

<img src={user.image} alt="avatar" className="profile-avatar"/>

<div className="profile-text">
<h2>{user.name}</h2>
<p>{user.role} • {user.department}</p>
</div>

<div className="profile-actions">

<button className="btn-light"
onClick={()=>navigate("/edit-profile")}
>
<FaPen/> Edit Profile
</button>

<button className="btn-dark"
onClick={()=>navigate("/change-password")}
>
<FaLock/> Change Password
</button>

</div>

</div>
</>

)

}