import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

const [user, setUser] = useState({
name:"",
role:"",
department:"",
email:"",
phone:"",
location:"",
status:"Active",
bio:"",
image:""
});

return (
<UserContext.Provider value={{ user, setUser }}>
{children}
</UserContext.Provider>
);

};