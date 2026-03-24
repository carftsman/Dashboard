import React, { useState, useContext } from "react";
import PasswordChecklist from "./PasswordChecklist";
import PasswordInput from "./PasswordInput";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

export default function ChangePasswordForm(){

const { user } = useContext(UserContext);

const [form,setForm] = useState({
email: user?.email || "",
current:"",
new:"",
confirm:""
});

const [loading,setLoading] = useState(false);

// ✅ validations
const isLengthValid = form.new.length >= 12;
const hasUpperLower = /[A-Z]/.test(form.new) && /[a-z]/.test(form.new);
const hasNumberSpecial = /[0-9]/.test(form.new) && /[^A-Za-z0-9]/.test(form.new);
const isMatch = form.new === form.confirm;
const isSameAsOld = form.current && form.new === form.current;

const isFormValid =
form.email &&   // ✅ added email validation
isLengthValid &&
hasUpperLower &&
hasNumberSpecial &&
isMatch &&
!isSameAsOld;

// ✅ API CALL
const handleSubmit = async () => {

if (!isFormValid) {
toast.error("Please fill all fields correctly ❌");
return;
}

try{
setLoading(true);

console.log("Calling API");
const response = await axios.post(
    "https://dashboard-backend-cyrd.onrender.com/api-docs/api/auth/change-password",
{
email: form.email,
currentPassword: form.current,
newPassword: form.new,
confirmPassword: form.confirm
}
);
console.log("response from backend",response);

toast.success("Password Updated Successfully ✅");

// reset (email matram maintain)
setForm({
email: "",
current:"",
new:"",
confirm:""
});

}catch(error){

console.log(error);

toast.error(
error?.response?.data?.message || "Something went wrong ❌"
);

}finally{
setLoading(false);
}

};

return (

<div>

{/* ✅ EMAIL (NORMAL INPUT) */}
<div className="input-box">
<input
type="email"
value={form.email}
onChange={(e)=>setForm({...form,email:e.target.value})}
placeholder="Enter Email"
/>
</div>

{/* CURRENT */}
<PasswordInput  
value={form.current}
onChange={(e)=>setForm({...form,current:e.target.value})}
placeholder="Current Password"
/>

{/* NEW */}
<PasswordInput  
value={form.new}
onChange={(e)=>setForm({...form,new:e.target.value})}
placeholder="New Password"
/>

{/* CONFIRM */}
<PasswordInput 
value={form.confirm}
onChange={(e)=>setForm({...form,confirm:e.target.value})}
placeholder="Confirm Password"
/>

{/* CHECKLIST */}
<PasswordChecklist 
isLengthValid={isLengthValid}
hasUpperLower={hasUpperLower}
hasNumberSpecial={hasNumberSpecial}
isSameAsOld={isSameAsOld}
isMatch={isMatch}
form={form}
/>

{/* BUTTONS */}
<div className="flex justify-end gap-3 mt-5">

  <button 
    className="px-5 py-2 border border-gray-300 rounded-md"
    onClick={() => window.history.back()}
  >
    Cancel
  </button>

  <button 
    className="px-5 py-2 bg-blue-600 text-white rounded-md"
    onClick={handleSubmit}
    disabled={!isFormValid || loading}
  >
    {loading ? "Updating..." : "Update Password"}
  </button>

</div>
</div>
);
}