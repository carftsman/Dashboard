import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({ label, value, onChange }) {

const [show,setShow] = useState(false);

return (

<div className="input-group">

<label>{label}</label>

<div className="password-input">

<input
type={show ? "text" : "password"}
value={value}
onChange={onChange}
/>

<span
className="eye-icon"
onClick={()=>setShow(!show)}
>
{show ? <FaEyeSlash/> : <FaEye/>}
</span>

</div>

</div>

)

}