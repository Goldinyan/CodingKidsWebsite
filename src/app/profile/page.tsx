"use client"

import { useAuth } from "@/BackEnd/AuthContext"
import { useEffect } from "react"
import ProfileMainView from "./ProfileMainView"

export default function Home(){
  const { user, loading } = useAuth();

   
   useEffect(() => {
    if (!loading && !user) {
     
    }
  }, [user, loading]);

    return (
        <div>
      
           
           <ProfileMainView />
        </div>
    )
}