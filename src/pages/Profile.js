import React, { useContext } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import InfoSection from "../components/profile/InfoSection";
import BioCard from "../components/profile/BioCard";
import StatusCard from "../components/profile/StatusCard";
import { UserContext } from "../context/UserContext";


export default function Profile() {

const { user } = useContext(UserContext);

return (

<div className="min-h-screen bg-[#f3f5f9] px-5 py-10">

  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 max-w-5xl mx-auto">
    <ProfileHeader user={user}/>
    <InfoSection user={user}/>
  </div>

  

  <div className="flex gap-5 mb-6 max-w-5xl mx-auto">
    <BioCard bio={user.bio}/>
    <StatusCard status={user.status}/>
  </div>

  <div className="flex justify-between items-center max-w-5xl mx-auto">
    <span className="text-red-600 cursor-pointer">Deactivate Account</span>
  </div>

</div>

)
}