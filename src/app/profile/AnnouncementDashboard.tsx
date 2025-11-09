"use client";

import { AnnouncementData, UserData } from "@/BackEnd/type";
import {
  getAllAdmins,
  getAllAnnouncements,
  getUserData,
  addAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} from "@/lib/db";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Check } from "lucide-react";
import { useAuth } from "@/BackEnd/AuthContext";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AnnouncementDashboard() {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [admins, setAdmins] = useState<UserData[]>([]);
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
  const [showAddAnnouncement, setShowAddAnnouncement] =
    useState<boolean>(false);
  const { user } = useAuth();
  const [editStates, setEditStates] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<
    Record<string, { title: string; content: string; tag?: string }>
  >({});
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<"User" | "Member">("User");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      if (user?.uid) {
        const data = await getUserData(user.uid);
        setUserIsAdmin(data?.role === "admin");
      } else {
        setUserIsAdmin(false);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const fetchAllAdmins = async () => {
      const admins = await getAllAdmins();
      console.log("Admins fetched:", admins);
      setAdmins(admins);
    };

    fetchAllAdmins();
  }, []);

  const getAuthor = (authorId: string) => {
    for (const admin of admins) {
      if (admin?.uid.trim() === authorId?.trim()) {
        return admin.name ?? admin.email ?? "Unbekannt";
      }
    }
    return "Unbekannt";
  };

  const toggleEdit = (announcement?: AnnouncementData) => {
    if (!announcement) return;
    setEditStates((prev) => ({
      ...prev,
      [announcement.uid]: !prev[announcement.uid],
    }));
    setEditValues((prev) => ({
      ...prev,
      [announcement.uid]: {
        title: announcement.title ?? "",
        content: announcement.content ?? "",
        tag: announcement.tag ?? "",
      },
    }));
  };

  const saveEdit = async (uid: string) => {
    const values = editValues[uid];
    if (!values) return;
    await updateAnnouncement(uid, {
      title: values.title,
      content: values.content,
    });
    setEditStates((prev) => ({ ...prev, [uid]: false }));
  };

  const handleDelete = async (uid: string) => {
    await deleteAnnouncement(uid);
    setAnnouncements((prev) => prev.filter((a) => a.uid !== uid));
  };

  const submitAddAnnouncement = () => async () => {
    if (!user) return;

    const newAnnouncement: AnnouncementData = {
      uid: "",
      title,
      content,
      tag: tags,
      author: user.uid,
      date: new Date(),
    };

    await addAnnouncement(newAnnouncement);
    setAnnouncements((prev) => [...prev, newAnnouncement]);
    setShowAddAnnouncement(false);
    setTitle("");
    setContent("");
    setTags("User");
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 w-full mt-5 ">
        
        <p className="text-xl font-semibold">Ankündigungen</p>
        <Button
          variant="outline"
          onClick={() => setShowAddAnnouncement((s) => !s)}
        >
          <Plus />
        </Button>
      </div>

      <div className="mt-4">
        {showAddAnnouncement && (
          <div>
            <Card className=" w-full flex flex-col items-center ">
              <div className="w-full" >
              <CardHeader className="flex flex-col">
                <p className="block text-sm font-bold mb-1 text-gray-900">
                  Titel:
                </p>
                <input
                  type="text"
                  placeholder="Titel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-50 border pl-3  mb-3 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-1"
                />
                <p className="block text-sm font-bold mb-1 text-gray-900">
                  Tag:
                </p>
                <select
                  value={tags}
                  onChange={(e) => setTags(e.target.value as "User" | "Member")}
                  className="bg-gray-50 border pl-3 mb-3 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-1 "
                >
                  <option value="User">User</option>
                  <option value="Member">Member</option>
                </select>

                <p className="block text-sm font-bold mb-1 text-gray-900">
                  Inhalt:
                </p>
                <textarea
                  placeholder="Inhalt"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-gray-50 border pl-3 mb-3 h-40 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-1"
                ></textarea>
              </CardHeader>
              <CardFooter>
                <div className="flex gap-2 mx-auto w-full items-center justify-center">
                  <Button variant="outline" onClick={submitAddAnnouncement()} className="w-full">
                    Hinzufügen
                  </Button>
                </div>
              </CardFooter>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="flex flex-col border border-lightborder mt-4 divide-y">
        {announcements.map((announcement) => {
          const author = getAuthor(announcement.author);

          return (
            <Card key={announcement.uid} className="">
              <CardHeader className="flex flex-col gap-2">
                {!editStates[announcement.uid] ? (
                  <>
                    <p className="font-bold text-xl">{announcement.title}</p>
                    <p className="text-sm text-gray-600">
                      {"Veröffentlicht von: "}
                      {author}
                      {" am "}
                      {new Date(announcement.date).toLocaleDateString("de-DE", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="pt-2">{announcement.content}</p>
                  </>
                ) : (
                  <div className="flex flex-col w-full">
                    <p className="block text-sm font-bold mb-1 text-gray-900">
                      Titel:
                    </p>
                    <input
                      value={editValues[announcement.uid]?.title ?? ""}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          [announcement.uid]: {
                            ...(prev[announcement.uid] ?? {}),
                            title: e.target.value,
                          },
                        }))
                      }
                      className="bg-gray-50 border pl-3 mb-3 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-1"
                    />

                    <p className="block text-sm font-bold mb-1 text-gray-900">
                      Inhalt:
                    </p>
                    <textarea
                      value={editValues[announcement.uid]?.content ?? ""}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          [announcement.uid]: {
                            ...(prev[announcement.uid] ?? {}),
                            content: e.target.value,
                          },
                        }))
                      }
                      className="bg-gray-50 border pl-3 mb-3 h-40 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-1"
                    />
                  </div>
                )}
              </CardHeader>

              <CardFooter className="flex justify-between">
                {!editStates[announcement.uid] ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => toggleEdit(announcement)}
                    >
                      Bearbeiten
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(announcement.uid)}
                    >
                      <Trash2 />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setEditStates((p) => ({
                          ...p,
                          [announcement.uid]: false,
                        }))
                      }
                    >
                      <X />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => saveEdit(announcement.uid)}
                    >
                      <Check />
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

