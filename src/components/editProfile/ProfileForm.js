import React from "react";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaBriefcase } from "react-icons/fa";

export default function ProfileForm({ formData, onChange, errors }) {

const inputStyle = "w-full bg-transparent outline-none text-sm";
const boxStyle = "flex items-center border rounded-md px-3 py-2 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white";

return (

<div className="mt-6 space-y-4">

{/* ROW 1 */}
<div className="grid grid-cols-2 gap-4">

<div>
<label className="text-xs text-gray-600">Full Name *</label>
<div className={`${boxStyle} ${errors?.name && "border-red-500 bg-red-50"}`}>
<FaUser className="mr-2 text-gray-400 text-sm"/>
<input value={formData.name} onChange={(e)=>onChange("name", e.target.value)} className={inputStyle}/>
</div>
{errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
</div>

<div>
<label className="text-xs text-gray-600">Phone Number *</label>
<div className={`${boxStyle} ${errors?.phone && "border-red-500 bg-red-50"}`}>
<FaPhone className="mr-2 text-gray-400 text-sm"/>
<input value={formData.phone} onChange={(e)=>onChange("phone", e.target.value)} className={inputStyle}/>
</div>
{errors?.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
</div>

</div>

{/* ROW 2 */}
<div className="grid grid-cols-2 gap-4">

<div>
<label className="text-xs text-gray-600">Email *</label>
<div className={`${boxStyle} ${errors?.email && "border-red-500 bg-red-50"}`}>
<FaEnvelope className="mr-2 text-gray-400 text-sm"/>
<input value={formData.email} onChange={(e)=>onChange("email", e.target.value)} className={inputStyle}/>
</div>
{errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
</div>

<div>
<label className="text-xs text-gray-600">Location *</label>
<div className={`${boxStyle} ${errors?.location && "border-red-500 bg-red-50"}`}>
<FaMapMarkerAlt className="mr-2 text-gray-400 text-sm"/>
<input value={formData.location} onChange={(e)=>onChange("location", e.target.value)} className={inputStyle}/>
</div>
{errors?.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
</div>

</div>

{/* ROW 3 */}
<div className="grid grid-cols-2 gap-4">

<div>
<label className="text-xs text-gray-600">Department *</label>
<div className={`${boxStyle} ${errors?.department && "border-red-500 bg-red-50"}`}>
<FaBuilding className="mr-2 text-gray-400 text-sm"/>
<select value={formData.department || ""} onChange={(e)=>onChange("department", e.target.value)} className={inputStyle}>
<option value="">Select Department</option>
<option value="Engineering">Engineering</option>
<option value="Design">Design</option>
<option value="Product">Product</option>
</select>
</div>
{errors?.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
</div>

<div>
<label className="text-xs text-gray-600">Role *</label>
<div className={`${boxStyle} ${errors?.role && "border-red-500 bg-red-50"}`}>
<FaBriefcase className="mr-2 text-gray-400 text-sm"/>
<input value={formData.role} onChange={(e)=>onChange("role", e.target.value)} className={inputStyle}/>
</div>
{errors?.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
</div>

</div>

{/* BIO */}
<div>
<label className="text-xs text-gray-600">Bio / Description *</label>
<textarea
value={formData.bio}
onChange={(e)=>onChange("bio", e.target.value)}
className={`w-full mt-1 border rounded-md px-3 py-2 text-sm bg-gray-50 focus:border-blue-500 focus:bg-white ${errors?.bio && "border-red-500 bg-red-50"}`}
/>
{errors?.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
</div>

</div>

)
}