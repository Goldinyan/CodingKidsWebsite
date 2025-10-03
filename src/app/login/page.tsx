"use client"

import LoginView from "./login"
import RegisterView from "./register"
import { useState, useEffect} from "react"
export default function Home(){
const [view, setView] = useState<"Login" | "SignUp">("Login")

    return (
        <div>
            <p onClick={()=>(setView("Login"))}>Login</p>
            <p onClick={()=>(setView("SignUp"))}>SignUp</p>

            {view === "Login" && <LoginView />}
            {view === "SignUp" && <RegisterView />}
            
        </div>
    )
}