import { useAuth } from "@/BackEnd/AuthContext";
import ProfileView from "./ProfileView";

export default function Home() {
  return (
    <div>
      <div className="mt-15">
        <ProfileView />
      </div>
    </div>
  );
}
