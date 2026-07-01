import { Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import type { UserData, UserRole } from "@/BackEnd/type";
import { toJsDate } from "@/BackEnd/utils";
import { useEffect, useState } from "react";

export function UserCard(props: {
  user: UserData;
  roleLabel: UserRole;
  onEdit: () => void;
  //onDelete: () => void;
}) {
  const { user, roleLabel, onEdit } = props;
  const { theme, isRounded } = useTheme();
  const [label, setLabel] = useState<string>();

  console.log(roleLabel)

  useEffect(() => {
    switch (roleLabel) {
      case "mentor":
        setLabel("Mentor");
        break;
     
      case "user":
        setLabel("User");
        break;
      case "member":
        setLabel("Member");
        break;
    }
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`p-6 backdrop-blur-2xl border transition-colors duration-300  ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark"
          ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
          : "bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400"
        }`}
    >
      <div className={`mb-6`}>
        <h3
          className={`text-xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"
            }`}
        >
          {user.name}
        </h3>
        <div
          className={`space-y-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-600"
            }`}
        >
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Rolle:</strong> {label}
          </p>
          {user.birthdate && (
            <p>
              <strong>Geburtsdatum:</strong>{" "}
              {new Date(toJsDate(user.birthdate)).toLocaleDateString("de-DE")}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className={`flex-1 px-4 py-2 font-medium border transition-colors duration-300 flex items-center justify-center gap-2 ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark"
              ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
              : "bg-green-600 text-white border-green-600 hover:bg-green-700"
            }`}
        >
          <Edit2 className="w-4 h-4" />
          
          Bearbeiten
        </motion.button>
        {/*
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className={`flex-1 px-4 py-2 font-medium border transition-all duration-300 flex items-center justify-center gap-2 ${isRounded ? "rounded-lg" : "rounded-none"} ${theme === "dark"
              ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
              : "bg-red-600 text-white border-red-600 hover:bg-red-700"
            }`}
        >
          <Trash2 className="w-4 h-4" />
          Löschen

        </motion.button> */}
      </div>
    </motion.div>
  );
}
