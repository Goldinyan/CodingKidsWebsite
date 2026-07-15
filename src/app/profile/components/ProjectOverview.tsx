"use client";

import { useTheme } from "@/context/ThemeContext";
import { FolderGit2, UploadCloud, Loader2, Download, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef } from "react";
import { uploadScratchProject } from "@/lib/db/files";
import { useNotificationToast } from "@/hooks/useNotificationToast";
import { ScratchProject } from "@/BackEnd/type";
import { toJsDate } from "@/BackEnd/utils";

export default function ProjectOverview() {
  const { theme, isRounded } = useTheme();
  const { userData, userRole } = useAuth();
  const { showInfoToast, showErrorToast, showSuccessToast } =
    useNotificationToast();

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roundedClass = isRounded ? "rounded-xl" : "rounded-none";
  const innerRoundedClass = isRounded ? "rounded-md" : "rounded-none";

  const projects: ScratchProject[] = userData?.projects || [];
  const userId = userData?.uid || "anonymous";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };


  const processFile = async (file: File) => {
    if (!file.name.endsWith(".sb3")) {
      showInfoToast("GENERIC_INFO", {
        title: "Ungültige Datei",
        description: "Bitte lade eine Scratch-Datei (.sb3) hoch.",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Kein FormData mehr! Einfach direkt die Datei übergeben
      const downloadUrl = await uploadScratchProject(file, userId, userRole);
      console.log("Upload erfolgreich! URL:", downloadUrl);

      showSuccessToast("SAVE_SUCCESS", {
        title: "Upload erfolgreich",
        description: "Dein Projekt wurde erfolgreich hochgeladen.",
      });
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Unbekannt";
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 p-6 border min-h-[300px] flex flex-col gap-5 transition-all duration-200 ${roundedClass} ${isDragging
          ? "border-dashed border-green-500 bg-green-500/5 scale-[0.99]"
          : theme === "dark"
            ? "bg-[rgba(255,255,255,0.02)] border-zinc-800"
            : "bg-slate-50 border-slate-300"
        } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".sb3"
        disabled={isUploading}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <span
          className={`block font-['JetBrains_Mono'] text-[10px] font-bold tracking-widest uppercase transition-colors ${isDragging
              ? "text-green-400"
              : theme === "dark"
                ? "text-green-500"
                : "text-green-400"
            }`}
        >
          Storage {isUploading && "(Uploading...)"}
        </span>

        {projects.length > 0 && !isUploading && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-1.5 border transition-colors ${innerRoundedClass} ${theme === "dark"
                ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
            title="Projekt hochladen"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isUploading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-green-500 mb-2" />
          <p
            className={`text-sm font-medium ${theme === "dark" ? "text-zinc-300" : "text-slate-800"}`}
          >
            Dein Projekt wird hochgeladen...
          </p>
        </div>
      ) : isDragging ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
          <div
            className={`p-3 border mb-3 bg-green-500/10 border-green-500/30 text-green-400 ${innerRoundedClass}`}
          >
            <UploadCloud className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-sm font-medium mb-1 font-sans text-green-400">
            Lass die Datei einfach fallen!
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div
            className={`p-3 border mb-3 transition-colors duration-150 ${innerRoundedClass} ${theme === "dark"
                ? "bg-zinc-950/40 border-zinc-900 text-zinc-600"
                : "bg-white border-slate-200 text-slate-400"
              }`}
          >
            <FolderGit2 className="w-6 h-6" />
          </div>

          <p
            className={`text-sm font-medium mb-1 font-sans ${theme === "dark" ? "text-zinc-300" : "text-slate-800"}`}
          >
            Momentan noch keine Projekte
          </p>
          <p
            className={`text-xs max-w-xs font-sans mb-5 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
          >
            Ziehe deine Scratch-Datei direkt hier hinein oder starte ein neues
            Abenteuer!
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`px-4 py-2 border font-['JetBrains_Mono'] text-[11px] font-bold tracking-wider uppercase transition-colors ${innerRoundedClass} ${theme === "dark"
                ? "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
          >
            Datei auswählen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className={`p-4 border transition-colors duration-150 flex flex-col justify-between gap-3 ${innerRoundedClass} ${theme === "dark"
                  ? "bg-zinc-950/40 border-zinc-900"
                  : "bg-white border-slate-200"
                }`}
            >
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <FolderGit2
                    className={`w-3.5 h-3.5 flex-shrink-0 ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
                  />
                  <span
                    className={`text-[10px] font-['JetBrains_Mono'] uppercase font-bold tracking-wider truncate ${theme === "dark" ? "text-zinc-300" : "text-slate-700"}`}
                  >
                    {project.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-sans ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}
                >
                  {formatDate(toJsDate(project?.createdAt).toISOString())} •{" "}
                  {formatSize(project?.size ?? 0)}
                </span>
              </div>

              <a
                href={project.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`self-start flex items-center gap-1.5 px-2.5 py-1.5 border font-['JetBrains_Mono'] text-[9px] font-bold uppercase tracking-wider transition-colors ${innerRoundedClass} ${theme === "dark"
                    ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
              >
                <Download className="w-3 h-3" />
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
