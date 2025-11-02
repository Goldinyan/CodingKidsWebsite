"use client";

import { getUserData, getAllUsers, updateUser } from "@/lib/db";
import { useState, useEffect } from "react";
import type { Preset, PresetRoles, UserData, Filter } from "@/BackEnd/type";
import { useAuth } from "@/BackEnd/AuthContext";
import {
  SortAsc,
  SortDesc,
  ArrowUpIcon,
  ArrowDownIcon,
  Search,
  Pencil,
  X,
} from "lucide-react";

export default function UserDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Array<UserData>>([]);
  const [searchBar, setSearchBar] = useState<string>("");
  const [seeAll, setSeeAll] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filter>({
    name: "false",
    birthYear: "false",
    role: "false",
  });
  const [editStates, setEditStates] = useState<Record<string, boolean>>({});
  const [data, setData] = useState<UserData | null>(null);
  const { user } = useAuth();

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

    if (searchBar !== "" && searchBar.trim() !== "") {
      const search = searchBar.toLowerCase();
      filusers = filusers.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.birthdate?.toLowerCase().includes(search)
      );
    }

    if (filters.role !== "false") {
      const roleMap: Record<string, string> = {
        Admin: "admin",
        Member: "member",
        User: "notmember",
        Mentor: "mentor",
        "N/A": "N/A",
      };
      const role = roleMap[filters.role];
      if (role) {
        filusers = filusers.filter((u) => u.role === role);
      } else {
        console.warn("Ungültiger Filterwert für Rolle:", filters.role);
      }
    }

    if (filters.birthYear !== "false") {
      filusers = [...filusers].sort((a, b) =>
        filters.birthYear === "ascending"
          ? new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime()
          : new Date(b.birthdate).getTime() - new Date(a.birthdate).getTime()
      );
    }

    if (filters.name !== "false") {
      filusers = [...filusers].sort((a, b) =>
        filters.name === "ascending"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }

    if (!seeAll) {
      filusers = filusers.slice(0, 10);
    }

    setFilteredUsers(filusers);
  }, [users, searchBar, filters, seeAll]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const deleteMyUser = async (
    u: UserData,
    event: React.MouseEvent<HTMLParagraphElement>
  ) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const toggleEdit = (uid: string) => {
    setEditStates((prev) => ({
      ...prev,
      [uid]: !prev[uid],
    }));
  };

  return (
    <div className="">
      <div className="flex flex-col gap-5 ">
        <div className="flex flex-row  gap-3 w-70 items-center">
          <div className="flex border flex-row gap-3 items-center border-lightborder p-2 rounded-md ">
            <Search className="h-5 text-gray-600" />
            <input
              className=""
              onChange={(e) => setSearchBar(e.target.value)}
              placeholder="Nutzer suchen..."
            ></input>
          </div>
          {filters.name === "ascending" ? (
            <div className="bg-lightPinkBg p-1.5 rounded-md">
              <SortAsc
                className="text-primaryOwn h-6 w-6"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, name: "descending" }));
                }}
              />
            </div>
          ) : (
            <div className="bg-lightPinkBg p-1.5 rounded-md">
              <SortDesc
                className="text-primaryOwn h-6 w-6"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, name: "ascending" }));
                }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-row gap-3 flex-wrap w-70 items-center">
          <p
            className={`${
              filters.role === "false"
                ? "bg-fifthOwn text-white"
                : "bg-white border border-lightborder text-black"
            }  px-2 py-1 rounded-md`}
            onClick={() => {
              setFilters((prev) => ({ ...prev, role: "false" }));
            }}
          >
            Alle
          </p>
          <p
            className={`${
              filters.role === "Mentor"
                ? "bg-fifthOwn text-white"
                : "bg-white border border-lightborder text-black"
            }  px-2 py-1 rounded-md`}
            onClick={() => {
              setFilters((prev) => ({ ...prev, role: "Mentor" }));
            }}
          >
            Mentor
          </p>
          <p
            className={`${
              filters.role === "Admin"
                ? "bg-fifthOwn text-white"
                : "bg-white border border-lightborder text-black"
            }  px-2 py-1 rounded-md`}
            onClick={() => {
              setFilters((prev) => ({ ...prev, role: "Admin" }));
            }}
          >
            Admin
          </p>
          <p
            className={`${
              filters.role === "User"
                ? "bg-fifthOwn text-white"
                : "bg-white border border-lightborder text-black"
            }  px-2 py-1 rounded-md`}
            onClick={() => {
              setFilters((prev) => ({ ...prev, role: "User" }));
            }}
          >
            User
          </p>
          <p
            className={`${
              filters.role === "Member"
                ? "bg-fifthOwn text-white"
                : "bg-white border border-lightborder text-black"
            }  px-2 py-1  rounded-md`}
            onClick={() => {
              setFilters((prev) => ({ ...prev, role: "Member" }));
            }}
          >
            Mitglied
          </p>

          <div className="flex items-center gap-3 border border-lightborder px-2 py-1 h-10 rounded-md bg-white">
            <label className="flex items-center cursor-pointer ">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.birthYear !== "false"}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      birthYear: e.target.checked ? "ascending" : "false",
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-fifthOwn transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="ml-3 text-sm pr-1">Alter</span>
            </label>

            {filters.birthYear !== "false" &&
              (filters.birthYear === "ascending" ? (
                <ArrowUpIcon
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, birthYear: "descending" }))
                  }
                  className="cursor-pointer text-fifthOwn"
                />
              ) : (
                <ArrowDownIcon
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, birthYear: "ascending" }))
                  }
                  className="cursor-pointer text-fifthOwn"
                />
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 divide-y divide-gray-200 w-70 border border-lightborder bg-white rounded-md">
          {filteredUsers.map((user) => {

            const isEditing = editStates[user.uid] || false;

            return (
              <div key={user.uid} className="flex flex-col p-2">
                <div className="flex flex-row  items-center justify-between px-4">
                  <div className="flex flex-col">
                    <p className="font-bold">{user.name}</p>
                    <p>{user.role}</p>
                  </div>

                  {isEditing ? (
                    <X
                      className="text-fifthOwn"
                      onClick={() => toggleEdit(user.uid)}
                    />
                  ) : (
                    <Pencil
                      className="h-5 text-fifthOwn"
                      onClick={() => toggleEdit(user.uid)}
                    />
                  )}

                  {/* <p onClick={(e) => deleteMyUser(user, e)} className="text-red-700">
              DELETE
            </p> */}
                </div>
                                    

                {isEditing && (
                  <>
                  <p className="text-md font-bold pl-4 py-2">User Information:</p>
                  <div className="flex flex-col justify-center px-4 mx-3 py-2 gap-2 border rounded-md border-lightborder">
                    <div>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p>
                        {new Date(user.birthdate).toLocaleDateString("de-DE", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p>{user.name}</p>
                    </div>
                  </div>
                  </>
                )}
              </div>
              
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center mt-5 mx-auto p-2 rounded-md w-50 border border-lightborder">
        {seeAll ? (
          <p className="text-xl font-bold" onClick={() => setSeeAll(false)}>Sehe weniger</p>
        ) : (
          <p className="text-xl font-bold" onClick={() => setSeeAll(true)}>Sehe mehr</p>
        )}
      </div>
    </div>
  );
}
