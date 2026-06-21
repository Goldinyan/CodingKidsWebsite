"use client";

import { getUserData, updateUser } from "@/lib/db";
import { useState, useEffect } from "react";
import { type PresetRoles, type UserData, type Filter, USER_ROLES_ARRAY } from "@/BackEnd/type";
import { useAuth } from "@/BackEnd/AuthContext";
import {
  SortAsc,
  SortDesc,
  ArrowUpIcon,
  ArrowDownIcon,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { useFilteredUsers, useUsersData } from "./users/hooks";
import { DeleteUserDialog, EditUserDialog, UserCard } from "./users/components";
import { User } from "firebase/auth";

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
    user: User | null;
    userId: string | null;
    userName: string | null;
  }>({
    isOpen: false,
    user: null,
    userId: null,
    userName: null,
  });

  const { user, userRole, userData } = useAuth();
  const { theme, isRounded } = useTheme();

  const { users, setUsers } = useUsersData(user?.uid, userRole);
  const filteredUsers = useFilteredUsers(users, searchBar, filters, seeAll);


    const saveUserChanges = async (uid: string) => {
    if (!editValues.name?.trim()) {
      return;
    }

    await updateUser(uid, editValues, user?.uid || "anonymous", userRole);

    setUsers(users.map((u) => (u.uid === uid ? { ...u, ...editValues } : u)));

    setEditingId(null);
    setEditValues({});
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

  return (
    <div
      className={`w-full px-6 py-4 transition-colors duration-300 ${theme === "dark" ? "bg-black" : "bg-none"
        }`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1
            className={`text-5xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"
              }`}
          >
            Nutzerverwaltung
          </h1>
          <p
            className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-slate-600"
              }`}
          >
            Verwalten Sie Benutzer: Bearbeiten und Löschen
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex-1 relative">
            <Search
              className={`absolute left-3 top-3 w-5 h-5 transition-colors  ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark" ? "text-gray-600" : "text-slate-400"
                }`}
            />
            <input
              type="text"
              placeholder="Nutzer durchsuchen..."
              value={searchBar}
              onChange={(e) => setSearchBar(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border transition-colors duration-300 focus:outline-none ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark"
                  ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-white/20 focus:bg-white/10"
                  : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white"
                }`}
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex gap-2"
          >
            {filters.name === "ascending" ? (
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, name: "descending" }))
                }
                className={`p-2 border transition-colors duration-300 ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark"
                    ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    : "bg-slate-50 border-slate-300 hover:bg-white hover:border-slate-400"
                  }`}
              >
                <SortAsc
                  className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-slate-600"
                    }`}
                />
              </button>
            ) : (
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, name: "ascending" }))
                }
                className={`p-2 border transition-all duration-300 ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark"
                    ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    : "bg-slate-50 border-slate-300 hover:bg-white hover:border-slate-400"
                  }`}
              >
                <SortDesc
                  className={`w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-slate-600"
                    }`}
                />
              </button>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {(["All", "Mentor", "Admin", "User", "Member"] as const).map(
            (role) => (
              <motion.button
                key={role}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilters((prev) => ({ ...prev, role }))}
                className={`px-4 py-2 border transition-colors duration-300 font-medium ${isRounded ? "rounded-lg" : "rounded-none"} ${filters.role === role
                    ? theme === "dark"
                      ? "bg-white text-black border-white"
                      : "bg-green-600 text-white border-green-600"
                    : theme === "dark"
                      ? "bg-transparent text-white border-white/20 hover:border-white/40 hover:bg-white/5"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                  }`}
              >
                {role === "All"
                  ? "Alle"
                  : role === "User"
                    ? "User"
                    : role === "Member"
                      ? "Mitglied"
                      : role}
              </motion.button>
            ),
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
        >
          {filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p
                className={`text-lg ${theme === "dark" ? "text-gray-500" : "text-slate-500"
                  }`}
              >
                {searchBar
                  ? "Keine Nutzer gefunden, die Ihrer Suche entsprechen"
                  : "Keine Nutzer vorhanden."}
              </p>
            </div>
          ) : (
            filteredUsers.map((u, idx) => (
              <motion.div
                key={u.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <UserCard
                  user={u}
                  roleLabel={u.role}
                  onEdit={() => handleEditStart(u)}
                  onDelete={() =>
                    setDeleteConfirm({
                      isOpen: true,
                      userId: u.uid,
                      userName: u.name,
                    })
                  }
                />
              </motion.div>
            ))
          )}
        </motion.div>

        {filteredUsers.length > 10 && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSeeAll(!seeAll);
              }}
              className={`px-8 py-3 font-medium border transition-colors duration-300 ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark"
                  ? "bg-white text-black border-white hover:bg-gray-100"
                  : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                }`}
            >
              {seeAll ? "Weniger anzeigen" : "Mehr anzeigen"}
            </motion.button>
          </motion.div>
        )}
      </div>

      <EditUserDialog
        open={editingId !== null}
        theme={theme}
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
        userId={deleteConfirm.userId}
        onOpenChange={(open) =>
          setDeleteConfirm({ isOpen: open, userId: null, userName: null })
        }
      />
    </div>
  );
}
