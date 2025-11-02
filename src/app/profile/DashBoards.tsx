import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getAllUsers, getUserData, updateUser } from "@/lib/db";
import { deleteUser, User } from "firebase/auth";
import { useAuth } from "@/BackEnd/AuthContext";
import type { UserData } from "@/BackEnd/type"


export function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<UserData | null>(null);

  const changeRole = async () => {
    console.log("Changing role to admin");
   if (!user) return;
   const userData = await getUserData(user.uid);
   if (!userData) return;
   await updateUser(userData.uid, { role: "admin" });
 };

 useEffect(() => {
  const fetchData = async () => {
    if (!user) return;

    const data = await getUserData(user.uid);
    

    if (data) {
      setData(data);
      console.log("Rohdaten aus Firestore:", data);
      console.log("Extrahierte Rolle:", data.role);
    }
  };

  fetchData();
}, [user]);


 const deleteMyUser = async () => {
    if (user) {
      deleteUser(user)
        .then(() => {
          console.log("User deleted");
        })
        .catch((error) => {
          console.log("Error deleting user", error);
        });
    }
  };

  


  return (
    <div>
      <p onClick={deleteMyUser}> Delete My Account</p>
      <h1>Dashboard</h1>
      <p>Name: {data?.name}</p>
      <p>Email: {data?.email}</p>
      <p>Birthday: {data?.birthdate}</p>
      <p>{data?.role}</p>
      <p onClick={() => deleteMyUser()}> DELETE </p>
      <p onClick={() => changeRole()}>Change to Admin</p>


    </div>
  );
}



