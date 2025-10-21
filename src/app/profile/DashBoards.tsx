import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getAllUsers, getUserData, updateUser } from "@/lib/db";
import { trace } from "firebase/performance";
import { deleteUser, User } from "firebase/auth";
import { allMentores } from "@/BackEnd/Mentoren";
import { useAuth } from "@/BackEnd/AuthContext";

type UserData = {
  uid: string;
  name: string;
  email: string;
  birthday: string; // ISO-String
  createdAt: Date;
  role: string;
};

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
      <p>Birthday: {data?.birthday}</p>
      <p>{data?.role}</p>
      <p onClick={() => deleteMyUser()}> DELETE </p>
      <p onClick={() => changeRole()}>Change to Admin</p>


    </div>
  );
}

type Preset = "false" | "ascending" | "descending";
type PresetRoles =
  | "false"
  | "N/A"
  | "Member"
  | "NotMember"
  | "Admin"
  | "Mentor";

export function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [filteredUsers, setFilteredUsers] = useState<Array<UserData>>([]);
  const [filterBySearch, setFilterBySearch] = useState<boolean>(false);
  const [searchBar, setSearchBar] = useState<string>("");
  const [filters, setFilters] = useState<{
    createdAt: Preset;
    name: Preset;
    birthYear: Preset;
    role: PresetRoles;
  }>({
    createdAt: "false",
    name: "false",
    birthYear: "false",
    role: "false",
  });

  const [data, setData] = useState<UserData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (searchBar !== "") {
      setFilterBySearch(true);
    } else {
      setFilterBySearch(false);
    }
  }, [searchBar]);

  useEffect(() => {
  const fetchData = async () => {
    if (!user) return;

    const data = await getUserData(user.uid);
    if (data) {
      setData(data);
    }
  };

  fetchData();
}, [user]);



  useEffect(() => {
    let filusers: Array<UserData> = [...users]; // Kopie

    if (filterBySearch && searchBar.trim() !== "") {
      const search = searchBar.toLowerCase();
      filusers = filusers.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.birthday?.toLowerCase().includes(search)
      );
    }

    if (filters.role !== "false") {
      const roleMap: Record<string, string> = {
        Admin: "admin",
        Member: "member",
        NotMember: "notmember",
        Mentor: "gast",
        "N/A": "N/A",
      };
      const role = roleMap[filters.role];
      if (role) {
        filusers = filusers.filter((u) => u.role === role);
      } else {
        console.warn("Ungültiger Filterwert für Rolle:", filters.role);
      }
    }

    if (filters.createdAt !== "false") {
      filusers = [...filusers].sort((a, b) =>
        filters.createdAt === "ascending"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (filters.birthYear !== "false") {
      filusers = [...filusers].sort((a, b) =>
        filters.birthYear === "ascending"
          ? new Date(a.birthday).getTime() - new Date(b.birthday).getTime()
          : new Date(b.birthday).getTime() - new Date(a.birthday).getTime()
      );
    }

    if (filters.name !== "false") {
      filusers = [...filusers].sort((a, b) =>
        filters.name === "ascending"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }

    setFilteredUsers(filusers);
  }, [users, searchBar, filters]);

  useEffect(() => {
   

    const fetchUsers = async () => {
      const start = performance.now();
      const data = await getAllUsers();
      setUsers(data);
      const end = performance.now();
      const dur = end - start;
      setDuration(dur);
    };
    fetchUsers();
  }, []);

  const roles = ["admin", "member", "mentor", "notmember", "N/A"];


  const deleteMyUser = async (
    u: UserData,
    event: React.MouseEvent<HTMLParagraphElement>
  ) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
      <p
        onClick={() => {
          setFilters((prev) => ({
            ...prev,
            name: "descending",
          }));
        }}
      >
        Filter By Name
      </p>

      <input value={searchBar} onChange={(e) => setSearchBar(e.target.value)} />

      <h1>Alle Nutzer</h1>
      {filteredUsers.map((user) => (
        <div key={user.uid} className="flex bg-blue-400 p-[2vw] m-[2vw]">
          <p>
            {user.name} ({user.email})
          </p>
          <p onClick={(e) => deleteMyUser(user, e)} className="text-red-700">
            DELETE
          </p>
          <select
            value={user.role}
            onChange={(e) => updateUser(user.uid, { role: e.target.value })}
          >
            <option value="mitglied">Mitglied</option>
            <option value="admin">Admin</option>
            <option value="gast">Gast</option>
          </select>
        </div>
      ))}
      </div>

      <div>
      </div>
    </div>
  );
}
