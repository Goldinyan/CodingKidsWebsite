"use client";

import {
        addAnnouncement,
        deleteAnnouncement,
        updateAnnouncement,
} from "@/lib/db/announcements";
import type { AnnouncementData } from "@/BackEnd/type";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useAuth } from "@/BackEnd/AuthContext";
import { Button } from "@/components/ui/button";
import { Timestamp } from "firebase/firestore";
import { getAuthorName } from "./announcements/getAuthor";
import {
        useAdmins,
        useAnnouncementsData,
        useFilteredAnnouncements,
        useUserIsAdmin,
} from "./announcements/hooks";
import {
        AnnouncementCard,
        DeleteAnnouncementDialog,
        EditAnnouncementDialog,
        NewAnnouncementDialog,
} from "./announcements/components";

export default function AnnouncementDashboard() {
        const [isAddingAnnouncement, setIsAddingAnnouncement] =
                useState<boolean>(false);
        const [editingId, setEditingId] = useState<string | null>(null);
        const [searchBar, setSearchBar] = useState<string>("");
        const { user, userRole } = useAuth();
        const userIsAdmin = useUserIsAdmin(user?.uid);
        const admins = useAdmins(user?.uid, userRole);
        const { announcements, setAnnouncements } = useAnnouncementsData(user?.uid, userRole);
        const filteredAnnouncements = useFilteredAnnouncements(announcements, searchBar);
        const [editValues, setEditValues] = useState<{
                title: string;
                content: string;
        }>({
                title: "",
                content: "",
        });
        const [newAnnouncement, setNewAnnouncement] = useState<{
                title: string;
                content: string;
                tag: "User" | "Member";
        }>({
                title: "",
                content: "",
                tag: "User",
        });
        const [deleteConfirm, setDeleteConfirm] = useState<{
                isOpen: boolean;
                announcementId: string | null;
                announcementTitle: string | null;
        }>({
                isOpen: false,
                announcementId: null,
                announcementTitle: null,
        });

        const handleAddAnnouncement = async () => {
                if (!user || !newAnnouncement.title.trim()) {
                        return;
                }

                const announcementToAdd: AnnouncementData = {
                        uid: "",
                        title: newAnnouncement.title,
                        content: newAnnouncement.content,
                        tag: newAnnouncement.tag,
                        author: user.uid,
                        date: Timestamp.fromDate(new Date()),
                };

                await addAnnouncement(announcementToAdd, user.uid, userRole);
                setAnnouncements((prev) => [...prev, announcementToAdd]);
                setIsAddingAnnouncement(false);
                setNewAnnouncement({ title: "", content: "", tag: "User" });
        };

        const handleEditStart = (announcement: AnnouncementData) => {
                setEditingId(announcement.uid);
                setEditValues({
                        title: announcement.title,
                        content: announcement.content,
                });
        };

        const handleSaveEdit = async (uid: string) => {
                await updateAnnouncement(
                        uid,
                        {
                                title: editValues.title,
                                content: editValues.content,
                        },
                        user?.uid || "anonymous",
                        userRole,
                );
                setAnnouncements(
                        announcements.map((a) => (a.uid === uid ? { ...a, ...editValues } : a)),
                );
                setEditingId(null);
                setEditValues({ title: "", content: "" });
        };

        const handleDelete = async (uid: string) => {
                await deleteAnnouncement(uid, user?.uid || "anonymous", userRole);
                setAnnouncements((prev) => prev.filter((a) => a.uid !== uid));
                setDeleteConfirm({
                        isOpen: false,
                        announcementId: null,
                        announcementTitle: null,
                });
        };

        return (
                <div className="w-full p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
                        <div className="max-w-7xl mx-auto">
                                <div className="mb-8">
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                                Ankündigungen
                                        </h1>
                                        <p className="text-gray-600">
                                                Verwalten Sie Ankündigungen für Benutzer
                                        </p>
                                </div>

                                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div className="flex-1 relative">
                                                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                                <input
                                                        type="text"
                                                        placeholder="Ankündigungen durchsuchen..."
                                                        value={searchBar}
                                                        onChange={(e) => setSearchBar(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                        </div>

                                        {userIsAdmin && (
                                                <Button
                                                        onClick={() => setIsAddingAnnouncement(true)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                                >
                                                        <Plus className="w-5 h-5" />
                                                        Neue Ankündigung
                                                </Button>
                                        )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                                        {filteredAnnouncements.length === 0 ? (
                                                <div className="col-span-full text-center py-12">
                                                        <p className="text-gray-500 text-lg">
                                                                {searchBar
                                                                        ? "Keine Ankündigungen gefunden"
                                                                        : "Keine Ankündigungen vorhanden"}
                                                        </p>
                                                </div>
                                        ) : (
                                                filteredAnnouncements.map((announcement) => (
                                                        <AnnouncementCard
                                                                key={announcement.uid}
                                                                announcement={announcement}
                                                                authorName={getAuthorName(admins, announcement.author)}
                                                                userIsAdmin={userIsAdmin}
                                                                onEdit={() => handleEditStart(announcement)}
                                                                onDelete={() =>
                                                                        setDeleteConfirm({
                                                                                isOpen: true,
                                                                                announcementId: announcement.uid,
                                                                                announcementTitle: announcement.title,
                                                                        })
                                                                }
                                                        />
                                                ))
                                        )}
                                </div>
                        </div>

                        <NewAnnouncementDialog
                                open={isAddingAnnouncement}
                                onOpenChange={setIsAddingAnnouncement}
                                value={newAnnouncement}
                                onChange={setNewAnnouncement}
                                onCreate={handleAddAnnouncement}
                        />

                        <EditAnnouncementDialog
                                open={editingId !== null}
                                onOpenChange={(open) => {
                                        if (!open) setEditingId(null);
                                }}
                                value={editValues}
                                onChange={setEditValues}
                                onCancel={() => {
                                        setEditingId(null);
                                        setEditValues({ title: "", content: "" });
                                }}
                                onSave={() => {
                                        if (editingId) handleSaveEdit(editingId);
                                }}
                        />

                        <DeleteAnnouncementDialog
                                open={deleteConfirm.isOpen}
                                title={deleteConfirm.announcementTitle}
                                onOpenChange={(open) =>
                                        setDeleteConfirm({
                                                isOpen: open,
                                                announcementId: open ? deleteConfirm.announcementId : null,
                                                announcementTitle: open ? deleteConfirm.announcementTitle : null,
                                        })
                                }
                                onConfirm={() => {
                                        if (deleteConfirm.announcementId) handleDelete(deleteConfirm.announcementId);
                                }}
                        />
                </div>
        );
}
