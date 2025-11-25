
import { useAuth } from "@/BackEnd/AuthContext";
import ProfileView from "./ProfileView";


export default function Home(){

    return (
        <div>
          <div className="mt-40">
            <ProfileView />
          </div>
        </div>
    )
}