import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, user, perf, db } from "@/lib/firebase";
import { getAllUsers, updateUser } from "@/lib/db";
import { trace } from "firebase/performance";
import { deleteUser, User } from "firebase/auth";


import DurationDash from "./components/durationDash";

type UserData = {
  uid: string;   
  name: string;
  email: string;
  birthday: string; // ISO-String
  createdAt: Date;
  role: string;
};

export function Dashboard({ userData }: { userData: UserData }) {

const deleteMyUser = async() => {
  if (user) {
    deleteUser(user)
      .then(() => {
        console.log("User deleted")
      })
      .catch((error) => {
        console.log("Error deleting user", error)
      })
  }

}
  return (
    <div>
      <p onClick={deleteMyUser}> Delete My Account</p>
      <h1>Willkommen, {userData.name}</h1>
      <p>Email: {userData.email}</p>
      <p>
        Geburtstag:{" "}
        {userData.birthday
          ? new Date(userData.birthday).toLocaleDateString()
          : "Nicht angegeben"}
      </p>{" "}
      <p onClick={() => (deleteMyUser)}></p>
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

export function AdminDashboard({ userData }: { userData: UserData }) {
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
  useEffect(() => {
    if (searchBar !== "") {
      setFilterBySearch(true);
    } else {
      setFilterBySearch(false);
    }
  }, [searchBar]);

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
    if (!auth.currentUser) throw new Error("Nicht eingeloggt");

    const fetchUsers = async () => {
      const t = trace(perf, "getUser");
      const start = performance.now();
      t.start();
      const data = await getAllUsers();
      setUsers(data);
      t.stop();
      const end = performance.now();
      const dur = end - start;
      setDuration(dur);
    };
    fetchUsers();
  }, []);

  const roles = ["admin", "member", "mentor", "notmember", "N/A"];

  const createDummyUser = async () => {
    for (let i = 10; i < 30; i++) {
      await addDoc(collection(db, "users"), {
        name: `Dummy ${i}`,
        email: `dummy${i}@example.com`,
        birthdate: new Date(1990 + i, 0, 1).toISOString(),
        role: roles[i % roles.length],
      });
    }
  };

  const deleteMyUser = async (u: UserData, event: React.MouseEvent<HTMLParagraphElement>) => {
  let user: User;

  try {
      //  await deleteUser(u);
  } catch(error) {
    console.log(error)
  }
};


  
  return (
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

      <DurationDash duration={duration} />
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
  );
}
