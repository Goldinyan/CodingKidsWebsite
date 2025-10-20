"use client"
import { Button } from "@/components/ui/button"
import MentorenView from "./MentorView"
import { useAuth } from "@/BackEnd/AuthContext"

export default function MainView(){
  const { user, loading} = useAuth();

    return (
<div>
    <p>{user ? user?.displayName : "Guest"}</p>
    <MentorenView />
</div>
    )
}