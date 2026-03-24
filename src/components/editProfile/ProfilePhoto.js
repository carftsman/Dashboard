import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";

export default function ProfilePhoto({ image, onImageChange }) {

const webcamRef = useRef(null);
const fileInputRef = useRef(null);
const [showCamera, setShowCamera] = useState(false);

const capturePhoto = () => {
const screenshot = webcamRef.current.getScreenshot();
onImageChange(screenshot);
setShowCamera(false);
};

return (

<div className="flex items-center gap-5 pb-5 border-b">

<div className="relative w-20 h-20">
<img src={image} className="w-full h-full rounded-full object-cover"/>

<div 
onClick={()=>setShowCamera(true)}
className="absolute bottom-0 right-0 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer border-2 border-white"
>
<FaCamera/>
</div>
</div>

<div>
<h3 className="font-semibold text-lg">Profile Photo</h3>
<p className="text-sm text-gray-500 mb-2">
Update your photo for your team to recognize you.
</p>

<button 
onClick={()=>fileInputRef.current.click()}
className="bg-gray-200 px-3 py-1 rounded-md text-sm mr-2"
>
Upload New
</button>

<button 
onClick={()=>onImageChange("")}
className="bg-gray-200 px-3 py-1 rounded-md text-sm"
>
Remove
</button>

<input
type="file"
ref={fileInputRef}
onChange={(e)=>onImageChange(URL.createObjectURL(e.target.files[0]))}
className="hidden"
/>

</div>

{showCamera && (
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
<div className="bg-white p-5 rounded-xl shadow-lg text-center">

<Webcam
ref={webcamRef}
screenshotFormat="image/jpeg"
className="w-[400px] h-[300px] rounded-lg"
/>

<div className="flex justify-center gap-3 mt-4">
<button 
onClick={()=>setShowCamera(false)}
className="bg-gray-200 px-4 py-2 rounded-md"
>
Cancel
</button>

<button 
onClick={capturePhoto}
className="bg-[#1e2b44] text-white px-4 py-2 rounded-md"
>
Capture
</button>
</div>

</div>
</div>
)}

</div>

)
}