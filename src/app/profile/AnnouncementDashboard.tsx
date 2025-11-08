"use client";

import { AnnouncementData, UserData } from "@/BackEnd/type";
import { getAllAdmins, getAllAnnouncements } from "@/lib/db";
import { useState, useEffect } from "react";

export default function Announcement() {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [admins, setAdmins] = useState<UserData[]>([]);

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
    console.log("Finding author for ID:", authorId);
    console.log("Current admins:", admins);
    const admin = admins.find((admin) => admin.uid === authorId);
    console.log("Found admin:", admin);
return admin?.name || admin?.email || "Unbekannt";
  };    

  return (
    <div>
      <div className="flex flex-col border border-lightborder">
        {announcements.map((announcement) => {

            const author = getAuthor(announcement.author);
          return (
            <div key={announcement.uid} className="flex flex-col">
              <p className="font-bold">{announcement.title}</p>
              <div>
                <p>
                  {"Veröffentlicht von: "}
                  {author}
                  {" am "}
                  {announcement.date.toLocaleString()}
                </p>
              </div>
              <p>{announcement.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
