import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check, Edit2, X } from "lucide-react";
import { updateMentor } from "@/lib/db";
import type { Mentor } from "@/BackEnd/type";

export default function MentorCardAdmin({
        uid,
        name,
        description1,
        description2,
        picture,
}: {
        uid: string;
        name: string;
        description1: string;
        description2: string;
        picture: string;
}) {
        const [showDes2, setShowDes2] = useState<boolean>(false);
        const [updateView, setUpdateView] = useState<boolean>(false);
        const [updates, setUpdates] = useState<Partial<Mentor>>({
                name: name,
                des1: description1,
                des2: description2,
        });

        return (
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 flex flex-col">
                        <div className="flex flex-col items-center gap-4">
                                <Avatar className="w-24 h-24">
                                        <AvatarImage src={picture} className="object-cover rounded-full" />
                                        <AvatarFallback>{name?.slice(0, 1)?.toUpperCase()}</AvatarFallback>
                                </Avatar>

                                {updateView ? (
                                        <div className="flex flex-col w-full space-y-3">
                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Name
                                                        </label>
                                                        <input
                                                                value={updates.name || ""}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                onChange={(e) =>
                                                                        setUpdates((prev) => ({
                                                                                ...prev,
                                                                                name: e.target.value,
                                                                        }))
                                                                }
                                                        />
                                                </div>

                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Beschreibung (kurz)
                                                        </label>
                                                        <textarea
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                                rows={3}
                                                                value={updates.des1 || ""}
                                                                onChange={(e) =>
                                                                        setUpdates((prev) => ({
                                                                                ...prev,
                                                                                des1: e.target.value,
                                                                        }))
                                                                }
                                                        />
                                                </div>

                                                <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Beschreibung (lang)
                                                        </label>
                                                        <textarea
                                                                value={updates.des2 || ""}
                                                                rows={5}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                                onChange={(e) =>
                                                                        setUpdates((prev) => ({
                                                                                ...prev,
                                                                                des2: e.target.value,
                                                                        }))
                                                                }
                                                        />
                                                </div>
                                        </div>
                                ) : (
                                        <div className="flex flex-col items-center text-center">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
                                                <p className="text-gray-600 text-sm">{description1}</p>
                                                {showDes2 && (
                                                        <p className="pt-6 text-gray-700 text-sm whitespace-pre-wrap">
                                                                {description2}
                                                        </p>
                                                )}
                                        </div>
                                )}
                        </div>

                        <div className="flex gap-2 pt-6 mt-auto">
                                <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setShowDes2((prev) => !prev)}
                                >
                                        {showDes2 ? "Weniger anzeigen" : "Mehr anzeigen"}
                                </Button>

                                {updateView ? (
                                        <>
                                                <Button
                                                        onClick={() => (updateMentor(uid, updates), setUpdateView(false))}
                                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                                                >
                                                        <Check className="w-4 h-4" />
                                                        Speichern
                                                </Button>
                                                <Button
                                                        variant="outline"
                                                        className="flex-1 flex items-center justify-center gap-2"
                                                        onClick={() => setUpdateView(false)}
                                                >
                                                        <X className="w-4 h-4" />
                                                        Abbrechen
                                                </Button>
                                        </>
                                ) : (
                                        <Button
                                                onClick={() => setUpdateView(true)}
                                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-2"
                                        >
                                                <Edit2 className="w-4 h-4" />
                                                Bearbeiten
                                        </Button>
                                )}
                        </div>
                </div>
        );
}