//  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⠀⠀⠀⠀⠀
// ⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠈⢻⣷⣄⣀⣀⣠⣤⣴⣶⣶⣶⣶⣶⣶⣤⣤⣠⣾⡿⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⣻⣿⣿⣿⠿⠛⠛⠉⠉⠁⠀⠉⠉⠙⢻⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⣀⣾⡿⢿⣿⣇⠀⠀⠚⠀⠀⠀⠀⠀⠀⠀⣼⣿⠟⠿⣿⣿⣦⠀⠀⠀⠀
// ⠀⠀⣴⣿⠟⠁⠀⢿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⡟⠀⠀⠈⣿⣿⣷⡄⠀⠀
// ⠀⣼⣿⠃⠀⠀⠀⠈⣿⣿⠀⠀⠀⠀⠀⠀⠀⢀⣿⡿⠀⠀⠀⠀⠃⢻⣿⣿⡄⠀
// ⢸⣿⡇⠀⠀⠀⠀⠀⠸⣿⣇⠀⠀⠀⠀⠀⠀⣾⡿⠀⠀⠀⠀⠀⠃⠀⢻⣿⣿⡀
// ⣿⣿⡇⠀⠀⠀⠀⠀⠀⢹⣿⠀⠀⠀⠀⠀⣸⣿⠃⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⡇
// ⢿⣿⡇⠀⠀⠀⠀⠀⠀⠈⣿⡇⠀⠀⠀⢠⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷
// ⠸⣿⣿⡄⠀⠀⠀⠀⠀⠀⢹⣿⠀⠀⠀⣾⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⡇
// ⠀⢻⣿⣿⣄⠀⠀⠀⠀⠀⠘⣿⡇⠀⣴⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⡟⠀
// ⠀⠀⠹⣿⣿⣧⡀⠀⠀⠀⠀⢿⣿⡀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⠟⠀⠀
// ⠀⠀⠀⠈⢿⣿⣿⣦⣀⠀⠀⢸⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⣤⣾⣿⡿⠋⠀⠀⠀
// ⠀⠀⠀⠀⠀⠋⠻⢿⣿⣷⣤⣸⣿⣿⣿⣇⣀⣀⣀⣤⣶⣿⣿⣿⡿⠁⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⢿⠁⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠠⠀⠀⠀⠀⢤⠀⠙⢿⣿⣿⠟⠛⠉⢹⠁⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠃⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠃⠀⠀⠀⠀⠘⠀⠀⠀⠸⠀⠀⠀⠀⠀⠀⠀
