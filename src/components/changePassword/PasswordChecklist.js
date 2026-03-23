import React from "react";

export default function PasswordChecklist({
isLengthValid,
hasUpperLower,
hasNumberSpecial,
isSameAsOld,
isMatch,
form
}) {

const Item = ({ valid, text }) => (
<li className={`text-sm ${valid ? "text-green-600 font-medium" : "text-gray-500"}`}>
{valid ? "✔" : "○"} {text}
</li>
);

return (

<div className="bg-gray-100 border rounded-lg p-3">

<h4 className="text-xs font-semibold mb-2 text-gray-700">
SECURITY CHECKLIST
</h4>

<ul className="space-y-1">

<Item valid={isLengthValid} text="Minimum 12 characters"/>
<Item valid={hasUpperLower} text="One uppercase & one lowercase"/>
<Item valid={hasNumberSpecial} text="One number & one special character"/>
<Item valid={!isSameAsOld && form.new} text="New password must be different from old"/>
<Item valid={isMatch && form.confirm} text="Passwords must match"/>

</ul>

</div>

);
}