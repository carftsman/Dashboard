import React from "react";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaBriefcase } from "react-icons/fa";

export default function ProfileForm({ formData, onChange, errors }) {

return (

<div className="profile-form">

{/* ROW 1 */}
<div className="form-row">

{/* NAME */}
<div className="form-group">
<label>Full Name *</label>

<div className={`input-box ${errors?.name ? "error-input" : ""}`}>
<FaUser className="icon"/>
<input
value={formData.name}
onChange={(e)=>onChange("name", e.target.value)}
placeholder="Enter name"
/>
</div>

{errors?.name && <span className="error-text">{errors.name}</span>}

</div>

{/* PHONE */}
<div className="form-group">
<label>Phone Number *</label>

<div className={`input-box ${errors?.phone ? "error-input" : ""}`}>
<FaPhone className="icon"/>
<input
value={formData.phone}
onChange={(e)=>onChange("phone", e.target.value)}
placeholder="Enter phone"
/>
</div>

{errors?.phone && <span className="error-text">{errors.phone}</span>}

</div>

</div>

{/* ROW 2 */}
<div className="form-row">

{/* EMAIL */}
<div className="form-group">
<label>Email *</label>

<div className={`input-box ${errors?.email ? "error-input" : ""}`}>
<FaEnvelope className="icon"/>
<input
value={formData.email}
onChange={(e)=>onChange("email", e.target.value)}
placeholder="Enter email"
/>
</div>

{errors?.email && <span className="error-text">{errors.email}</span>}

</div>

{/* LOCATION */}
<div className="form-group">
<label>Location *</label>

<div className={`input-box ${errors?.location ? "error-input" : ""}`}>
<FaMapMarkerAlt className="icon"/>
<input
value={formData.location}
onChange={(e)=>onChange("location", e.target.value)}
placeholder="Enter location"
/>
</div>

{errors?.location && <span className="error-text">{errors.location}</span>}

</div>

</div>

{/* ROW 3 */}
<div className="form-row">

{/* DEPARTMENT */}
<div className="form-group">
<label>Department *</label>

<div className={`input-box ${errors?.department ? "error-input" : ""}`}>
<FaBuilding className="icon"/>
<select
value={formData.department || ""}
onChange={(e)=>onChange("department", e.target.value)}
>
<option value="">Select Department</option>
<option value="Engineering">Engineering</option>
<option value="Design">Design</option>
<option value="Product">Product</option>
</select>
</div>

{errors?.department && <span className="error-text">{errors.department}</span>}

</div>

{/* ROLE (FIXED POSITION) */}
<div className="form-group role-field">
<label>Role *</label>

<div className={`input-box ${errors?.role ? "error-input" : ""}`}>
<FaBriefcase className="icon"/>
<input
value={formData.role}
onChange={(e)=>onChange("role", e.target.value)}
placeholder="Enter role"
/>
</div>

{errors?.role && <span className="error-text">{errors.role}</span>}

</div>

</div>

{/* BIO */}
<div className="form-group full-width">
<label>Bio / Description *</label>

<textarea
value={formData.bio}
onChange={(e)=>onChange("bio", e.target.value)}
placeholder="Enter bio"
className={errors?.bio ? "error-input" : ""}
/>

{errors?.bio && <span className="error-text">{errors.bio}</span>}

</div>

</div>

);

}