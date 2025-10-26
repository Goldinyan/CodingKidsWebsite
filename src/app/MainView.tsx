"use client"
import { Button } from "@/components/ui/button"
import MentorenView from "./verein/MentorView"
import { useAuth } from "@/BackEnd/AuthContext"
import { logoutUser } from "@/lib/auth"
import HeroSection from "./HeroSection"

export default function MainView(){
  const { user, loading} = useAuth();

    return (
<div>
    
    <p>{user ? user?.displayName : "Guest"}</p>
   
</div>
    )
}


