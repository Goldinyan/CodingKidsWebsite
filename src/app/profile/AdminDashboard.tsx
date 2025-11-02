"use client";

import type { Preset, PresetRoles, UserData } from "@/BackEnd/type";
import { useState, useEffect } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import { getUserData, getAllUsers, updateUser } from "@/lib/db";

export function IDK() {
  return (
  <div className="flex flex-col h-screen">
    {/* 🔝 Top-Leiste */}
    <div className="h-16 bg-gray-800 text-white flex items-center px-4">
      <p className="text-lg font-semibold">Mein Dashboard</p>
    </div>

    {/* 🧩 Hauptbereich */}
    <div className="flex flex-1">
      

      {/* Seitenleiste */}
      <div className="w-64 bg-white border-l p-6">
        <p className="text-lg font-semibold mb-2">Sidebar</p>
        <ul className="space-y-2">
          <li>
            <a className="text-blue-600 hover:underline">Einstellung 1</a>
          </li>
          <li>
            <a className="text-blue-600 hover:underline">Einstellung 2</a>
          </li>
        </ul>
      </div>

      {/* Hauptinhalt */}
      <div className="flex-1 bg-gray-100 p-6">
        <p className="text-xl font-bold mb-4">Account View</p>
        <p>Hier kommt dein Hauptinhalt rein.</p>
      </div>
    </div>
  </div>
);

}
export function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
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
      const data = await getAllUsers();
      setUsers(data);
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

        <input
          value={searchBar}
          onChange={(e) => setSearchBar(e.target.value)}
        />

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

      <div></div>
    </div>
  );
}
