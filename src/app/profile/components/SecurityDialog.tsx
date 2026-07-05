"use client";

import { useState } from "react";
import { Theme } from "@/context/ThemeContext";
import { UserData } from "@/BackEnd/type";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, X } from "lucide-react";
import { changeEmail, reAuthenticate, changePassword } from "@/lib/auth";
import { User } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

interface SecurityDialogProps {
  theme: Theme;
  isRounded: boolean;
  userData: UserData;
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AlertType = "success" | "error" | "info";
type TabType = "email" | "password";

export default function SecurityDialog({
  theme,
  isRounded,
  userData,
  user,
  open,
  onOpenChange,
}: SecurityDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>("email");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);

  const [emailForm, setEmailForm] = useState({ newEmail: "", password: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!emailForm.newEmail || !emailForm.password) {
      setAlert({ type: "error", message: "Bitte fülle alle Felder aus." });
      return;
    }

    if (!emailForm.newEmail.includes("@")) {
      setAlert({ type: "error", message: "Das ist keine gültige E-Mail-Adresse." });
      return;
    }

    setLoading(true);
    try {
      await reAuthenticate(userData.email, emailForm.password);
      await changeEmail(emailForm.newEmail);
      setAlert({ type: "success", message: "E-Mail-Adresse erfolgreich geändert!" });
      setTimeout(() => onOpenChange(false), 2000);
      setEmailForm({ newEmail: "", password: "" });
    } catch (error: any) {
      const errorMessage = error.code === "auth/wrong-password" 
        ? "Das Passwort ist falsch." 
        : "Fehler beim Ändern der E-Mail-Adresse.";
      setAlert({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setAlert({ type: "error", message: "Bitte fülle alle Felder aus." });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlert({ type: "error", message: "Die neuen Passwörter stimmen nicht überein." });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setAlert({ type: "error", message: "Das neue Passwort muss mindestens 6 Zeichen lang sein." });
      return;
    }

    setLoading(true);
    try {
      await reAuthenticate(userData.email, passwordForm.currentPassword);
      await changePassword(passwordForm.newPassword);
      setAlert({ type: "success", message: "Passwort erfolgreich geändert!" });
      setTimeout(() => onOpenChange(false), 2000);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      const errorMessage = error.code === "auth/wrong-password"
        ? "Dein aktuelles Passwort ist falsch."
        : "Fehler beim Ändern des Passworts.";
      setAlert({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const roundedClass = isRounded ? "rounded-xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-md" : "rounded-none";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.15 }}
            className={`fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-0.5 ${roundedClass}`}
          >
            <div
              className={`p-6 border transition-all duration-150 ${roundedClass} ${
                theme === "dark"
                  ? "bg-zinc-950 border-zinc-800 text-zinc-200"
                  : "bg-white border-slate-300 text-slate-900"
              } shadow-2xl flex flex-col gap-5`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span
                    className={`block font-mono text-[10px] font-bold tracking-widest uppercase ${
                      theme === "dark" ? "text-zinc-500" : "text-slate-400"
                    }`}
                  >
                    Sicherheit // Kontoeinstellungen
                  </span>
                  <h2 className="text-lg font-sans font-bold tracking-tight">
                    Zugangsdaten ändern
                  </h2>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className={`p-1.5 transition-colors ${innerRoundedClass} ${
                    theme === "dark"
                      ? "hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                      : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className={`flex gap-1 p-0.5 border ${innerRoundedClass} ${
                theme === "dark" ? "bg-zinc-900/40 border-zinc-900" : "bg-slate-100 border-slate-200"
              }`}>
                {(["email", "password"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setAlert(null);
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium transition-all duration-150 ${innerRoundedClass} ${
                      activeTab === tab
                        ? theme === "dark"
                          ? "bg-zinc-800 text-white shadow-sm"
                          : "bg-white text-slate-900 shadow-sm border border-slate-200/40"
                        : theme === "dark"
                        ? "text-zinc-500 hover:text-zinc-300"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {tab === "email" ? "E-Mail-Adresse" : "Passwort"}
                  </button>
                ))}
              </div>

              {/* Status Alerts */}
              <AnimatePresence mode="wait">
                {alert && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className={`flex items-start gap-2.5 p-3 text-xs ${innerRoundedClass} border ${
                      alert.type === "success"
                        ? theme === "dark"
                          ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-400"
                          : "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : theme === "dark"
                        ? "bg-rose-950/20 border-rose-900/60 text-rose-400"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                  >
                    {alert.type === "success" ? (
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="font-sans font-medium leading-relaxed">{alert.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forms */}
              <form
                onSubmit={activeTab === "email" ? handleEmailChange : handlePasswordChange}
                className="flex flex-col gap-4 font-['JetBrains_Mono'] text-xs"
              >
                {activeTab === "email" ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className={theme === "dark" ? "text-zinc-500" : "text-slate-400"}>
                        Neue E-Mail-Adresse
                      </label>
                      <input
                        type="email"
                        value={emailForm.newEmail}
                        onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                        placeholder="beispiel@codingkids.de"
                        className={`w-full px-3 py-2 border transition-all duration-150 text-sm font-sans outline-none ${innerRoundedClass} ${
                          theme === "dark"
                            ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:border-zinc-500"
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300 focus:border-slate-400"
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={theme === "dark" ? "text-zinc-500" : "text-slate-400"}>
                        Aktuelles Passwort eingeben
                      </label>
                      <input
                        type="password"
                        value={emailForm.password}
                        onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                        placeholder="Passwort zur Bestätigung"
                        className={`w-full px-3 py-2 border transition-all duration-150 text-sm font-sans outline-none ${innerRoundedClass} ${
                          theme === "dark"
                            ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:border-zinc-500"
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300 focus:border-slate-400"
                        }`}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className={theme === "dark" ? "text-zinc-500" : "text-slate-400"}>
                        Aktuelles Passwort
                      </label>
                      <div
                        className={`flex items-center gap-2 px-3 border transition-all duration-150 ${innerRoundedClass} ${
                          theme === "dark"
                            ? "bg-zinc-950 border-zinc-800 focus-within:border-zinc-500"
                            : "bg-slate-50 border-slate-200 focus-within:border-slate-400"
                        }`}
                      >
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                          }
                          placeholder="Dein altes Passwort"
                          className={`flex-1 py-2 bg-transparent outline-none text-sm font-sans ${
                            theme === "dark" ? "text-white placeholder-zinc-700" : "text-slate-900 placeholder-slate-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                          }
                          className={`p-1 ${theme === "dark" ? "text-zinc-600 hover:text-zinc-400" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          {showPasswords.current ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={theme === "dark" ? "text-zinc-500" : "text-slate-400"}>
                        Neues Passwort
                      </label>
                      <div
                        className={`flex items-center gap-2 px-3 border transition-all duration-150 ${innerRoundedClass} ${
                          theme === "dark"
                            ? "bg-zinc-950 border-zinc-800 focus-within:border-zinc-500"
                            : "bg-slate-50 border-slate-200 focus-within:border-slate-400"
                        }`}
                      >
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                          placeholder="Mindestens 6 Zeichen"
                          className={`flex-1 py-2 bg-transparent outline-none text-sm font-sans ${
                            theme === "dark" ? "text-white placeholder-zinc-700" : "text-slate-900 placeholder-slate-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className={`p-1 ${theme === "dark" ? "text-zinc-600 hover:text-zinc-400" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          {showPasswords.new ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={theme === "dark" ? "text-zinc-500" : "text-slate-400"}>
                        Neues Passwort wiederholen
                      </label>
                      <div
                        className={`flex items-center gap-2 px-3 border transition-all duration-150 ${innerRoundedClass} ${
                          theme === "dark"
                            ? "bg-zinc-950 border-zinc-800 focus-within:border-zinc-500"
                            : "bg-slate-50 border-slate-200 focus-within:border-slate-400"
                        }`}
                      >
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                          }
                          placeholder="Gleiches Passwort wie oben"
                          className={`flex-1 py-2 bg-transparent outline-none text-sm font-sans ${
                            theme === "dark" ? "text-white placeholder-zinc-700" : "text-slate-900 placeholder-slate-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                          }
                          className={`p-1 ${theme === "dark" ? "text-zinc-600 hover:text-zinc-400" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          {showPasswords.confirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 font-sans font-bold text-xs transition-all duration-150 border uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed mt-2 ${innerRoundedClass} ${
                    theme === "dark"
                      ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-950 border-zinc-100"
                      : "bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900"
                  }`}
                >
                  {loading ? "Wird gespeichert..." : activeTab === "email" ? "E-Mail ändern" : "Passwort ändern"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
