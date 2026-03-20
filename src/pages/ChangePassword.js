import React from "react";
import ChangePasswordForm from "../components/changePassword/ChangePasswordForm";
import "../components/changePassword/changePassword.css";

export default function ChangePassword() {

return (

<div className="change-password-page">

<div className="password-card">

<h2>Change Password</h2>

<p className="subtitle">
To protect your account, ensure your new password is at least 
8 characters long and includes a a mix of letters, numbers and symbols.
</p>

<ChangePasswordForm/>

</div>

</div>

)

}