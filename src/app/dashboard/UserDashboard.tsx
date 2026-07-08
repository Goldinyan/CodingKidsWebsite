"use client";

import { updateUser } from "@/lib/db";
import { useState } from "react";
import { type UserData, type Filter, UserRole } from "@/BackEnd/type";
import { useAuth } from "@/context/AuthContext";
import { SortAsc, SortDesc, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useFilteredUsers, useUsersData } from "./users/hooks";
import { DeleteUserDialog, EditUserDialog, UserCard } from "./users/components";
import { useAppData } from "@/context/DataContext";

export default function UserDashboard() {
  const [searchBar, setSearchBar] = useState<string>("");
  const [seeAll, setSeeAll] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filter>({
    name: "false",
    birthYear: "false",
    role: "All",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<UserData>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string | null;
  }>({
    isOpen: false,
    userId: null,
    userName: null,
  });

  const { user, userRole } = useAuth();
  const { theme, isRounded } = useTheme();

  const { getUsers, loadingStates, refreshData } = useAppData();

  const rawUsers = getUsers();

  const filteredUsers = useFilteredUsers(rawUsers, searchBar, filters, seeAll);

  if (loadingStates.users && (!rawUsers || rawUsers.length === 0)) {
    return <p>Benutzerdaten werden geladen...</p>;
  }

  const saveUserChanges = async (uid: string) => {
    if (!editValues.name?.trim()) return;

    try {
      await updateUser(uid, editValues, user?.uid || "anonymous", userRole);

      // global reset
      await refreshData("users");

      setEditingId(null);
      setEditValues({});
    } catch (error) {
      console.error("Fehler beim Updaten des Users:", error);
    }
  };

  const handleEditStart = (u: UserData) => {
    setEditingId(u.uid);
    setEditValues({
      name: u.name,
      email: u.email,
      birthdate: u.birthdate,
      role: u.role,
    });
  };

  const radiusClass = isRounded ? "rounded-[16px]" : "rounded-none";

  return (
    <div
      className={`w-full min-h-screen py-14 px-6 font-['DM_Sans'] transition-colors duration-300 ${theme === "dark" ? "bg-black text-[#f4f4f5]" : "text-slate-700"
        }`}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-2 md:mb-4"
        >
          <span
            className={`font-['JetBrains_Mono'] text-[10px] tracking-[0.22em] uppercase block mb-2 ${theme === "dark" ? "text-[#a855f7]" : "text-purple-600"
              }`}
          >
            Systemsteuerung
          </span>
          <h1
            className={`text-4xl font-black font-['Familjen_Grotesk'] tracking-tight leading-none uppercase ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Nutzerverwaltung
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex-1 relative group">
            <Search
              className={`absolute left-4 top-3.5 w-4 h-4 transition-colors duration-200 ${theme === "dark"
                  ? "text-zinc-600 group-focus-within:text-[#4ADE80]"
                  : "text-slate-400 group-focus-within:text-green-600"
                }`}
            />
            <input
              type="text"
              placeholder="DURSUCHE USERS..."
              value={searchBar}
              onChange={(e) => setSearchBar(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 font-['JetBrains_Mono'] text-xs uppercase tracking-wider transition-all duration-200 focus:outline-none ${radiusClass} ${theme === "dark"
                  ? "bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)] text-white placeholder-zinc-600 focus:border-[#4ADE80] focus:bg-[rgba(255,255,255,0.04)]"
                  : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white shadow-sm"
                }`}
            />
          </div>

          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                name: prev.name === "ascending" ? "descending" : "ascending",
              }))
            }
            className={`p-3.5 transition-all duration-200 flex items-center justify-center ${radiusClass} ${theme === "dark"
                ? "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-zinc-400 hover:text-[#4ADE80] hover:border-[#4ADE80]"
                : "bg-white border border-slate-200 text-slate-500 hover:text-green-600 hover:border-green-600 shadow-sm"
              }`}
          >
            {filters.name === "ascending" ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-10 flex flex-wrap gap-2"
        >
          {(
            [
              { id: "All", label: "ALLE_USERS" },
              { id: "Mentor", label: "MENTORS" },
              { id: "Admin", label: "ADMINS" },
              { id: "User", label: "STANDARD_USERS" },
              { id: "Member", label: "SUBSCRIBED_MEMBERS" },
            ] as const
          ).map((role) => {
            const isSelected = filters.role === role.id;
            return (
              <button
                key={role.id}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    role: role.id as UserRole | "All",
                  }))
                }
                className={`px-4 py-2 font-['JetBrains_Mono'] text-[10px] tracking-widest uppercase transition-all duration-200 ${radiusClass} ${isSelected
                    ? theme === "dark"
                      ? "bg-[#7B028E] text-white border border-transparent"
                      : "bg-purple-600 text-white border border-transparent"
                    : theme === "dark"
                      ? "bg-[rgba(255,255,255,0.04)] text-zinc-400 border border-[rgba(255,255,255,0.08)] hover:border-[#a855f7] hover:text-white"
                      : "bg-white text-slate-500 border border-slate-200 hover:border-purple-600 hover:text-purple-600 shadow-sm"
                  }`}
              >
                {role.label}
              </button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
        >
          {filteredUsers.length === 0 ? (
            <div
              className={`col-span-full text-center py-24 border border-dashed ${radiusClass} ${theme === "dark"
                  ? "bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.05)]"
                  : "bg-slate-100/50 border-slate-200"
                }`}
            >
              <p
                className={`font-['JetBrains_Mono'] text-xs uppercase tracking-widest ${theme === "dark" ? "text-zinc-600" : "text-slate-400"}`}
              >
                {searchBar
                  ? "No system logs match specified search query"
                  : "Database execution returned empty set"}
              </p>
            </div>
          ) : (
            filteredUsers.map((u, idx) => (
              <motion.div
                key={u.uid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className={`p-1 transition-all duration-200 ${radiusClass} ${theme === "dark"
                    ? "bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)]"
                    : "bg-white border border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
              >
                <UserCard
                  user={u}
                  roleLabel={u.role}
                  onEdit={() => handleEditStart(u)}
                />
                {/*onDelete={() =>
                    setDeleteConfirm({
                      isOpen: true,
                      userId: u.uid,
                      userName: u.name,
                    })
                  }*/}
              </motion.div>
            ))
          )}
        </motion.div>

        {filteredUsers.length > 10 && (
          <motion.div layout className="flex items-center justify-center mt-14">
            <button
              onClick={() => setSeeAll(!seeAll)}
              className={`px-8 py-3 font-['JetBrains_Mono'] text-[11px] tracking-widest uppercase transition-all duration-200 ${radiusClass} ${theme === "dark"
                  ? "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-zinc-300 hover:text-[#4ADE80] hover:border-[#4ADE80]"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-green-600 hover:border-green-600 shadow-sm"
                }`}
            >
              {seeAll ? "Collapse Entries" : "Expand All Entries"}
            </button>
          </motion.div>
        )}
      </div>

      <EditUserDialog
        open={editingId !== null}
        onOpenChange={(open) => {
          if (!open) setEditingId(null);
        }}
        editValues={editValues}
        onEditValuesChange={setEditValues}
        onCancel={() => {
          setEditingId(null);
          setEditValues({});
        }}
        onSave={() => {
          if (editingId) saveUserChanges(editingId);
        }}
      />

      <DeleteUserDialog
        open={deleteConfirm.isOpen}
        userName={deleteConfirm.userName}
        userId={deleteConfirm.userId ?? ""}
        onOpenChange={(open) =>
          setDeleteConfirm({ isOpen: open, userId: null, userName: null })
        }
      />
    </div>
  );
}
