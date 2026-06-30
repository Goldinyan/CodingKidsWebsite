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
      setAlert({ type: "error", message: "Bitte alle Felder ausfüllen" });
      return;
    }

    if (!emailForm.newEmail.includes("@")) {
      setAlert({ type: "error", message: "Ungültige E-Mail-Adresse" });
      return;
    }

    setLoading(true);
    try {
      await reAuthenticate(userData.email, emailForm.password);
      await changeEmail(emailForm.newEmail);
      setAlert({ type: "success", message: "E-Mail erfolgreich geändert" });
      setTimeout(() => onOpenChange(false), 2000);
      setEmailForm({ newEmail: "", password: "" });
    } catch (error: any) {
      const errorMessage = error.code === "auth/wrong-password" 
        ? "Passwort ist falsch" 
        : "Fehler beim Ändern der E-Mail";
      setAlert({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setAlert({ type: "error", message: "Bitte alle Felder ausfüllen" });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlert({ type: "error", message: "Neue Passwörter stimmen nicht überein" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setAlert({ type: "error", message: "Passwort muss mindestens 6 Zeichen lang sein" });
      return;
    }

    setLoading(true);
    try {
      await reAuthenticate(userData.email, passwordForm.currentPassword);
      await changePassword(passwordForm.newPassword);
      setAlert({ type: "success", message: "Passwort erfolgreich geändert" });
      setTimeout(() => onOpenChange(false), 2000);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      const errorMessage = error.code === "auth/wrong-password"
        ? "Aktuelles Passwort ist falsch"
        : "Fehler beim Ändern des Passworts";
      setAlert({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const roundedClass = isRounded ? "rounded-2xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-xl" : "rounded-none";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 ${roundedClass}`}
          >
            <div
              className={`p-6 border transition-all duration-300 ${roundedClass} ${
                theme === "dark"
                  ? "bg-black border-white/10"
                  : "bg-white border-slate-200"
              } shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  Sicherheit
                </h2>
                <button
                  onClick={() => onOpenChange(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "hover:bg-white/10 text-gray-400"
                      : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2 border-b mb-6 transition-colors duration-300">
                {(["email", "password"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setAlert(null);
                    }}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-300 border-b-2 ${
                      activeTab === tab
                        ? theme === "dark"
                          ? "border-green-500 text-green-400"
                          : "border-green-600 text-green-600"
                        : theme === "dark"
                        ? "border-transparent text-gray-400 hover:text-gray-300"
                        : "border-transparent text-slate-500 hover:text-slate-600"
                    }`}
                  >
                    {tab === "email" ? "E-Mail" : "Passwort"}
                  </button>
                ))}
              </div>

              {alert && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 p-4 mb-4 rounded-lg transition-colors duration-300 ${
                    alert.type === "success"
                      ? theme === "dark"
                        ? "bg-emerald-950/30 border border-emerald-900/50 text-emerald-300"
                        : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : alert.type === "error"
                      ? theme === "dark"
                        ? "bg-rose-950/30 border border-rose-900/50 text-rose-300"
                        : "bg-rose-50 border border-rose-200 text-rose-700"
                      : theme === "dark"
                      ? "bg-blue-950/30 border border-blue-900/50 text-blue-300"
                      : "bg-blue-50 border border-blue-200 text-blue-700"
                  } ${innerRoundedClass}`}
                >
                  {alert.type === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{alert.message}</p>
                </motion.div>
              )}

              <form
                onSubmit={activeTab === "email" ? handleEmailChange : handlePasswordChange}
                className="space-y-4"
              >
                {activeTab === "email" ? (
                  <>
                    <div>
                      <label
                        className={`block text-xs font-mono uppercase tracking-wider mb-2 ${
                          theme === "dark" ? "text-gray-400" : "text-slate-600"
                        }`}
                      >
                        Neue E-Mail
                      </label>
                      <input
                        type="email"
                        value={emailForm.newEmail}
                        onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                        placeholder="neue@email.de"
                        className={`w-full px-3 py-2 border rounded-lg transition-colors duration-300 text-sm ${
                          theme === "dark"
                            ? "bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-green-500"
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-green-600"
                        } outline-none`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-mono uppercase tracking-wider mb-2 ${
                          theme === "dark" ? "text-gray-400" : "text-slate-600"
                        }`}
                      >
                        Bestätigung (Passwort)
                      </label>
                      <input
                        type="password"
                        value={emailForm.password}
                        onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                        placeholder="Passwort"
                        className={`w-full px-3 py-2 border rounded-lg transition-colors duration-300 text-sm ${
                          theme === "dark"
                            ? "bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-green-500"
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-green-600"
                        } outline-none`}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label
                        className={`block text-xs font-mono uppercase tracking-wider mb-2 ${
                          theme === "dark" ? "text-gray-400" : "text-slate-600"
                        }`}
                      >
                        Aktuelles Passwort
                      </label>
                      <div
                        className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors duration-300 ${
                          theme === "dark"
                            ? "bg-white/5 border-white/10 focus-within:border-green-500"
                            : "bg-slate-50 border-slate-200 focus-within:border-green-600"
                        }`}
                      >
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                          }
                          placeholder="Aktuelles Passwort"
                          className={`flex-1 bg-transparent outline-none text-sm ${
                            theme === "dark"
                              ? "text-white placeholder-gray-600"
                              : "text-slate-900 placeholder-slate-400"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                          }
                          className={`p-1 ${
                            theme === "dark"
                              ? "text-gray-500 hover:text-gray-400"
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          {showPasswords.current ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-mono uppercase tracking-wider mb-2 ${
                          theme === "dark" ? "text-gray-400" : "text-slate-600"
                        }`}
                      >
                        Neues Passwort
                      </label>
                      <div
                        className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors duration-300 ${
                          theme === "dark"
                            ? "bg-white/5 border-white/10 focus-within:border-green-500"
                            : "bg-slate-50 border-slate-200 focus-within:border-green-600"
                        }`}
                      >
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                          placeholder="Neues Passwort"
                          className={`flex-1 bg-transparent outline-none text-sm ${
                            theme === "dark"
                              ? "text-white placeholder-gray-600"
                              : "text-slate-900 placeholder-slate-400"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className={`p-1 ${
                            theme === "dark"
                              ? "text-gray-500 hover:text-gray-400"
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-mono uppercase tracking-wider mb-2 ${
                          theme === "dark" ? "text-gray-400" : "text-slate-600"
                        }`}
                      >
                        Passwort wiederholen
                      </label>
                      <div
                        className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors duration-300 ${
                          theme === "dark"
                            ? "bg-white/5 border-white/10 focus-within:border-green-500"
                            : "bg-slate-50 border-slate-200 focus-within:border-green-600"
                        }`}
                      >
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                          }
                          placeholder="Passwort wiederholen"
                          className={`flex-1 bg-transparent outline-none text-sm ${
                            theme === "dark"
                              ? "text-white placeholder-gray-600"
                              : "text-slate-900 placeholder-slate-400"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                          }
                          className={`p-1 ${
                            theme === "dark"
                              ? "text-gray-500 hover:text-gray-400"
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                      : "bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                  }`}
                >
                  {loading ? "Wird verarbeitet..." : activeTab === "email" ? "E-Mail ändern" : "Passwort ändern"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
