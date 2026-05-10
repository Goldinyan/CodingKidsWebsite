"use client";

import { getUserData, updateUser } from "@/lib/db";
import { useState, useEffect } from "react";
import type { PresetRoles, UserData, Filter } from "@/BackEnd/type";
import { useAuth } from "@/BackEnd/AuthContext";
import {
  SortAsc,
  SortDesc,
  ArrowUpIcon,
  ArrowDownIcon,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFilteredUsers, useUsersData } from "./users/hooks";
import { DeleteUserDialog, EditUserDialog, UserCard } from "./users/components";

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

  const [data, setData] = useState<UserData | null>(null);
  const { user, userRole } = useAuth();

  const { users, setUsers } = useUsersData(user?.uid, userRole);
  const filteredUsers = useFilteredUsers(users, searchBar, filters, seeAll);

  const presetRoles: string[] = ["admin", "member", "mentor", "notmember"];

  const presetRoleLabels: Record<string, string> = {
    admin: "Admin",
    member: "Mitglied",
    mentor: "Mentor",
    notmember: "User",
  };

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
    <div className="w-full p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Nutzerverwaltung
          </h1>
          <p className="text-gray-600">
            Verwalten Sie Benutzer: Bearbeiten und Löschen
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Nutzer durchsuchen..."
              value={searchBar}
              onChange={(e) => setSearchBar(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {filters.name === "ascending" ? (
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, name: "descending" }))
                }
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SortAsc className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, name: "ascending" }))
                }
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SortDesc className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(["All", "Mentor", "Admin", "User", "Member"] as const).map(
            (role) => (
              <button
                key={role}
                onClick={() => setFilters((prev) => ({ ...prev, role }))}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filters.role === role
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {role === "All"
                  ? "Alle"
                  : role === "User"
                    ? "User"
                    : role === "Member"
                      ? "Mitglied"
                      : role}
              </button>
            ),
          )}

          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={filters.birthYear !== "false"}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  birthYear: e.target.checked ? "ascending" : "false",
                }))
              }
              className="w-4 h-4"
            />
            <span className="text-sm">Alter</span>
            {filters.birthYear !== "false" &&
              (filters.birthYear === "ascending" ? (
                <ArrowUpIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilters((prev) => ({
                      ...prev,
                      birthYear: "descending",
                    }));
                  }}
                  className="w-4 h-4 cursor-pointer text-blue-600"
                />
              ) : (
                <ArrowDownIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilters((prev) => ({ ...prev, birthYear: "ascending" }));
                  }}
                  className="w-4 h-4 cursor-pointer text-blue-600"
                />
              ))}
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchBar
                  ? "Keine Nutzer gefunden, die Ihrer Suche entsprechen"
                  : "Keine Nutzer vorhanden."}
              </p>
            </div>
          ) : (
            filteredUsers.map((u) => (
              <UserCard
                key={u.uid}
                user={u}
                roleLabel={presetRoleLabels[u.role] || u.role}
                onEdit={() => handleEditStart(u)}
                onDelete={() =>
                  setDeleteConfirm({
                    isOpen: true,
                    userId: u.uid,
                    userName: u.name,
                  })
                }
              />
            ))
          )}
        </div>

        {(filteredUsers.length > 10 || filters.role === "All") && (
          <div className="flex items-center justify-center mt-8">
            <Button
              onClick={() => setSeeAll(!seeAll)}
              variant="outline"
              className="px-6"
            >
              {seeAll ? "Weniger anzeigen" : "Mehr anzeigen"}
            </Button>
          </div>
        )}
      </div>

      <EditUserDialog
        open={editingId !== null}
        onOpenChange={(open) => {
          if (!open) setEditingId(null);
        }}
        editValues={editValues}
        onEditValuesChange={setEditValues}
        presetRoles={presetRoles}
        presetRoleLabels={presetRoleLabels}
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
        onOpenChange={(open) =>
          setDeleteConfirm({ isOpen: open, userId: null, userName: null })
        }
      />
    </div>
  );
}
