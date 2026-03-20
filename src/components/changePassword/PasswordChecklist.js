import React from "react";

export default function PasswordChecklist({password}){

const checks = {
length: password.length >= 8,
upper: /[A-Z]/.test(password),
lower: /[a-z]/.test(password),
number: /[0-9]/.test(password),
special: /[!@#$%^&*]/.test(password)
};

const Item = ({valid,text}) => (
<li className={valid ? "valid" : ""}>
{valid ? "✔" : "•"} {text}
</li>
);

return(

<div className="checklist">

<p>Password must contain:</p>

<ul>

<Item valid={checks.length} text="At least 8 characters"/>

<Item valid={checks.upper && checks.lower}
text="Uppercase & lowercase letter"/>

<Item valid={checks.number}
text="One number"/>

<Item valid={checks.special}
text="One special character"/>

</ul>

</div>

)

}