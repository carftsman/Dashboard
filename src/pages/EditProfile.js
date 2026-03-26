import React, { useContext, useState } from "react";
import ProfilePhoto from "../components/editProfile/ProfilePhoto";
import ProfileForm from "../components/editProfile/ProfileForm";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";


export default function EditProfile(){

const { user, setUser } = useContext(UserContext);
const navigate = useNavigate();

const [formData, setFormData] = useState(user);
const [errors, setErrors] = useState({});

const handleChange = (field, value) => {
setFormData({ ...formData, [field]: value });
setErrors({ ...errors, [field]: "" });
};

const validate = () => {
let newErrors = {};

if (!formData.name) newErrors.name = "Name is required";
if (!formData.email) newErrors.email = "Email is required";
if (!formData.phone) newErrors.phone = "Phone is required";
if (!formData.location) newErrors.location = "Location is required";
if (!formData.department) newErrors.department = "Department is required";
if (!formData.bio) newErrors.bio = "Bio is required";
if (!formData.role) newErrors.role = "Role is required";

setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};

const handleSave = () => {
if (!validate()){
toast.error("Please fill all required fields ❌");
return;
}

setUser(formData);
toast.success("Profile Updated Successfully ✅");

setTimeout(()=>{
navigate("/profile");
},1500);
};

const handleCancel = () => {
navigate("/profile");
};

return(

<div className="min-h-screen bg-[#f4f6f9] px-5 py-10">

<div className="max-w-[900px] mx-auto bg-white rounded-xl shadow-md p-6">

<ProfilePhoto 
image={formData.image}
onImageChange={(img)=>setFormData({...formData, image: img})}
/>

<ProfileForm 
formData={formData}
onChange={handleChange}
errors={errors}
/>

<div className="flex justify-end gap-3 mt-6">
<button 
onClick={handleCancel}
className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition"
>
Cancel
</button>

<button 
onClick={handleSave}
className="bg-[#1e2b44] text-white px-4 py-2 rounded-md text-sm hover:bg-black transition"
>
Save Changes
</button>
</div>

</div>
</div>

)
}