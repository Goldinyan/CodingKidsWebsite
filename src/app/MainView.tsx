"use client"
import { Button } from "@/components/ui/button"
import MentorenView from "./MentorView"
import { useAuth } from "@/BackEnd/AuthContext"
import { logoutUser } from "@/lib/auth"

export default function MainView(){
  const { user, loading} = useAuth();

    return (
<div>
    <Button onClick={logoutUser}>Logout</Button>
    <p>{user ? user?.displayName : "Guest"}</p>
    <MentorenView />
</div>
    )
}