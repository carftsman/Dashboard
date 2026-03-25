import React from "react";
import ChangePasswordForm from "../components/changePassword/ChangePasswordForm";

export default function ChangePassword() {

return (

<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

<div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">

<h2 className="text-lg font-semibold mb-1">
Change Password
</h2>

<p className="text-xs text-gray-500 mb-5">
To protect your account, ensure your new password is at least 
12 characters long and includes a mix of letters, numbers and symbols.
</p>

<ChangePasswordForm/>

</div>

</div>

);
}