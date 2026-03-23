import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

export default function PasswordInput({ value, onChange, placeholder }) {

const [show, setShow] = useState(false);

return (

<div className="relative">

{/* LEFT ICON */}
<FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"/>

{/* INPUT */}
<input
type={show ? "text" : "password"}
value={value}
onChange={onChange}
placeholder={placeholder}
className="w-full border border-gray-300 rounded-lg pl-9 pr-10 py-2 bg-gray-50 focus:outline-none text-sm"
/>

{/* EYE ICON */}
<button
type="button"
onClick={()=>setShow(!show)}
className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black bg-transparent border-none outline-none focus:outline-none p-0"
>
{show ? <FaEyeSlash/> : <FaEye/>}
</button>

</div>

);
}