import { createContext,useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const AuthContext= createContext()
export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
    const navigate =useNavigate()
    useEffect(()=>{
        const token =localStorage.getItem("token")
        const role = localStorage.getItem("role")
        if(token && role){
            setUser({token,role})
        }
    },[])
    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        setUser(null)
        navigate("/")
    }
    return <AuthContext.Provider value={{user,setUser,logout}}>
        {children}
    </AuthContext.Provider>
}