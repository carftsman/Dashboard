import React, { useContext } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import InfoSection from "../components/profile/InfoSection";
import BioCard from "../components/profile/BioCard";
import StatusCard from "../components/profile/StatusCard";
import "../components/profile/profile.css";
import { UserContext } from "../context/UserContext";

export default function Profile() {

const {user}=useContext(UserContext);    



return(

<div className="profile-page">

<div className="profile-main-card">
<ProfileHeader user={user}/>
<InfoSection user={user}/>
</div>

<div className="profile-lower">

<BioCard bio={user.bio}/>

<StatusCard status={user.status}/>

</div>

<div className="profile-footer">

<span className="danger">Deactivate Account</span>

<div>

</div>

</div>

</div>

)

}