import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";

export default function ProfilePhoto({ image, onImageChange }) {

const webcamRef = useRef(null);
const fileInputRef=useRef(null);

const [showCamera, setShowCamera] = useState(false);

// open webcam
const openCamera = () => {
setShowCamera(true);
};

// open file picker
const openFilePicker = () => {
fileInputRef.current.click();
};

// capture photo
const capturePhoto = () => {
const screenshot = webcamRef.current.getScreenshot();
onImageChange(screenshot);
setShowCamera(false);
};

// handle file upload
const handleFileChange = (e) => {
const file = e.target.files[0];
if(file){
const imageUrl = URL.createObjectURL(file);
onImageChange(imageUrl);
}
};


// close camera
const closeCamera = () => {
setShowCamera(false);
};





return (

<div className="profile-photo">

{/* AVATAR */}
<div className="avatar-wrapper">
<img src={image} alt="profile" />

<div className="camera-icon" onClick={openCamera}>
<FaCamera />
</div>
</div>

<div className="photo-content">

<h3>Profile Photo</h3>
<p>Update your photo for your team to recognize you.</p>

<button className="upload-btn" onClick={openFilePicker}>
Upload New
</button>

<button className="remove-btn" onClick={()=>onImageChange("")}>
Remove
</button>
<input
type="file"
accept="image/*"
ref={fileInputRef}
onChange={handleFileChange}
style={{ display: "none" }}
/>


</div>

{/* CAMERA MODAL */}
{showCamera && (
<div className="camera-modal">

<div className="camera-box">

<Webcam
ref={webcamRef}
screenshotFormat="image/jpeg"
className="webcam"
/>

<div className="camera-actions">

<button className="btn cancel" onClick={closeCamera}>
Cancel
</button>

<button className="btn primary" onClick={capturePhoto}>
Capture
</button>

</div>

</div>

</div>
)}

</div>

);

}