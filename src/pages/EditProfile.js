import React, { useContext, useState } from "react";
import ProfilePhoto from "../components/editProfile/ProfilePhoto";
import ProfileForm from "../components/editProfile/ProfileForm";
import "../components/editProfile/editProfile.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

export default function EditProfile(){

const { user, setUser } = useContext(UserContext);
const navigate = useNavigate();

const [formData, setFormData] = useState(user);
const [errors, setErrors] = useState({});

// handle input change
const handleChange = (field, value) => {
setFormData({
...formData,
[field]: value
});

// clear error while typing
setErrors({
...errors,
[field]: ""
});
};

// ✅ VALIDATION
const validate = () => {

let newErrors = {};

if (!formData.name) newErrors.name = "Name is required";
if (!formData.email) newErrors.email = "Email is required";
if (!formData.phone) newErrors.phone = "Phone is required";
if (!formData.location) newErrors.location = "Location is required";
if (!formData.department) newErrors.department = "Department is required";
if (!formData.bio) newErrors.bio="Bio is required";
if (!formData.role) newErrors.role="Rple is required"
setErrors(newErrors);

return Object.keys(newErrors).length === 0;
};

// ✅ SAVE FUNCTION
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

// cancel
const handleCancel = () => {
navigate("/profile");
};

return(

<div className="edit-profile-container">

<ProfilePhoto 
image={formData.image}
onImageChange={(img)=>setFormData({...formData, image: img})}
/>

<ProfileForm 
formData={formData}
onChange={handleChange}
errors={errors}
/>

<div className="edit-actions">

<button className="cancel-btn" onClick={handleCancel}>
Cancel
</button>

<button className="save-btn" onClick={handleSave}>
Save Changes
</button>

</div>

</div>

)

}