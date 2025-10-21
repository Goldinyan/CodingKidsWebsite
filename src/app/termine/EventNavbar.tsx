"use client";

import { useState, useEffect } from "react";
import { getUserData } from "@/lib/db";
import { useAuth } from "@/BackEnd/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import EventAdd from "./EventAdd";

interface EventNavbarProps {
  callback: (key: string, value: boolean | string) => void;
}

export default function EventNavbar({ callback }: EventNavbarProps) {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [userAdmin, setUserAdmin] = useState<boolean>(false);
  const [addEvent, setAddEvent] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      const data = await getUserData(user.uid);
      setUserData(data);
      if (data?.role === "admin") {
        setUserAdmin(true);
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <Card className="w-full border-primaryOwn text-white p-6 rounded-xl shadow-md flex  ">
      <div className="flex flex-row justify-between h-4">
        <div className="flex flex-row">
          <Select onValueChange={(value) => callback("course", value)}>
            <SelectTrigger className=" bg-white text-black border border-fourthOwn">
              <SelectValue placeholder="Alle Kurse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Kurse</SelectItem>
              <SelectItem value="normal">Coding Kids</SelectItem>
              <SelectItem value="3d">3D Druck</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <Switch
            id="available-switch"
            onCheckedChange={(checked) =>
              callback("showOnlyAvailable", checked)
            }
          />
          <Label htmlFor="available-switch" className="text-black text-xl">
            Nur freie Plätze
          </Label>
        </div>

        <div className="flex items-center gap-4">
          <Switch
            id="joinable-switch"
            onCheckedChange={(checked) => callback("showOnlyJoinable", checked)}
          />
          <Label htmlFor="joinable-switch" className="text-black text-xl">
            Nur beitretbare
          </Label>
          {userAdmin && (
            <Button
              variant="ghost"
              onClick={() => setAddEvent((prev) => !prev)}
              className="text-black"
            >
              {addEvent ? (
                <Minus className="w-5 h-5 transition-all" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>
      </div>
<div
  className={`transition-all duration-300 ease-in-out w-full  ${
    addEvent ? "opacity-100 max-h-[1000px]" : "opacity-0 max-h-0"
  }`}
>
  <EventAdd />
</div>



    </Card>
  );
}
