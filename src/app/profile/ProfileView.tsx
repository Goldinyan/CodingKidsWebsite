"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/BackEnd/AuthContext";
import type { UserData } from "@/BackEnd/type";
import { getUserData } from "@/lib/db";
import { logoutUser } from "@/lib/auth";
import { LogOut, Mail, Cake, Calendar, BookOpen, Shield } from "lucide-react";

export default function ProfileView() {
  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const data = await getUserData(user.uid);

      if (data) {
        setUserData(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-otherbg">
        <div className="text-graytext">Lädt...</div>
      </div>
    );
  }

  if (!userData) {
    return <div></div>;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const calculateAge = (birthdate: string) => {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Mentor":
        return "bg-blue-100 text-blue-800";
      case "Member":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Shield className="w-4 h-4" />;
      case "Mentor":
        return <BookOpen className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-otherbg">
      <div className="bg-white border-b border-lightborder p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-primaryOwn">
            Mein Profil
          </h1>
          <button
            onClick={() => logoutUser()}
            className="flex items-center gap-2 px-4 py-2 bg-fourthOwn hover:bg-fifthOwn text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Abmelden</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-lightborder mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primaryOwn to-fourthOwn flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-white">
                  {getInitials(userData.name)}
                </span>
              </div>
            </div>

            <div className="flex-grow text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-primaryOwn mb-2">
                {userData.name}
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center sm:items-start">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-1 rounded-full font-semibold text-sm ${getRoleColor(userData.role)}`}
                >
                  {getRoleIcon(userData.role)}
                  {userData.role}
                </span>
                <span className="text-graytext text-sm">
                  Mitglied seit{" "}
                  {userData.createdAt?.toDate?.().toLocaleDateString("de-DE") ||
                    "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-lightPinkBg rounded-lg p-4 border border-lightborder">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-primaryOwn" />
                <span className="text-graytext font-medium">E-Mail</span>
              </div>
              <p className="text-foreground text-lg break-all">
                {userData.email}
              </p>
            </div>

            <div className="bg-lightGreenBg rounded-lg p-4 border border-lightborder">
              <div className="flex items-center gap-3 mb-2">
                <Cake className="w-5 h-5 text-secondaryOwn" />
                <span className="text-graytext font-medium">Geburtstag</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-foreground text-lg">
                  {new Date(userData.birthdate).toLocaleDateString("de-DE")}
                </p>
                <span className="text-graytext text-sm">
                  ({calculateAge(userData.birthdate)} Jahre)
                </span>
              </div>
            </div>

            <div className="bg-lightRedBg rounded-lg p-4 border border-lightborder">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-fourthOwn" />
                <span className="text-graytext font-medium">Benutzer ID</span>
              </div>
              <p className="text-foreground text-sm font-mono break-all">
                {userData.uid}
              </p>
            </div>

            <div className="bg-lightPinkBg rounded-lg p-4 border border-lightborder">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-primaryOwn" />
                <span className="text-graytext font-medium">Kurse</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {userData.courses && userData.courses.length > 0 ? (
                  userData.courses.map((course, idx) => (
                    <span
                      key={idx}
                      className="bg-secondaryOwn text-white px-3 py-1 rounded-full text-sm"
                    >
                      {course}
                    </span>
                  ))
                ) : (
                  <span className="text-graytext italic">Noch keine Kurse</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
