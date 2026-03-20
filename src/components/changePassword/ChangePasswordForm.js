import React,{useState} from "react";
import PasswordInput from "./PasswordInput";
import PasswordChecklist from "./PasswordChecklist";

export default function ChangePasswordForm(){

const [form,setForm] = useState({
currentPassword:"",
newPassword:"",
confirmPassword:""
})

const [error,setError] = useState("");

const handleChange=(field,value)=>{
setForm({...form,[field]:value})
}

const handleSubmit=()=>{

if(form.newPassword!==form.confirmPassword){
setError("Passwords do not match");
return;
}

setError("");
alert("Password Updated Successfully");

}

return(

<div className="form-container">

<PasswordInput
label="Current Password"
value={form.currentPassword}
onChange={(e)=>handleChange("currentPassword",e.target.value)}
/>

<PasswordInput
label="New Password"
value={form.newPassword}
onChange={(e)=>handleChange("newPassword",e.target.value)}
/>

<PasswordChecklist password={form.newPassword}/>

<PasswordInput
label="Confirm Password"
value={form.confirmPassword}
onChange={(e)=>handleChange("confirmPassword",e.target.value)}
/>

{error && <p className="error">{error}</p>}

<div className="form-buttons">

<button className="cancel-btn">
Cancel
</button>

<button className="update-btn" onClick={handleSubmit}>
Update Password
</button>

</div>

</div>

)

}